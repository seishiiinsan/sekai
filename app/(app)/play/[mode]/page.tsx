import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { startSeries } from "../actions";
import { SeriesPlayer } from "@/components/play/series-player";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GAME_MODES, type GameMode, type SeriesSettings } from "@/lib/game/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  direction?: string;
  region?: string;
  length?: string;
  micro?: string;
}>;

export default async function PlayModePage({
  params,
  searchParams,
}: {
  params: Promise<{ mode: string }>;
  searchParams: SearchParams;
}) {
  const { mode } = await params;
  if (!GAME_MODES.includes(mode as GameMode)) notFound();

  const sp = await searchParams;
  const direction = sp.direction === "inverse" ? "inverse" : "direct";
  const includeMicroStates = sp.micro === "true";
  const length = Math.min(20, Math.max(5, Number.parseInt(sp.length ?? "10") || 10));

  const settings: SeriesSettings = {
    mode: mode as GameMode,
    direction,
    region: sp.region as SeriesSettings["region"],
    includeMicroStates,
    length,
  };

  let started;
  try {
    started = await startSeries(settings);
  } catch {
    return (
      <Card className="mx-auto max-w-md p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 size-8 text-muted-foreground" aria-hidden />
        <h1 className="text-lg font-semibold">Impossible de lancer la série</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pas assez de pays pour ces réglages. Essaie une autre région ou inclus
          les micro-États.
        </p>
        <Button nativeButton={false} render={<Link href="/play" />} className="mt-4">
          Revenir aux réglages
        </Button>
      </Card>
    );
  }

  const replay = new URLSearchParams({
    direction,
    length: String(length),
    micro: String(includeMicroStates),
  });
  if (sp.region) replay.set("region", sp.region);

  return (
    <SeriesPlayer initial={started} replayHref={`/play/${mode}?${replay.toString()}`} />
  );
}
