/**
 * Badge catalogue + pure award logic (spec §13 gamification). Definitions live
 * in code (no DB table); only earned keys are persisted in public.user_badges.
 * `icon` is a lucide icon name resolved by the UI.
 */
export interface BadgeDef {
  key: string;
  label: string;
  description: string;
  icon: string;
}

export const BADGES: BadgeDef[] = [
  { key: "first_series", label: "Premiers pas", description: "Termine ta première série.", icon: "Footprints" },
  { key: "streak_7", label: "Régulier", description: "Atteins une série de 7 jours.", icon: "Flame" },
  { key: "streak_30", label: "Increvable", description: "Atteins une série de 30 jours.", icon: "Flame" },
  { key: "level_5", label: "Apprenti", description: "Atteins le niveau 5.", icon: "Star" },
  { key: "level_10", label: "Géographe", description: "Atteins le niveau 10.", icon: "Star" },
  { key: "perfect_series", label: "Sans faute", description: "Réussis une série de 10 questions sans aucune erreur.", icon: "Target" },
  { key: "flags_master", label: "Maître des drapeaux", description: "Maîtrise tous les drapeaux du catalogue principal.", icon: "Flag" },
  { key: "capitals_master", label: "Maître des capitales", description: "Maîtrise toutes les capitales du catalogue principal.", icon: "Landmark" },
];

export const BADGE_BY_KEY: Record<string, BadgeDef> = Object.fromEntries(
  BADGES.map((b) => [b.key, b]),
);

export interface BadgeContext {
  level: number;
  currentStreak: number;
  longestStreak: number;
  /** Core-catalogue countries mastered (SRS box ≥ MASTERED_BOX) per mode. */
  flagsMastered: number;
  capitalsMastered: number;
  /** Core-catalogue size per mode (denominator for the "master" badges). */
  coreFlags: number;
  coreCapitals: number;
  perfectThisSeries: boolean;
  /** Total finished series, including the one just completed. */
  seriesCount: number;
}

/** Keys of every badge the context satisfies (earned or not). Pure. */
export function evaluateBadges(ctx: BadgeContext): string[] {
  const earned: string[] = [];
  if (ctx.seriesCount >= 1) earned.push("first_series");
  if (ctx.longestStreak >= 7 || ctx.currentStreak >= 7) earned.push("streak_7");
  if (ctx.longestStreak >= 30 || ctx.currentStreak >= 30) earned.push("streak_30");
  if (ctx.level >= 5) earned.push("level_5");
  if (ctx.level >= 10) earned.push("level_10");
  if (ctx.perfectThisSeries) earned.push("perfect_series");
  if (ctx.coreFlags > 0 && ctx.flagsMastered >= ctx.coreFlags) earned.push("flags_master");
  if (ctx.coreCapitals > 0 && ctx.capitalsMastered >= ctx.coreCapitals)
    earned.push("capitals_master");
  return earned;
}
