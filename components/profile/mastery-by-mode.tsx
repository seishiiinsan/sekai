import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODE_LABELS } from "@/lib/game/types";
import type { ModeMastery } from "@/lib/data/profile-stats";

// Intermediate "discovered but not mastered" colour: a lighter indigo than the
// solid "mastered" primary, while the muted track shows "still to discover".
const SEEN_COLOR = "var(--chart-3)";

function ModeRow({ data }: { data: ModeMastery }) {
  const total = data.total || 1;
  const masteredPct = (data.mastered / total) * 100;
  const inProgress = Math.max(0, data.seen - data.mastered);
  const inProgressPct = (inProgress / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{MODE_LABELS[data.mode]}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {data.mastered} / {data.total} maîtrisées
        </span>
      </div>
      <div
        className="flex h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={data.total}
        aria-valuenow={data.mastered}
        aria-label={`${MODE_LABELS[data.mode]} : ${data.mastered} maîtrisées, ${data.seen} découvertes sur ${data.total}`}
      >
        <span className="h-full bg-primary transition-all" style={{ width: `${masteredPct}%` }} />
        <span
          className="h-full transition-all"
          style={{ width: `${inProgressPct}%`, backgroundColor: SEEN_COLOR }}
        />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="size-2.5 rounded-[3px]" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export function MasteryByMode({ byMode }: { byMode: ModeMastery[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Maîtrise par mode</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {byMode.map((m) => (
          <ModeRow key={m.mode} data={m} />
        ))}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
          <LegendItem color="var(--primary)" label="Maîtrisées (réussite > 80%)" />
          <LegendItem color={SEEN_COLOR} label="Découvertes" />
          <LegendItem color="var(--muted)" label="À découvrir" />
        </div>
      </CardContent>
    </Card>
  );
}
