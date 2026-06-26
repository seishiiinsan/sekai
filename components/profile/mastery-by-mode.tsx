import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODE_LABELS } from "@/lib/game/types";
import type { MasteryTier } from "@/lib/game/srs";
import type { ModeMastery } from "@/lib/data/profile-stats";

const TIER_ORDER: MasteryTier[] = ["new", "learning", "familiar", "strong", "mastered"];
const TIER_LABEL: Record<MasteryTier, string> = {
  new: "Découverte",
  learning: "En cours",
  familiar: "Familier",
  strong: "Solide",
  mastered: "Maîtrisé",
};
const TIER_COLOR: Record<MasteryTier, string> = {
  new: "var(--muted)",
  learning: "var(--heat-2)",
  familiar: "var(--heat-3)",
  strong: "var(--chart-2)",
  mastered: "var(--primary)",
};

function ModeRow({ data }: { data: ModeMastery }) {
  const { total } = data;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{MODE_LABELS[data.mode]}</span>
        <span className="text-xs text-muted-foreground">
          {total === 0 ? "Pas encore joué" : `${data.mastered}/${total} maîtrisés`}
        </span>
      </div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
        {total > 0 &&
          TIER_ORDER.map((tier) => {
            const count = data.tiers[tier];
            if (count === 0) return null;
            return (
              <span
                key={tier}
                title={`${TIER_LABEL[tier]} : ${count}`}
                style={{
                  width: `${(count / total) * 100}%`,
                  backgroundColor: TIER_COLOR[tier],
                }}
              />
            );
          })}
      </div>
    </div>
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
          {TIER_ORDER.map((tier) => (
            <span key={tier} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-2.5 rounded-[3px]"
                style={{ backgroundColor: TIER_COLOR[tier] }}
              />
              {TIER_LABEL[tier]}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
