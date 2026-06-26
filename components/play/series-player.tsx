"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { Keyboard, List } from "lucide-react";
import { submitAnswer, finishSeries } from "@/app/(app)/play/actions";
import type {
  AnswerResult,
  SeriesSummary,
  StartedSeries,
} from "@/lib/game/types";
import { SeriesProgress } from "./series-progress";
import { QuestionPrompt } from "./question-prompt";
import { ChoiceGrid } from "./choice-grid";
import { FreeInput } from "./free-input";
import { AnswerFeedback } from "./answer-feedback";
import { ResultSummary } from "./result-summary";
import { cn } from "@/lib/utils";

type Phase = "answering" | "feedback" | "finished";

export function SeriesPlayer({
  initial,
  replayHref,
}: {
  initial: StartedSeries;
  replayHref: string;
}) {
  const reduce = useReducedMotion();
  const { questions } = initial;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [useFree, setUseFree] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [pending, setPending] = useState(false);
  const [summary, setSummary] = useState<SeriesSummary | null>(null);

  const startedAt = useRef<number>(Date.now());
  const question = questions[index];
  const isLast = index >= total - 1;

  async function grade(payload: { choiceCountryId?: number; freeText?: string }) {
    if (pending || phase !== "answering") return;
    setPending(true);
    try {
      const res = await submitAnswer({
        sessionId: initial.sessionId,
        qid: Number(question.id),
        responseMs: Date.now() - startedAt.current,
        ...payload,
      });
      setResult(res);
      setTotalXp((x) => x + res.xpEarned);
      setCombo(res.combo);
      setPhase("feedback");
    } catch {
      toast.error("Impossible d'enregistrer ta réponse. Réessaie.");
    } finally {
      setPending(false);
    }
  }

  async function next() {
    if (pending) return;
    if (!isLast) {
      setIndex((i) => i + 1);
      setSelectedId(null);
      setResult(null);
      setPhase("answering");
      startedAt.current = Date.now();
      return;
    }
    setPending(true);
    try {
      const s = await finishSeries({ sessionId: initial.sessionId });
      setSummary(s);
      setPhase("finished");
    } catch {
      toast.error("Impossible de terminer la série. Réessaie.");
    } finally {
      setPending(false);
    }
  }

  if (phase === "finished" && summary) {
    return <ResultSummary summary={summary} replayHref={replayHref} />;
  }

  const freePlaceholder =
    question.mode === "capitals" && question.direction === "direct"
      ? "Tape la capitale…"
      : "Tape le nom du pays…";

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <SeriesProgress index={index} total={total} xp={totalXp} combo={combo} />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <QuestionPrompt question={question} />

          {useFree && question.allowsFreeInput ? (
            <FreeInput
              disabled={phase !== "answering"}
              placeholder={freePlaceholder}
              onSubmit={(value) => grade({ freeText: value })}
            />
          ) : (
            <ChoiceGrid
              question={question}
              disabled={phase !== "answering"}
              selectedId={selectedId}
              correctId={phase === "feedback" && result ? result.answer.id : null}
              onSelect={(id) => {
                setSelectedId(id);
                grade({ choiceCountryId: id });
              }}
            />
          )}

          {question.allowsFreeInput && phase === "answering" && (
            <button
              type="button"
              onClick={() => setUseFree((v) => !v)}
              className={cn(
                "mx-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              )}
            >
              {useFree ? (
                <>
                  <List className="size-3.5" aria-hidden /> Revenir au choix multiple
                </>
              ) : (
                <>
                  <Keyboard className="size-3.5" aria-hidden /> Répondre en tapant
                </>
              )}
            </button>
          )}

          {phase === "feedback" && result && (
            <AnswerFeedback
              result={result}
              isLast={isLast}
              pending={pending}
              onContinue={next}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
