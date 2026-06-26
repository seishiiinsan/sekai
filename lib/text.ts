/**
 * Text helpers shared by the country seed and the free-input answer matcher.
 * Keeping a single normalize() guarantees the aliases we store at seed time are
 * compared the same way at answer time.
 */

const COMBINING_MARKS = /[̀-ͯ]/g;

/** Remove diacritics: "Côte d'Ivoire" → "Cote d'Ivoire". */
export function stripDiacritics(input: string): string {
  return input.normalize("NFD").replace(COMBINING_MARKS, "");
}

/**
 * Canonical form for comparing names: lowercased, accent-free, punctuation
 * collapsed to spaces, whitespace squeezed. "St. Kitts & Nevis" → "st kitts nevis".
 */
export function normalize(input: string): string {
  return stripDiacritics(input)
    .toLowerCase()
    .replace(/['’`.]/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Levenshtein edit distance (iterative, two-row). Used for typo tolerance. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}
