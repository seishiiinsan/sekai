import { Zap, TrendingUp, Flame, Award, Globe2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0">
          <div className="text-lg font-semibold tabular-nums leading-tight">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatGrid({
  totalXp,
  level,
  currentStreak,
  longestStreak,
  mastered,
}: {
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  mastered: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <StatCard icon={Zap} label="XP total" value={totalXp.toLocaleString("fr-FR")} />
      <StatCard icon={TrendingUp} label="Niveau" value={String(level)} />
      <StatCard icon={Flame} label="Série actuelle" value={`${currentStreak} j`} />
      <StatCard icon={Award} label="Record de série" value={`${longestStreak} j`} />
      <StatCard icon={Globe2} label="Notions maîtrisées" value={String(mastered)} />
    </div>
  );
}
