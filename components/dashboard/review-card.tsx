import Link from "next/link";
import { History, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DueByMode } from "@/lib/data/dashboard";

/** "Révision du jour" — surfaces SRS-due items first (spec §7.6). */
export function ReviewCard({ due }: { due: DueByMode }) {
  if (due.total === 0 || !due.topMode) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--success)]/15 text-[var(--success)]">
            <CheckCircle2 className="size-4.5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold">Révision à jour</p>
            <p className="text-xs text-muted-foreground">
              Rien à revoir pour l&apos;instant. Lance une nouvelle série !
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="py-5">
        <Link
          href={`/play/${due.topMode}?direction=direct&length=10&micro=false`}
          className="group flex items-center gap-3"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <History className="size-4.5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">Révision du jour</p>
            <p className="text-xs text-muted-foreground">
              {due.total} notion{due.total > 1 ? "s" : ""} à ancrer durablement.
            </p>
          </div>
          <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </CardContent>
    </Card>
  );
}
