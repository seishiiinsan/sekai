"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientQuestion } from "@/lib/game/types";

interface ChoiceGridProps {
  question: ClientQuestion;
  disabled: boolean;
  selectedId: number | null;
  correctId: number | null;
  onSelect: (countryId: number) => void;
}

/** QCM options. Renders flags (inverse-flags mode) or text labels. */
export function ChoiceGrid({
  question,
  disabled,
  selectedId,
  correctId,
  onSelect,
}: ChoiceGridProps) {
  const isFlagChoice = question.mode === "flags" && question.direction === "inverse";

  return (
    <div
      className={cn("grid gap-3", isFlagChoice ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2")}
      role="group"
      aria-label="Réponses possibles"
    >
      {question.options?.map((opt, i) => {
        const isCorrect = correctId === opt.countryId;
        const isChosen = selectedId === opt.countryId;
        const showCorrect = disabled && isCorrect;
        const showWrong = disabled && isChosen && !isCorrect;

        return (
          <button
            key={opt.countryId}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt.countryId)}
            // Anti-cheat: never label a flag option with its country name — that
            // would announce the answer (spec §11). Use a neutral position label.
            aria-label={isFlagChoice ? `Drapeau ${i + 1}` : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-xl border bg-card p-3 text-left text-sm font-medium transition-all",
              "enabled:hover:border-primary/40 enabled:hover:bg-accent",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              showCorrect && "border-[var(--success)] bg-[var(--success)]/10",
              showWrong && "border-destructive bg-destructive/10",
              disabled && !showCorrect && !showWrong && "opacity-60",
            )}
          >
            {isFlagChoice ? (
              <span className="relative block aspect-[3/2] w-full overflow-hidden rounded-md bg-muted ring-1 ring-border">
                {opt.flagUrl && (
                  <Image
                    src={opt.flagUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 45vw, 220px"
                    className="object-contain"
                  />
                )}
              </span>
            ) : (
              <span className="flex-1">{opt.label}</span>
            )}

            {showCorrect && (
              <Check className="absolute top-2 right-2 size-4 text-[var(--success)]" aria-hidden />
            )}
            {showWrong && (
              <X className="absolute top-2 right-2 size-4 text-destructive" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
