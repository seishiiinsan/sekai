import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { startReviewSeries } from "../actions";
import { SeriesPlayer } from "@/components/play/series-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Révision du jour" };

export default async function ReviewPage() {
  let started;
  try {
    started = await startReviewSeries();
  } catch {
    // Nothing due (or transient error): invite the player to a fresh series.
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[var(--success)]/15 text-[var(--success)]">
            <CheckCircle2 className="size-6" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-semibold">Révision à jour</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rien à revoir pour l&apos;instant. Lance une nouvelle série pour
              découvrir de nouveaux pays.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/play" />} className="mt-2">
            Choisir un mode
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <SeriesPlayer initial={started} replayHref="/play/review" />;
}
