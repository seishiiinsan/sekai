import { Target, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DAILY_XP_GOAL } from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

/** Daily objective: earn DAILY_XP_GOAL today to keep the streak alive. */
export function DailyObjective({ todayXp }: { todayXp: number }) {
  const done = todayXp >= DAILY_XP_GOAL;
  const pct = Math.min(100, Math.round((todayXp / DAILY_XP_GOAL) * 100));

  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              done ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-primary/10 text-primary",
            )}
          >
            {done ? <Check className="size-4.5" aria-hidden /> : <Target className="size-4.5" aria-hidden />}
          </span>
          <div>
            <p className="text-sm font-semibold">Objectif du jour</p>
            <p className="text-xs text-muted-foreground">
              {done
                ? "Objectif atteint, streak validé !"
                : `${todayXp} / ${DAILY_XP_GOAL} XP aujourd'hui`}
            </p>
          </div>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={DAILY_XP_GOAL}
          aria-valuenow={Math.min(todayXp, DAILY_XP_GOAL)}
        >
          <div
            className={cn("h-full rounded-full transition-all", done ? "bg-[var(--success)]" : "bg-primary")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
