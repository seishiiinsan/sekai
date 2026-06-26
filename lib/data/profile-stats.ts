import { createClient } from "@/lib/supabase/server";
import { masteryTier, isMastered, type MasteryTier } from "@/lib/game/srs";
import { GAME_MODES, type GameMode } from "@/lib/game/types";

export interface ModeMastery {
  mode: GameMode;
  total: number;
  mastered: number;
  tiers: Record<MasteryTier, number>;
}

export interface MasteryStats {
  byMode: ModeMastery[];
  totalItems: number;
  totalMastered: number;
}

const emptyTiers = (): Record<MasteryTier, number> => ({
  new: 0,
  learning: 0,
  familiar: 0,
  strong: 0,
  mastered: 0,
});

/** Aggregate SRS mastery per mode for the profile visualisations (spec §12). */
export async function getMasteryStats(userId: string): Promise<MasteryStats> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mastery_items")
    .select("mode, srs_level")
    .eq("user_id", userId);

  const byMode: Record<GameMode, ModeMastery> = {
    flags: { mode: "flags", total: 0, mastered: 0, tiers: emptyTiers() },
    capitals: { mode: "capitals", total: 0, mastered: 0, tiers: emptyTiers() },
  };

  let totalItems = 0;
  let totalMastered = 0;

  for (const row of data ?? []) {
    const m = byMode[row.mode as GameMode];
    if (!m) continue;
    m.total++;
    totalItems++;
    m.tiers[masteryTier(row.srs_level)]++;
    if (isMastered(row.srs_level)) {
      m.mastered++;
      totalMastered++;
    }
  }

  return {
    byMode: GAME_MODES.map((mode) => byMode[mode]),
    totalItems,
    totalMastered,
  };
}
