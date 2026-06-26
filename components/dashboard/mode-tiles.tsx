import Link from "next/link";
import { Flag, Building2, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MODE_LABELS, VARIANT_LABELS, type GameMode, type Direction } from "@/lib/game/types";

const VARIANTS: { mode: GameMode; direction: Direction; icon: typeof Flag }[] = [
  { mode: "flags", direction: "direct", icon: Flag },
  { mode: "capitals", direction: "direct", icon: Building2 },
  { mode: "flags", direction: "inverse", icon: Flag },
  { mode: "capitals", direction: "inverse", icon: Building2 },
];

/** Quick-launch tiles for each mode/direction (default 10-question series). */
export function ModeTiles() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Jouer une série</CardTitle>
        <Link href="/play" className="text-xs text-primary underline-offset-4 hover:underline">
          Plus d&apos;options
        </Link>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {VARIANTS.map(({ mode, direction, icon: Icon }) => (
          <Link
            key={`${mode}-${direction}`}
            href={`/play/${mode}?direction=${direction}&length=10&micro=false`}
            className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-medium">{MODE_LABELS[mode]}</span>
                <span className="block text-xs text-muted-foreground">
                  {VARIANT_LABELS[mode][direction]}
                </span>
              </span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
