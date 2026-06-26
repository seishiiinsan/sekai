import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { normalize } from "@/lib/text";
import type {
  ClientQuestion,
  Direction,
  GameMode,
  QuestionOption,
  Region,
  SeriesSettings,
} from "./types";

type Admin = SupabaseClient<Database>;

/** Minimal country shape needed to build questions. */
interface PoolCountry {
  id: number;
  name_fr: string;
  capital: string[];
  region: string | null;
  flag_svg_url: string | null;
  flag_alt: string | null;
  difficulty: number;
  aliases: string[];
}

/** One entry of the server-held answer key (never sent to the client). */
export interface AnswerKeyEntry {
  qid: number;
  countryId: number;
  difficulty: number;
  /** Normalised strings accepted for a free-text answer. */
  accepted: string[];
  answered: boolean;
  correct: boolean;
}

export interface GeneratedSeries {
  questions: ClientQuestion[];
  answerKey: AnswerKeyEntry[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Does this (mode, direction) require the country to have a capital? */
function needsCapital(mode: GameMode): boolean {
  return mode === "capitals";
}

/** Accepted free-text answers for a question, depending on what's being asked. */
function acceptedAnswers(
  mode: GameMode,
  direction: Direction,
  country: PoolCountry,
): string[] {
  // The answer is a capital only for "country → capital".
  if (mode === "capitals" && direction === "direct") {
    return country.capital.map(normalize).filter((s) => s.length > 0);
  }
  // Otherwise the answer is a country: reuse its name aliases.
  return country.aliases;
}

/** Build the 3 distractors + correct option for a question, shuffled. */
function buildOptions(
  mode: GameMode,
  direction: Direction,
  answer: PoolCountry,
  pool: PoolCountry[],
): QuestionOption[] {
  // Prefer distractors from the same region; fall back to the whole pool.
  const sameRegion = pool.filter(
    (c) => c.id !== answer.id && c.region === answer.region,
  );
  const others = pool.filter((c) => c.id !== answer.id);

  const asOption = (c: PoolCountry): QuestionOption => {
    // Inverse flags: the option IS a flag to pick.
    if (mode === "flags" && direction === "inverse") {
      return { countryId: c.id, label: c.name_fr, flagUrl: c.flag_svg_url ?? undefined };
    }
    // Capitals direct: the option is a capital.
    if (mode === "capitals" && direction === "direct") {
      return { countryId: c.id, label: c.capital[0] ?? c.name_fr };
    }
    // Otherwise the option is a country name.
    return { countryId: c.id, label: c.name_fr };
  };

  const distractorPool = sameRegion.length >= 3 ? sameRegion : others;
  const distractors = sample(distractorPool, 3).map(asOption);
  return shuffle([asOption(answer), ...distractors]);
}

/** Turn a chosen answer country into the client-facing question payload. */
function toClientQuestion(
  qid: number,
  mode: GameMode,
  direction: Direction,
  answer: PoolCountry,
  pool: PoolCountry[],
): ClientQuestion {
  const base = {
    id: String(qid),
    mode,
    direction,
    countryId: answer.id,
    allowsFreeInput: !(mode === "flags" && direction === "inverse"),
  };

  if (mode === "flags" && direction === "direct") {
    // Show the flag, identify the country. Generic alt so it isn't a giveaway.
    return {
      ...base,
      promptFlagUrl: answer.flag_svg_url ?? undefined,
      promptCountryName: "Drapeau à identifier",
      options: buildOptions(mode, direction, answer, pool),
    };
  }
  if (mode === "flags" && direction === "inverse") {
    // Name the country, pick its flag.
    return {
      ...base,
      prompt: answer.name_fr,
      options: buildOptions(mode, direction, answer, pool),
    };
  }
  if (mode === "capitals" && direction === "direct") {
    // Country → capital.
    return {
      ...base,
      prompt: answer.name_fr,
      options: buildOptions(mode, direction, answer, pool),
    };
  }
  // capitals inverse: capital → country.
  return {
    ...base,
    prompt: answer.capital[0] ?? "",
    options: buildOptions(mode, direction, answer, pool),
  };
}

/**
 * Generate a series. Prioritises SRS-due items (spec §7.6 "Révision du jour"),
 * then fills with fresh/random countries. Returns both the client payload (no
 * answers) and the server-only answer key.
 */
export async function generateSeries(
  admin: Admin,
  userId: string,
  settings: SeriesSettings,
): Promise<GeneratedSeries> {
  const { mode, direction, region, includeMicroStates, length } = settings;

  // Eligible pool.
  let query = admin
    .from("countries")
    .select("id,name_fr,capital,region,flag_svg_url,flag_alt,difficulty,aliases")
    .lte("difficulty", includeMicroStates ? 2 : 1);
  if (region) query = query.eq("region", region as Region);
  if (needsCapital(mode)) query = query.eq("has_capital", true);

  const { data: poolRaw, error } = await query;
  if (error) throw new Error(`Country pool query failed: ${error.message}`);
  const pool = (poolRaw ?? []) as PoolCountry[];
  if (pool.length < 4) {
    throw new Error("Pas assez de pays pour générer une série avec ces réglages.");
  }

  const poolById = new Map(pool.map((c) => [c.id, c]));

  // SRS-due items first.
  const { data: dueRows } = await admin
    .from("mastery_items")
    .select("country_id")
    .eq("user_id", userId)
    .eq("mode", mode)
    .lte("due_at", new Date().toISOString())
    .order("due_at", { ascending: true })
    .limit(length);

  const chosen: PoolCountry[] = [];
  const used = new Set<number>();
  for (const row of dueRows ?? []) {
    const c = poolById.get(row.country_id);
    if (c && !used.has(c.id)) {
      chosen.push(c);
      used.add(c.id);
      if (chosen.length >= length) break;
    }
  }

  // Fill the rest with random unseen countries from the pool.
  if (chosen.length < length) {
    const rest = shuffle(pool.filter((c) => !used.has(c.id)));
    for (const c of rest) {
      chosen.push(c);
      used.add(c.id);
      if (chosen.length >= length) break;
    }
  }

  const questions: ClientQuestion[] = [];
  const answerKey: AnswerKeyEntry[] = [];
  chosen.forEach((answer, idx) => {
    const qid = idx + 1;
    questions.push(toClientQuestion(qid, mode, direction, answer, pool));
    answerKey.push({
      qid,
      countryId: answer.id,
      difficulty: answer.difficulty,
      accepted: acceptedAnswers(mode, direction, answer),
      answered: false,
      correct: false,
    });
  });

  return { questions, answerKey };
}
