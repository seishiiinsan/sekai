/**
 * Weekly leagues (spec §7.5 ligues). A player's league is derived from the XP
 * earned during the current ISO week — pure thresholds, no extra state.
 * ≈100-150 XP per series. Targets: Silver ≈ 5 series, Gold ≈ 15, Diamond ≈ 25+.
 */
export interface League {
  key: string;
  label: string;
  /** Minimum weekly XP to belong to this league. */
  min: number;
  /** Tailwind accent classes (text + tinted background). */
  className: string;
}

export const LEAGUES: League[] = [
  { key: "bronze", label: "Bronze", min: 0, className: "text-amber-700 bg-amber-700/10" },
  { key: "silver", label: "Argent", min: 500, className: "text-slate-500 bg-slate-500/10" },
  { key: "gold", label: "Or", min: 1500, className: "text-yellow-600 bg-yellow-600/10" },
  { key: "diamond", label: "Diamant", min: 3000, className: "text-cyan-600 bg-cyan-600/10" },
];

/** League for a given weekly XP (highest threshold not exceeding xp). */
export function leagueForWeeklyXp(xp: number): League {
  let current = LEAGUES[0];
  for (const l of LEAGUES) if (xp >= l.min) current = l;
  return current;
}

/** Next league up and the XP remaining to reach it, or null at the top. */
export function nextLeague(xp: number): { league: League; remaining: number } | null {
  const next = LEAGUES.find((l) => l.min > xp);
  return next ? { league: next, remaining: next.min - xp } : null;
}
