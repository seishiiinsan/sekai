"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  MODE_LABELS,
  REGION_LABELS,
  VARIANT_LABELS,
  type GameMode,
  type Direction,
  type Region,
} from "@/lib/game/types";

const PLAYABLE_REGIONS: Region[] = [
  "Europe",
  "Africa",
  "Asia",
  "Americas",
  "Oceania",
];
const LENGTHS = [5, 10, 15] as const;
const VARIANTS: { mode: GameMode; direction: Direction; icon: typeof Flag }[] = [
  { mode: "flags", direction: "direct", icon: Flag },
  { mode: "flags", direction: "inverse", icon: Flag },
  { mode: "capitals", direction: "direct", icon: Building2 },
  { mode: "capitals", direction: "inverse", icon: Building2 },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

export function PlaySetup() {
  const router = useRouter();
  const [region, setRegion] = useState<Region | "all">("all");
  const [length, setLength] = useState<number>(10);
  const [includeMicro, setIncludeMicro] = useState(false);

  function start(mode: GameMode, direction: Direction) {
    const params = new URLSearchParams({
      direction,
      length: String(length),
      micro: String(includeMicro),
    });
    if (region !== "all") params.set("region", region);
    router.push(`/play/${mode}?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Réglages de la série</CardTitle>
          <CardDescription>Affine ta session avant de lancer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Région</Label>
            <div className="flex flex-wrap gap-2">
              <Chip active={region === "all"} onClick={() => setRegion("all")}>
                Tout le monde
              </Chip>
              {PLAYABLE_REGIONS.map((r) => (
                <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
                  {REGION_LABELS[r]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Longueur</Label>
            <div className="flex gap-2">
              {LENGTHS.map((l) => (
                <Chip key={l} active={length === l} onClick={() => setLength(l)}>
                  {l} questions
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="micro" className="text-sm">Inclure les micro-États</Label>
              <p className="text-xs text-muted-foreground">
                Vatican, Monaco, territoires… pour les experts.
              </p>
            </div>
            <Switch id="micro" checked={includeMicro} onCheckedChange={setIncludeMicro} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {VARIANTS.map(({ mode, direction, icon: Icon }) => (
          <button
            key={`${mode}-${direction}`}
            type="button"
            onClick={() => start(mode, direction)}
            className="group flex items-center justify-between rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <div className="text-sm font-semibold">{MODE_LABELS[mode]}</div>
                <div className="text-xs text-muted-foreground">
                  {VARIANT_LABELS[mode][direction]}
                </div>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
