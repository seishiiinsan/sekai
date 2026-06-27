import Image from "next/image";
import { cn } from "@/lib/utils";
import type { MasteryStatus, AtlasCountry } from "@/lib/data/atlas";

const STATUS_CLASSES: Record<MasteryStatus, string> = {
  unseen: "bg-muted-foreground/30",
  learning: "bg-yellow-500",
  mastered: "bg-primary",
};

const STATUS_LABELS: Record<MasteryStatus, string> = {
  unseen: "Non découvert",
  learning: "En cours",
  mastered: "Maîtrisé",
};

function MasteryDot({ label, status }: { label: string; status: MasteryStatus }) {
  return (
    <span
      className={cn("size-2 rounded-full", STATUS_CLASSES[status])}
      aria-label={`${label} : ${STATUS_LABELS[status]}`}
      title={`${label} : ${STATUS_LABELS[status]}`}
    />
  );
}

export function CountryCard({
  country,
  onSelect,
}: {
  country: AtlasCountry;
  onSelect: (c: AtlasCountry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(country)}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors hover:border-primary/40 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="relative block aspect-[3/2] w-full overflow-hidden bg-muted ring-1 ring-border/50">
        {country.flag_svg_url ? (
          <Image
            src={country.flag_svg_url}
            alt={country.flag_alt ?? `Drapeau ${country.name_fr}`}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-contain"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-muted-foreground text-xs">
            —
          </span>
        )}
      </span>

      <div className="flex flex-1 flex-col p-3">
        <p className="truncate font-semibold leading-tight">{country.name_fr}</p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {country.capital[0] ?? "—"}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <MasteryDot label="Drapeaux" status={country.mastery.flags} />
          {country.has_capital && (
            <MasteryDot label="Capitales" status={country.mastery.capitals} />
          )}
        </div>
      </div>
    </button>
  );
}
