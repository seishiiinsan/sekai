import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getCurrentProfile } from "@/lib/data/profile";
import { getMasteryStats } from "@/lib/data/profile-stats";
import { getDashboardData } from "@/lib/data/dashboard";
import { signOutAction } from "@/app/(auth)/actions";
import { UserAvatar } from "@/components/app/user-avatar";
import { StatGrid } from "@/components/profile/stat-grid";
import { MasteryByMode } from "@/components/profile/mastery-by-mode";
import { StreakHeatmap } from "@/components/dashboard/streak-heatmap";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [mastery, dashboard] = await Promise.all([
    getMasteryStats(),
    getDashboardData(profile.id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <UserAvatar avatar={profile.avatar} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{profile.username}</h1>
            <p className="text-sm text-muted-foreground">
              Niveau {profile.level} · {profile.email}
            </p>
          </div>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </form>
      </div>

      <StatGrid
        totalXp={profile.total_xp}
        level={profile.level}
        currentStreak={profile.current_streak}
        longestStreak={profile.longest_streak}
        studied={mastery.totalItems}
        mastered={mastery.totalMastered}
      />

      <MasteryByMode byMode={mastery.byMode} />

      <StreakHeatmap activity={dashboard.activity} />
    </div>
  );
}
