import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sekai wordmark + globe glyph. Sober, single-accent (spec §12). */
export function Logo({
  className,
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold", className)}>
      <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Globe2 className="size-4" aria-hidden />
      </span>
      {showWord && <span className="text-lg tracking-tight">Sekai</span>}
    </span>
  );
}
