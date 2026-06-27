"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { REGION_LABELS, type Region } from "@/lib/game/types";
import { CountryCard } from "@/components/atlas/country-card";
import { CountryModal } from "@/components/atlas/country-modal";
import type { AtlasCountry } from "@/lib/data/atlas";

const ALL_REGIONS = Object.keys(REGION_LABELS) as Region[];

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

export function AtlasGrid({ countries }: { countries: AtlasCountry[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [showMicro, setShowMicro] = useState(false);
  const [selected, setSelected] = useState<AtlasCountry | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return countries.filter((c) => {
      if (!showMicro && c.difficulty > 1) return false;
      if (region !== "all" && c.region !== region) return false;
      if (q) {
        const matchName = c.name_fr.toLowerCase().includes(q);
        const matchAlias = c.aliases.some((a) => a.includes(q));
        if (!matchName && !matchAlias) return false;
      }
      return true;
    });
  }, [countries, query, region, showMicro]);

  return (
    <div className="space-y-4">
      {/* Search + micro toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un pays…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="micro-atlas" checked={showMicro} onCheckedChange={setShowMicro} />
          <Label htmlFor="micro-atlas" className="text-sm cursor-pointer">
            Micro-États
          </Label>
        </div>
      </div>

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <Chip active={region === "all"} onClick={() => setRegion("all")}>
          Tous
        </Chip>
        {ALL_REGIONS.map((r) => (
          <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
            {REGION_LABELS[r]}
          </Chip>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} pays
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              onSelect={setSelected}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border bg-muted/30">
          <p className="text-sm text-muted-foreground">Aucun pays trouvé.</p>
        </div>
      )}

      {/* Modal */}
      <CountryModal
        country={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
