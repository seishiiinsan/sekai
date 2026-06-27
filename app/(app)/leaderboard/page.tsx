import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLeaderboard, getWeeklyLeaderboard } from "@/lib/data/leaderboard";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { WeeklyLeaderboard } from "@/components/leaderboard/weekly-leaderboard";

export const metadata: Metadata = { title: "Classement" };

export default async function LeaderboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const [global, weekly] = await Promise.all([
    getLeaderboard(profile.id),
    getWeeklyLeaderboard(profile.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Classement</h1>
        <p className="text-sm text-muted-foreground">
          Grimpe les ligues chaque semaine, ou vise le sommet du classement global.
        </p>
      </div>

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="global">Global</TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <WeeklyLeaderboard
            rows={weekly.rows}
            me={weekly.me}
            myWeeklyXp={weekly.myWeeklyXp}
            currentUserId={profile.id}
          />
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardContent className="px-0 py-0">
              <LeaderboardTable rows={global.rows} me={global.me} currentUserId={profile.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
