"use client";

import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnswerResult } from "@/lib/game/types";

export function AnswerFeedback({
  result,
  isLast,
  pending,
  onContinue,
}: {
  result: AnswerResult;
  isLast: boolean;
  pending: boolean;
  onContinue: () => void;
}) {
  const { correct, xpEarned, answer } = result;
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border p-4",
        correct
          ? "border-[var(--success)]/30 bg-[var(--success)]/5"
          : "border-destructive/30 bg-destructive/5",
      )}
      role="status"
    >
      <div className="flex items-center gap-3">
        {correct ? (
          <CheckCircle2 className="size-6 text-[var(--success)]" aria-hidden />
        ) : (
          <XCircle className="size-6 text-destructive" aria-hidden />
        )}
        <div className="flex-1">
          <p className="font-semibold">{correct ? "Bonne réponse !" : "Raté"}</p>
          <p className="text-sm text-muted-foreground">
            {answer.flagUrl && (
              <Image
                src={answer.flagUrl}
                alt=""
                width={20}
                height={14}
                className="mr-1.5 inline-block rounded-[2px] align-[-2px] ring-1 ring-border"
              />
            )}
            <span className="font-medium text-foreground">{answer.name}</span>
            {answer.capital ? ` — ${answer.capital}` : ""}
          </p>
        </div>
        {correct && xpEarned > 0 && (
          <span className="text-sm font-semibold text-primary">+{xpEarned} XP</span>
        )}
      </div>

      <Button onClick={onContinue} disabled={pending} className="w-full">
        {isLast ? "Voir le résultat" : "Continuer"}
      </Button>
    </div>
  );
}
