"use client";

import Image from "next/image";
import type { ClientQuestion } from "@/lib/game/types";

/** The instruction line for a question, in French, by variant. */
export function questionInstruction(q: ClientQuestion): string {
  if (q.mode === "flags") {
    return q.direction === "direct"
      ? "Quel pays a ce drapeau ?"
      : "Choisis le drapeau de";
  }
  return q.direction === "direct"
    ? "Quelle est la capitale de"
    : "Quel pays a pour capitale";
}

export function QuestionPrompt({ question }: { question: ClientQuestion }) {
  const instruction = questionInstruction(question);
  const showFlag = Boolean(question.promptFlagUrl);
  const emphasis = question.prompt;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">{instruction}</p>

      {showFlag ? (
        <span className="relative block aspect-[3/2] w-56 overflow-hidden rounded-lg shadow-sm ring-1 ring-border sm:w-64">
          <Image
            src={question.promptFlagUrl!}
            alt={question.promptCountryName ?? "Drapeau à identifier"}
            fill
            sizes="256px"
            priority
            className="object-cover"
          />
        </span>
      ) : (
        <p className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {emphasis}
        </p>
      )}
    </div>
  );
}
