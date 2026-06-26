"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Trophy, Target, Flame, ArrowUpRight, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui-ext/animated-number";
import type { SeriesSummary } from "@/lib/game/types";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex flex-row items-center gap-3 p-4">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="text-lg font-semibold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}

export function ResultSummary({
  summary,
  replayHref,
}: {
  summary: SeriesSummary;
  replayHref: string;
}) {
  const reduce = useReducedMotion();
  const accuracy = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;
  const toReview = summary.reviewItems.filter((i) => !i.correct);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Trophy className="size-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Série terminée</h1>
        <p className="mt-1 text-4xl font-bold text-primary tabular-nums">
          +<AnimatedNumber value={summary.xpEarned} /> XP
        </p>
        {summary.leveledUp && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <ArrowUpRight className="size-4" aria-hidden />
            Niveau {summary.level} atteint !
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Target} label="Précision" value={`${accuracy}%`} />
        <Stat icon={Check} label="Bonnes" value={`${summary.correct}/${summary.total}`} />
        <Stat icon={Flame} label="Série" value={`${summary.currentStreak} j`} />
      </div>

      {toReview.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold">À revoir</h2>
          <ul className="space-y-1.5">
            {toReview.map((item) => (
              <li
                key={item.countryId}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <X className="size-3.5 shrink-0 text-destructive" aria-hidden />
                {item.name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Ces notions reviendront en priorité dans ta révision du jour.
          </p>
        </Card>
      )}

      <div className="flex gap-3">
        <Button nativeButton={false} render={<Link href={replayHref} />} className="flex-1">
          <RotateCcw className="size-4" aria-hidden />
          Rejouer
        </Button>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/dashboard" />}
          className="flex-1"
        >
          Tableau de bord
        </Button>
      </div>
    </motion.div>
  );
}
