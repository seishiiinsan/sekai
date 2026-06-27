import { createClient } from "@/lib/supabase/server";
import { BADGES, type BadgeDef } from "@/lib/game/badges";

export interface BadgeView extends BadgeDef {
  earned: boolean;
  earnedAt: string | null;
}

/** Merge the badge catalogue with the player's earned rows for the profile. */
export async function getBadgeViews(
  userId: string,
): Promise<{ items: BadgeView[]; earnedCount: number }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_badges")
    .select("badge_key,earned_at")
    .eq("user_id", userId);

  const earned = new Map((data ?? []).map((b) => [b.badge_key, b.earned_at]));
  const items = BADGES.map((b) => ({
    ...b,
    earned: earned.has(b.key),
    earnedAt: earned.get(b.key) ?? null,
  }));
  return { items, earnedCount: earned.size };
}
