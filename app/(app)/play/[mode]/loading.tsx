import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <p className="text-sm">Préparation de ta série…</p>
    </div>
  );
}
