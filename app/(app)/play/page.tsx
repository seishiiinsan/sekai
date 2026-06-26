import type { Metadata } from "next";
import { PlaySetup } from "@/components/play/play-setup";

export const metadata: Metadata = { title: "Jouer" };

export default function PlayPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Jouer</h1>
        <p className="text-sm text-muted-foreground">
          Choisis un mode et lance une série de questions.
        </p>
      </div>
      <PlaySetup />
    </div>
  );
}
