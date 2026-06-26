"use client";

import Link from "next/link";
import { X, Flame, Zap } from "lucide-react";
import { AnimatedNumber } from "@/components/ui-ext/animated-number";

export function SeriesProgress({
  index,
  total,
  xp,
  combo,
}: {
  index: number;
  total: number;
  xp: number;
  combo: number;
}) {
  const pct = Math.round((index / total) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Link
          href="/play"
          aria-label="Quitter la série"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-5" />
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}>
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-primary">
          <Zap className="size-4" aria-hidden />
          <AnimatedNumber value={xp} />
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {Math.min(index + 1, total)} / {total}
        </span>
        {combo >= 2 && (
          <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-500">
            <Flame className="size-3.5" aria-hidden />
            Combo ×{combo}
          </span>
        )}
      </div>
    </div>
  );
}
