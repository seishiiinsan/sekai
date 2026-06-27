import { Trophy } from "lucide-react";
import { UserAvatar } from "@/components/app/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { leagueForWeeklyXp, nextLeague } from "@/lib/game/leagues";
import type { WeeklyRow } from "@/lib/data/leaderboard";

function Row({ row, isMe }: { row: WeeklyRow; isMe: boolean }) {
  return (
    <TableRow className={cn(isMe && "bg-primary/5")}>
      <TableCell className="w-12 text-center font-medium tabular-nums text-muted-foreground">
        {row.rank}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <UserAvatar avatar={row.avatar} size="sm" />
          <span className="font-medium">
            {row.username}
            {isMe && <span className="ml-1.5 text-xs text-primary">(toi)</span>}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right tabular-nums text-muted-foreground">
        Niv. {row.level}
      </TableCell>
      <TableCell className="text-right font-semibold tabular-nums">
        {row.weeklyXp.toLocaleString("fr-FR")} XP
      </TableCell>
    </TableRow>
  );
}

export function WeeklyLeaderboard({
  rows,
  me,
  myWeeklyXp,
  currentUserId,
}: {
  rows: WeeklyRow[];
  me: WeeklyRow | null;
  myWeeklyXp: number;
  currentUserId: string;
}) {
  const league = leagueForWeeklyXp(myWeeklyXp);
  const next = nextLeague(myWeeklyXp);

  return (
    <div className="space-y-4">
      <div className={cn("flex items-center gap-3 rounded-xl p-4", league.className)}>
        <Trophy className="size-6 shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Ligue {league.label}</p>
          <p className="text-xs opacity-80">
            {myWeeklyXp.toLocaleString("fr-FR")} XP cette semaine
            {next
              ? ` · ${next.remaining.toLocaleString("fr-FR")} XP pour ${next.league.label}`
              : " · ligue maximale 🎉"}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          {rows.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              Aucune activité cette semaine. Lance une série pour entrer dans la ligue !
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Joueur</TableHead>
                  <TableHead className="text-right">Niveau</TableHead>
                  <TableHead className="text-right">XP semaine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <Row key={row.id} row={row} isMe={row.id === currentUserId} />
                ))}
                {me && (
                  <>
                    <TableRow>
                      <TableCell colSpan={4} className="py-1 text-center text-xs text-muted-foreground">
                        ···
                      </TableCell>
                    </TableRow>
                    <Row row={me} isMe />
                  </>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
