"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSeries, type AnswerKeyEntry } from "@/lib/game/questions";
import { signFlagToken } from "@/lib/game/flag-token";
import { reviewItem, NEW_SRS_STATE, type SrsState } from "@/lib/game/srs";
import { xpForAnswer, levelForXp } from "@/lib/game/xp";
import { validateChoice, validateFreeInput } from "@/lib/game/validation";
import { GAME_MODES, DIRECTIONS } from "@/lib/game/types";
import type { Json, Tables } from "@/lib/supabase/database.types";
import type {
  AnswerResult,
  SeriesSummary,
  StartedSeries,
  SubmitAnswerInput,
  SeriesSettings,
} from "@/lib/game/types";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania", "Antarctic"] as const;

const settingsSchema = z.object({
  mode: z.enum(GAME_MODES as [string, ...string[]]),
  direction: z.enum(DIRECTIONS as [string, ...string[]]),
  region: z.enum(REGIONS).optional(),
  includeMicroStates: z.boolean().default(false),
  length: z.number().int().min(5).max(20).default(10),
});

async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié.");
  return user.id;
}

/** Start a series: generate questions, persist the answer key server-side. */
export async function startSeries(raw: unknown): Promise<StartedSeries> {
  const settings = settingsSchema.parse(raw) as SeriesSettings;
  const userId = await requireUserId();
  const admin = createAdminClient();

  const { questions, answerKey } = await generateSeries(admin, userId, settings);

  const { data, error } = await admin
    .from("game_sessions")
    .insert({
      user_id: userId,
      mode: settings.mode,
      direction: settings.direction,
      answer_key: answerKey as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Impossible de démarrer la série.");
  }

  // Rewrite flag URLs to opaque, session-scoped proxy tokens so the ISO code
  // (and thus the answer) never reaches the client (spec §11). The prompt flag
  // belongs to the question's answer; option flags belong to each option.
  const sessionId = data.id;
  const answerByQid = new Map(answerKey.map((e) => [String(e.qid), e.countryId]));
  const tokenized = questions.map((q) => ({
    ...q,
    promptFlagUrl: q.promptFlagUrl
      ? `/api/flag/${signFlagToken(sessionId, answerByQid.get(q.id)!)}`
      : q.promptFlagUrl,
    options: q.options?.map((o) => ({
      ...o,
      flagUrl: o.flagUrl ? `/api/flag/${signFlagToken(sessionId, o.countryId)}` : o.flagUrl,
    })),
  }));

  return { sessionId, questions: tokenized, settings };
}

const submitSchema = z.object({
  sessionId: z.string().uuid(),
  qid: z.number().int().positive(),
  choiceCountryId: z.number().int().positive().optional(),
  freeText: z.string().max(120).optional(),
  responseMs: z.number().int().nonnegative().max(600000).optional(),
});

/**
 * Grade one answer. Correctness is decided here from the stored answer key —
 * the client is never trusted (spec §11). Also advances SRS and logs the attempt.
 */
export async function submitAnswer(raw: SubmitAnswerInput): Promise<AnswerResult> {
  const input = submitSchema.parse(raw);
  const userId = await requireUserId();
  const admin = createAdminClient();

  const { data: session } = await admin
    .from("game_sessions")
    .select("id,user_id,mode,direction,answer_key,combo,xp_earned,status")
    .eq("id", input.sessionId)
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (!session) throw new Error("Session introuvable ou terminée.");

  const answerKey = session.answer_key as unknown as AnswerKeyEntry[];
  const entry = answerKey.find((e) => e.qid === input.qid);
  if (!entry) throw new Error("Question inconnue.");
  if (entry.answered) throw new Error("Question déjà répondue.");

  // ---- Server-authoritative grading ----
  let correct = false;
  if (input.choiceCountryId != null) {
    correct = validateChoice(input.choiceCountryId, entry.countryId);
  } else if (input.freeText && input.freeText.trim().length > 0) {
    correct = validateFreeInput(input.freeText, entry.accepted);
  }

  const comboBefore = session.combo;
  const xpEarned = xpForAnswer({
    correct,
    difficulty: entry.difficulty,
    responseMs: input.responseMs,
    combo: comboBefore,
  });

  // ---- SRS update ----
  const { data: masteryRow } = await admin
    .from("mastery_items")
    .select("srs_level,ease,interval_days,reps,lapses")
    .eq("user_id", userId)
    .eq("country_id", entry.countryId)
    .eq("mode", session.mode)
    .maybeSingle();

  const prev: SrsState = masteryRow
    ? {
        srsLevel: masteryRow.srs_level,
        ease: Number(masteryRow.ease),
        intervalDays: masteryRow.interval_days,
        reps: masteryRow.reps,
        lapses: masteryRow.lapses,
      }
    : NEW_SRS_STATE;
  const next = reviewItem(prev, correct);

  await admin.from("mastery_items").upsert(
    {
      user_id: userId,
      country_id: entry.countryId,
      mode: session.mode,
      srs_level: next.srsLevel,
      ease: next.ease,
      interval_days: next.intervalDays,
      reps: next.reps,
      lapses: next.lapses,
      due_at: next.dueAt.toISOString(),
      last_reviewed_at: next.lastReviewedAt.toISOString(),
    },
    { onConflict: "user_id,country_id,mode" },
  );

  await admin.from("attempts").insert({
    user_id: userId,
    country_id: entry.countryId,
    mode: session.mode,
    direction: session.direction,
    is_correct: correct,
    response_ms: input.responseMs ?? null,
    xp_earned: xpEarned,
  });

  // ---- Persist session progress ----
  entry.answered = true;
  entry.correct = correct;
  const newCombo = correct ? comboBefore + 1 : 0;
  await admin
    .from("game_sessions")
    .update({
      answer_key: answerKey as unknown as Json,
      combo: newCombo,
      xp_earned: session.xp_earned + xpEarned,
    })
    .eq("id", session.id);

  // ---- Reveal the correct country for feedback ----
  const { data: country } = await admin
    .from("countries")
    .select("id,name_fr,capital,flag_svg_url")
    .eq("id", entry.countryId)
    .single();

  return {
    correct,
    xpEarned,
    combo: newCombo,
    answer: {
      id: entry.countryId,
      name: country?.name_fr ?? "",
      capital: country?.capital?.[0] ?? null,
      flagUrl: country?.flag_svg_url ?? null,
    },
  };
}

const finishSchema = z.object({ sessionId: z.string().uuid() });

/** Close a series: credit XP, advance streak/level, return the summary. */
export async function finishSeries(raw: { sessionId: string }): Promise<SeriesSummary> {
  const { sessionId } = finishSchema.parse(raw);
  const userId = await requireUserId();
  const admin = createAdminClient();

  const { data: session } = await admin
    .from("game_sessions")
    .select("id,user_id,answer_key,xp_earned,status,mode")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (!session) throw new Error("Session introuvable.");

  const answerKey = session.answer_key as unknown as AnswerKeyEntry[];
  const total = answerKey.length;
  const correct = answerKey.filter((e) => e.correct).length;
  const xpEarned = session.xp_earned;

  let level = 1;
  let currentStreak = 0;
  let leveledUp = false;

  if (session.status === "active") {
    await admin
      .from("game_sessions")
      .update({ status: "finished", finished_at: new Date().toISOString() })
      .eq("id", session.id);

    const { data, error } = await admin
      .rpc("apply_series_result", { p_user: userId, p_xp: xpEarned, p_series: 1 })
      .single();
    const profile = data as Tables<"profiles"> | null;
    if (error || !profile) throw new Error("Échec de l'attribution des points.");

    level = profile.level;
    currentStreak = profile.current_streak;
    const oldLevel = levelForXp(profile.total_xp - xpEarned);
    leveledUp = level > oldLevel;
  } else {
    // Already finished — return a consistent summary without double-crediting.
    const { data: profile } = await admin
      .from("profiles")
      .select("level,current_streak")
      .eq("id", userId)
      .single();
    level = profile?.level ?? 1;
    currentStreak = profile?.current_streak ?? 0;
  }

  // Review list: countries from this series, with their names.
  const ids = answerKey.map((e) => e.countryId);
  const { data: countries } = await admin
    .from("countries")
    .select("id,name_fr")
    .in("id", ids);
  const nameById = new Map((countries ?? []).map((c) => [c.id, c.name_fr]));

  const reviewItems = answerKey.map((e) => ({
    countryId: e.countryId,
    name: nameById.get(e.countryId) ?? "",
    correct: e.correct,
  }));

  return { xpEarned, correct, total, level, leveledUp, currentStreak, reviewItems };
}
