/**
 * Spaced repetition (spec §7.6): a simplified Leitner/SM-2 scheme. An item is a
 * (user × country × mode) couple. Correct answers lengthen the interval; a miss
 * sends it back to relearning so it resurfaces in "Révision du jour".
 *
 * Pure functions over the mastery state — the server persists the result.
 */

/** Interval (days) by box/level. Index 0 is unused (new item). */
export const SRS_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;
const MAX_BOX = SRS_INTERVALS_DAYS.length - 1; // 6
const MIN_EASE = 1.3;
const MAX_EASE = 2.7;
const DEFAULT_EASE = 2.5;
/** Minutes until a missed item is due again (relearn within the session/day). */
const RELEARN_MINUTES = 10;
/** Box at/above which an item counts as "mastered" for stats and badges (60-day interval). */
export const MASTERED_BOX = 6;

export interface SrsState {
  srsLevel: number;
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export interface SrsUpdate extends SrsState {
  dueAt: Date;
  lastReviewedAt: Date;
}

export const NEW_SRS_STATE: SrsState = {
  srsLevel: 0,
  ease: DEFAULT_EASE,
  intervalDays: 0,
  reps: 0,
  lapses: 0,
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}
function addMinutes(from: Date, minutes: number): Date {
  return new Date(from.getTime() + minutes * 60 * 1000);
}

/**
 * Advance an item's SRS state after an answer.
 * @param prev existing state (use NEW_SRS_STATE for a first encounter)
 * @param correct whether the answer was right
 * @param now reference time (defaults to current time)
 */
export function reviewItem(
  prev: SrsState,
  correct: boolean,
  now: Date = new Date(),
): SrsUpdate {
  if (correct) {
    const srsLevel = Math.min(prev.srsLevel + 1, Number.MAX_SAFE_INTEGER);
    const ease = clamp(prev.ease + 0.02, MIN_EASE, MAX_EASE);
    const intervalDays =
      srsLevel <= MAX_BOX
        ? SRS_INTERVALS_DAYS[srsLevel]
        : Math.round(prev.intervalDays * ease);
    return {
      srsLevel,
      ease,
      intervalDays,
      reps: prev.reps + 1,
      lapses: prev.lapses,
      dueAt: addDays(now, intervalDays),
      lastReviewedAt: now,
    };
  }

  // Miss: back to relearning (box 0), due shortly, ease penalised. Box 0 keeps a
  // lapsed item visually distinct from one answered correctly at least once
  // (box 1+), so the mastery bar reflects performance.
  return {
    srsLevel: 0,
    ease: clamp(prev.ease - 0.2, MIN_EASE, MAX_EASE),
    intervalDays: 0,
    reps: prev.reps,
    lapses: prev.lapses + 1,
    dueAt: addMinutes(now, RELEARN_MINUTES),
    lastReviewedAt: now,
  };
}

/** Whether an item is due for review at `now`. */
export function isDue(dueAt: Date | string, now: Date = new Date()): boolean {
  const due = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  return due.getTime() <= now.getTime();
}

/** Mastery percentage [0, 100] from the SRS box, for profile visualisations. */
export function masteryPct(srsLevel: number): number {
  return Math.round((clamp(srsLevel, 0, MAX_BOX) / MAX_BOX) * 100);
}

export type MasteryTier = "new" | "learning" | "familiar" | "strong" | "mastered";

/** Coarse mastery tier label from the SRS box. */
export function masteryTier(srsLevel: number): MasteryTier {
  if (srsLevel <= 0) return "new";
  if (srsLevel <= 2) return "learning";
  if (srsLevel <= 4) return "familiar";
  if (srsLevel < MASTERED_BOX) return "strong"; // box 5
  return "mastered"; // box 6+
}

export function isMastered(srsLevel: number): boolean {
  return srsLevel >= MASTERED_BOX;
}
