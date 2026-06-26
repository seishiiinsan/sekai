import { createClient } from "@/lib/supabase/server";
import type { GameMode } from "@/lib/game/types";

/** XP to earn in a day to validate the daily objective (spec §7.2). */
export const DAILY_XP_GOAL = 50;
/** Days of history shown in the activity heatmap (~17 weeks, GitHub-style). */
export const HEATMAP_DAYS = 119;

export interface DayActivity {
  date: string; // YYYY-MM-DD
  xp: number;
}

export interface DueByMode {
  flags: number;
  capitals: number;
  total: number;
  topMode: GameMode | null;
}

export interface DashboardData {
  todayXp: number;
  activity: DayActivity[];
  due: DueByMode;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();
  const today = isoDate(new Date());
  const since = isoDate(new Date(Date.now() - HEATMAP_DAYS * 86400000));
  const nowIso = new Date().toISOString();

  const [activityRes, dueRes] = await Promise.all([
    supabase
      .from("daily_activity")
      .select("activity_date, xp_earned")
      .eq("user_id", userId)
      .gte("activity_date", since)
      .order("activity_date", { ascending: true }),
    supabase
      .from("mastery_items")
      .select("mode")
      .eq("user_id", userId)
      .lte("due_at", nowIso),
  ]);

  const activity: DayActivity[] = (activityRes.data ?? []).map((r) => ({
    date: r.activity_date,
    xp: r.xp_earned,
  }));
  const todayXp = activity.find((a) => a.date === today)?.xp ?? 0;

  let flags = 0;
  let capitals = 0;
  for (const row of dueRes.data ?? []) {
    if (row.mode === "flags") flags++;
    else if (row.mode === "capitals") capitals++;
  }
  const total = flags + capitals;
  const topMode: GameMode | null =
    total === 0 ? null : flags >= capitals ? "flags" : "capitals";

  return { todayXp, activity, due: { flags, capitals, total, topMode } };
}
