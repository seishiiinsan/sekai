import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DayActivity } from "@/lib/data/dashboard";

const WEEKS = 18;
const HEAT_VARS = ["--heat-0", "--heat-1", "--heat-2", "--heat-3", "--heat-4"];

function bucket(xp: number): number {
  if (xp <= 0) return 0;
  if (xp <= 25) return 1;
  if (xp <= 75) return 2;
  if (xp <= 150) return 3;
  return 4;
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** GitHub-style activity heatmap (spec §12). XP per day → intensity. */
export function StreakHeatmap({ activity }: { activity: DayActivity[] }) {
  const xpByDate = new Map(activity.map((a) => [a.date, a.xp]));

  // Work entirely in UTC so cell date strings match the UTC dates stored in
  // daily_activity (mixing local setHours with UTC toISOString shifts the grid
  // by the timezone offset and hides today's activity behind a "future" cell).
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const todayRow = (today.getUTCDay() + 6) % 7; // Monday = 0
  const todayIso = iso(today);

  const first = new Date(today);
  first.setUTCDate(today.getUTCDate() - ((WEEKS - 1) * 7 + todayRow));

  const columns: { date: string; xp: number; future: boolean }[][] = [];
  for (let col = 0; col < WEEKS; col++) {
    const week: { date: string; xp: number; future: boolean }[] = [];
    for (let row = 0; row < 7; row++) {
      const d = new Date(first);
      d.setUTCDate(first.getUTCDate() + col * 7 + row);
      const key = iso(d);
      week.push({ date: key, xp: xpByDate.get(key) ?? 0, future: key > todayIso });
    }
    columns.push(week);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">Activité</CardTitle>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Moins</span>
          {HEAT_VARS.map((v) => (
            <span
              key={v}
              className="size-3 rounded-[3px]"
              style={{ backgroundColor: `var(${v})` }}
            />
          ))}
          <span>Plus</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto" role="img" aria-label="Carte d'activité des dernières semaines">
          {columns.map((week, ci) => (
            <div key={ci} className="flex flex-col gap-1">
              {week.map((cell) => (
                <span
                  key={cell.date}
                  title={cell.future ? undefined : `${cell.date} · ${cell.xp} XP`}
                  className="size-3 rounded-[3px]"
                  style={{
                    backgroundColor: cell.future
                      ? "transparent"
                      : `var(${HEAT_VARS[bucket(cell.xp)]})`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
