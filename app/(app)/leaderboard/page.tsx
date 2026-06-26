import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLeaderboard } from "@/lib/data/leaderboard";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";

export const metadata: Metadata = { title: "Classement" };

export default async function LeaderboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  const { rows, me } = await getLeaderboard(profile.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Classement global</h1>
        <p className="text-sm text-muted-foreground">
          Les meilleurs joueurs par XP total.
        </p>
      </div>
      <Card>
        <CardContent className="px-0 py-0">
          <LeaderboardTable rows={rows} me={me} currentUserId={profile.id} />
        </CardContent>
      </Card>
    </div>
  );
}
