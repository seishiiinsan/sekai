"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { REGION_LABELS } from "@/lib/game/types";
import type { MasteryStatus, AtlasCountry } from "@/lib/data/atlas";

const STATUS_LABEL: Record<MasteryStatus, string> = {
  unseen: "Non découvert",
  learning: "En cours",
  mastered: "Maîtrisé",
};

const STATUS_DOT: Record<MasteryStatus, string> = {
  unseen: "bg-muted-foreground/30",
  learning: "bg-yellow-500",
  mastered: "bg-primary",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function MasteryRow({ label, status }: { label: string; status: MasteryStatus }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium">
        <span className={cn("size-2 rounded-full", STATUS_DOT[status])} aria-hidden />
        {STATUS_LABEL[status]}
      </span>
    </div>
  );
}

function formatArea(km2: number): string {
  return km2.toLocaleString("fr-FR") + " km²";
}

export function CountryModal({
  country,
  open,
  onClose,
}: {
  country: AtlasCountry | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed inset-x-4 top-1/2 z-50 mx-auto max-h-[90vh] max-w-sm -translate-y-1/2 overflow-y-auto overflow-x-hidden rounded-2xl border bg-card shadow-xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          {country && (
            <>
              {/* Drapeau */}
              <div className="relative aspect-[3/2] w-full bg-muted">
                <span className="absolute inset-3">
                  {country.flag_svg_url && (
                    <Image
                      src={country.flag_svg_url}
                      alt={country.flag_alt ?? `Drapeau ${country.name_fr}`}
                      fill
                      sizes="448px"
                      className="object-contain"
                    />
                  )}
                </span>
              </div>

              {/* Contenu */}
              <div className="p-5">
                {/* En-tête */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Dialog.Title className="text-xl font-semibold leading-tight">
                      {country.name_fr}
                    </Dialog.Title>
                    {country.name_official !== country.name_fr && (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground italic">
                        {country.name_official}
                      </p>
                    )}
                    {country.region && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {country.subregion
                          ? `${country.subregion} · ${REGION_LABELS[country.region as keyof typeof REGION_LABELS] ?? country.region}`
                          : (REGION_LABELS[country.region as keyof typeof REGION_LABELS] ?? country.region)}
                      </p>
                    )}
                  </div>
                  <Dialog.Close
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label="Fermer"
                  >
                    <X className="size-4" aria-hidden />
                  </Dialog.Close>
                </div>

                {/* Infos géographiques */}
                <div className="mt-4 space-y-2 rounded-lg bg-muted/40 p-3">
                  {country.capital.length > 0 && (
                    <InfoRow
                      label={country.capital.length > 1 ? "Capitales" : "Capitale"}
                      value={country.capital.join(", ")}
                    />
                  )}
                  {country.area != null && country.area > 0 && (
                    <InfoRow label="Superficie" value={formatArea(country.area)} />
                  )}
                  <InfoRow
                    label="Codes ISO"
                    value={
                      <span className="font-mono text-xs">
                        {country.cca2} · {country.cca3}
                      </span>
                    }
                  />
                  {country.difficulty === 2 && (
                    <InfoRow label="Statut" value="Micro-État" />
                  )}
                </div>

                {/* Maîtrise */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Maîtrise
                  </p>
                  <MasteryRow label="Drapeaux" status={country.mastery.flags} />
                  {country.has_capital && (
                    <MasteryRow label="Capitales" status={country.mastery.capitals} />
                  )}
                </div>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
