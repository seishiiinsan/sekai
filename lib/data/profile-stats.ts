import { createClient } from "@/lib/supabase/server";
import { GAME_MODES, type GameMode } from "@/lib/game/types";

export interface ModeMastery {
  mode: GameMode;
  /** Total countries that exist for this mode (the whole catalogue). */
  total: number;
  /** Distinct countries the player has encountered at least once. */
  seen: number;
  /** Items whose success rate across all attempts exceeds 80%. */
  mastered: number;
}

export interface MasteryStats {
  byMode: ModeMastery[];
  /** Distinct (country × mode) items the player has attempted. */
  totalItems: number;
  totalMastered: number;
}

/**
 * Mastery per mode (spec §12). A country is "mastered" once the player's success
 * rate on it exceeds 80% across all their attempts; the bar fills against the
 * whole catalogue (every country that has a flag / a capital).
 */
export async function getMasteryStats(): Promise<MasteryStats> {
  const supabase = await createClient();

  const [flagsTotalRes, capitalsTotalRes, summaryRes] = await Promise.all([
    // All countries have a flag.
    supabase.from("countries").select("id", { count: "exact", head: true }),
    // Capitals mode only covers countries that have a capital.
    supabase
      .from("countries")
      .select("id", { count: "exact", head: true })
      .eq("has_capital", true),
    supabase.rpc("mastery_summary"),
  ]);

  const totalByMode: Record<GameMode, number> = {
    flags: flagsTotalRes.count ?? 0,
    capitals: capitalsTotalRes.count ?? 0,
  };

  const summary = summaryRes.data ?? [];
  const byMode: ModeMastery[] = GAME_MODES.map((mode) => {
    const row = summary.find((r) => r.mode === mode);
    return {
      mode,
      total: totalByMode[mode],
      seen: row?.attempted ?? 0,
      mastered: row?.mastered ?? 0,
    };
  });

  const totalItems = summary.reduce((sum, r) => sum + r.attempted, 0);
  const totalMastered = summary.reduce((sum, r) => sum + r.mastered, 0);

  return { byMode, totalItems, totalMastered };
}
