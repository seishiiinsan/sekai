import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data/profile";
import { getDashboardData } from "@/lib/data/dashboard";
import { LevelCard } from "@/components/dashboard/level-card";
import { DailyObjective } from "@/components/dashboard/daily-objective";
import { ReviewCard } from "@/components/dashboard/review-card";
import { ModeTiles } from "@/components/dashboard/mode-tiles";
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  const data = await getDashboardData(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Salut, {profile.username}
        </h1>
        <p className="text-sm text-muted-foreground">
          {profile.current_streak > 0
            ? `${profile.current_streak} jour${profile.current_streak > 1 ? "s" : ""} de série — continue sur ta lancée.`
            : "Commence ta série du jour et garde le rythme."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LevelCard totalXp={profile.total_xp} />
        <DailyObjective todayXp={data.todayXp} />
        <ReviewCard due={data.due} />
      </div>

      <ModeTiles />

      <StreakHeatmap activity={data.activity} />
    </div>
  );
}
