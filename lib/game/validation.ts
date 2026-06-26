/**
 * Answer validation (spec §11 anti-cheat). These run ONLY on the server, from
 * the question's stored answer key — the client never decides correctness.
 *
 * - QCM: compare the chosen country id to the answer id.
 * - Free input: normalise and match against the country's aliases, with a small
 *   typo tolerance that scales with length (short names require exact spelling
 *   to avoid confusing distinct countries, e.g. "Iran" vs "Irak").
 */
import { normalize, editDistance } from "@/lib/text";

/** Validate a QCM selection against the correct country id. */
export function validateChoice(
  selectedCountryId: number,
  answerCountryId: number,
): boolean {
  return selectedCountryId === answerCountryId;
}

/** Max edit distance tolerated for a free-input answer of a given length. */
export function typoBudget(length: number): number {
  if (length <= 4) return 0;
  if (length <= 7) return 1;
  return 2;
}

/**
 * Validate a typed answer against the accepted aliases (already normalised at
 * seed time). Returns true on exact normalised match or within the typo budget.
 */
export function validateFreeInput(input: string, aliases: string[]): boolean {
  const n = normalize(input);
  if (n.length < 2) return false;

  const budget = typoBudget(n.length);
  for (const alias of aliases) {
    if (alias === n) return true;
    if (budget === 0) continue;
    // Cheap length pre-filter before the O(n·m) distance computation.
    if (Math.abs(alias.length - n.length) > budget) continue;
    if (editDistance(n, alias) <= budget) return true;
  }
  return false;
}
