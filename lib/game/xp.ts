/**
 * XP & level curve (spec §7.1). Pure functions — unit-tested and mirrored by the
 * SQL helper public.level_for_xp so the server credits exactly what the UI shows.
 */

export const XP_CONFIG = {
  /** Base XP for a correct answer before multipliers. */
  base: 10,
  /** Multiplier by item difficulty (1 = core, 2 = micro-state). */
  difficultyMultiplier: { 1: 1, 2: 1.5 } as Record<number, number>,
  /** A fast answer adds up to this fraction on top of base. */
  maxSpeedBonus: 0.5,
  /** Answer time (ms) at/under which the full speed bonus applies. */
  fastMs: 2000,
  /** Answer time (ms) at/over which there is no speed bonus. */
  slowMs: 10000,
  /** Each consecutive correct answer adds this, capped by comboCap. */
  comboStep: 0.1,
  comboCap: 5,
} as const;

export interface XpInput {
  correct: boolean;
  /** Country difficulty: 1 core, 2 micro-state. */
  difficulty: number;
  /** Response time in ms (optional; no speed bonus when absent). */
  responseMs?: number;
  /** Count of consecutive correct answers BEFORE this one (0-based). */
  combo: number;
}

/** Speed bonus fraction in [0, maxSpeedBonus] from a response time. */
export function speedBonus(responseMs: number | undefined): number {
  if (responseMs == null) return 0;
  const { fastMs, slowMs, maxSpeedBonus } = XP_CONFIG;
  if (responseMs <= fastMs) return maxSpeedBonus;
  if (responseMs >= slowMs) return 0;
  const ratio = (slowMs - responseMs) / (slowMs - fastMs);
  return ratio * maxSpeedBonus;
}

/** Combo multiplier (>= 1) from the number of preceding correct answers. */
export function comboMultiplier(combo: number): number {
  const steps = Math.max(0, Math.min(combo, XP_CONFIG.comboCap));
  return 1 + steps * XP_CONFIG.comboStep;
}

/** XP awarded for a single answered question. Wrong answers earn 0. */
export function xpForAnswer(input: XpInput): number {
  if (!input.correct) return 0;
  const diff = XP_CONFIG.difficultyMultiplier[input.difficulty] ?? 1;
  const raw =
    XP_CONFIG.base *
    diff *
    (1 + speedBonus(input.responseMs)) *
    comboMultiplier(input.combo);
  return Math.round(raw);
}

/** Cumulative XP required to reach a given level (level 1 = 0). */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 50 * l * (l - 1);
}

/** Player level for a given total XP. Mirrors SQL public.level_for_xp. */
export function levelForXp(totalXp: number): number {
  const xp = Math.max(0, totalXp);
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + (2 * xp) / 25)) / 2));
}

export interface LevelProgress {
  level: number;
  /** XP accumulated within the current level. */
  intoLevel: number;
  /** XP span of the current level (from this level to the next). */
  levelSpan: number;
  /** Total XP needed to reach the next level. */
  nextLevelXp: number;
  /** Progress through the current level in [0, 1]. */
  fraction: number;
}

/** Breaks a total XP value into level + progress for progress bars. */
export function levelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const floorXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const levelSpan = nextLevelXp - floorXp;
  const intoLevel = Math.max(0, totalXp) - floorXp;
  return {
    level,
    intoLevel,
    levelSpan,
    nextLevelXp,
    fraction: levelSpan > 0 ? intoLevel / levelSpan : 0,
  };
}
