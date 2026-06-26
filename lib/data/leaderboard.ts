import { createClient } from "@/lib/supabase/server";

export interface LeaderboardRow {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  level: number;
  total_xp: number;
}

export interface Leaderboard {
  rows: LeaderboardRow[];
  /** Current user's row when they fall outside the visible top N. */
  me: LeaderboardRow | null;
}

const TOP_N = 100;

/** Global leaderboard ordered by total XP (spec §7.4). */
export async function getLeaderboard(currentUserId: string): Promise<Leaderboard> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id, username, avatar, level, total_xp")
    .order("total_xp", { ascending: false })
    .order("username", { ascending: true })
    .limit(TOP_N);

  const rows: LeaderboardRow[] = (data ?? []).map((p, i) => ({
    rank: i + 1,
    ...p,
  }));

  const inTop = rows.find((r) => r.id === currentUserId);
  if (inTop) return { rows, me: null };

  // Current user is outside the top N — compute their exact rank.
  const { data: meProfile } = await supabase
    .from("profiles")
    .select("id, username, avatar, level, total_xp")
    .eq("id", currentUserId)
    .single();

  if (!meProfile) return { rows, me: null };

  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gt("total_xp", meProfile.total_xp);

  return { rows, me: { rank: (count ?? 0) + 1, ...meProfile } };
}
