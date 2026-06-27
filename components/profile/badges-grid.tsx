import {
  Footprints,
  Flame,
  Star,
  Target,
  Flag,
  Landmark,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BadgeView } from "@/lib/data/badges";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Footprints,
  Flame,
  Star,
  Target,
  Flag,
  Landmark,
};

export function BadgesGrid({
  items,
  earnedCount,
}: {
  items: BadgeView[];
  earnedCount: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Badges{" "}
          <span className="font-normal text-muted-foreground">
            · {earnedCount}/{items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((b) => {
            const Icon = ICONS[b.icon] ?? Star;
            return (
              <div
                key={b.key}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 text-center",
                  b.earned ? "border-primary/30 bg-primary/5" : "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    b.earned ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {b.earned ? (
                    <Icon className="size-5" aria-hidden />
                  ) : (
                    <Lock className="size-5" aria-hidden />
                  )}
                </span>
                <div>
                  <p className="text-xs font-semibold">{b.label}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
