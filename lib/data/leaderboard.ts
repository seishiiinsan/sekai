import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

export interface WeeklyRow {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  level: number;
  weeklyXp: number;
}

export interface WeeklyLeaderboard {
  rows: WeeklyRow[];
  /** Current user's row when outside the visible top N (and they have XP). */
  me: WeeklyRow | null;
  myWeeklyXp: number;
  /** Monday (UTC) of the current ISO week, YYYY-MM-DD. */
  weekStart: string;
}

/** Monday 00:00 UTC of the ISO week containing `now`, as YYYY-MM-DD. */
function isoWeekStartUTC(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayFromMonday = (d.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  d.setUTCDate(d.getUTCDate() - dayFromMonday);
  return d.toISOString().slice(0, 10);
}

/**
 * Weekly leaderboard (spec §7.5): players ranked by XP earned this ISO week.
 * daily_activity is owner-read under RLS, so we aggregate with the service-role
 * client. Only public profile fields are exposed (as in the global board).
 */
export async function getWeeklyLeaderboard(currentUserId: string): Promise<WeeklyLeaderboard> {
  const admin = createAdminClient();
  const weekStart = isoWeekStartUTC();

  const { data: acts } = await admin
    .from("daily_activity")
    .select("user_id, xp_earned")
    .gte("activity_date", weekStart);

  const xpByUser = new Map<string, number>();
  for (const a of acts ?? []) {
    xpByUser.set(a.user_id, (xpByUser.get(a.user_id) ?? 0) + a.xp_earned);
  }

  const ranked = [...xpByUser.entries()]
    .filter(([, xp]) => xp > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const myWeeklyXp = xpByUser.get(currentUserId) ?? 0;

  const topIds = ranked.slice(0, TOP_N).map(([id]) => id);
  const profById = new Map<string, { username: string; avatar: string; level: number }>();
  if (topIds.length) {
    const { data: profs } = await admin
      .from("profiles")
      .select("id, username, avatar, level")
      .in("id", topIds);
    for (const p of profs ?? []) profById.set(p.id, p);
  }

  const toRow = (id: string, xp: number, rank: number): WeeklyRow => {
    const p = profById.get(id);
    return {
      rank,
      id,
      username: p?.username ?? "—",
      avatar: p?.avatar ?? "globe",
      level: p?.level ?? 1,
      weeklyXp: xp,
    };
  };

  const rows = ranked.slice(0, TOP_N).map(([id, xp], i) => toRow(id, xp, i + 1));

  let me: WeeklyRow | null = null;
  if (myWeeklyXp > 0 && !rows.some((r) => r.id === currentUserId)) {
    const myRank = ranked.findIndex(([id]) => id === currentUserId) + 1;
    const { data: p } = await admin
      .from("profiles")
      .select("username, avatar, level")
      .eq("id", currentUserId)
      .single();
    me = {
      rank: myRank,
      id: currentUserId,
      username: p?.username ?? "—",
      avatar: p?.avatar ?? "globe",
      level: p?.level ?? 1,
      weeklyXp: myWeeklyXp,
    };
  }

  return { rows, me, myWeeklyXp, weekStart };
}
