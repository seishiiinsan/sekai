import { Card, CardContent } from "@/components/ui/card";
import { levelProgress } from "@/lib/game/xp";

/** Level + XP-to-next-level, presented as a score and a progress bar (spec §12). */
export function LevelCard({ totalXp }: { totalXp: number }) {
  const p = levelProgress(totalXp);
  return (
    <Card>
      <CardContent className="space-y-4 py-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Niveau</p>
            <p className="text-4xl font-bold tabular-nums leading-none">{p.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold tabular-nums">
              {totalXp.toLocaleString("fr-FR")} XP
            </p>
            <p className="text-xs text-muted-foreground">
              {p.intoLevel} / {p.levelSpan} vers niv. {p.level + 1}
            </p>
          </div>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={p.levelSpan}
          aria-valuenow={p.intoLevel}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.round(p.fraction * 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
