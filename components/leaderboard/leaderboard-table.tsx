import { UserAvatar } from "@/components/app/user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { LeaderboardRow } from "@/lib/data/leaderboard";

function Row({ row, isMe }: { row: LeaderboardRow; isMe: boolean }) {
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
        {row.total_xp.toLocaleString("fr-FR")} XP
      </TableCell>
    </TableRow>
  );
}

export function LeaderboardTable({
  rows,
  me,
  currentUserId,
}: {
  rows: LeaderboardRow[];
  me: LeaderboardRow | null;
  currentUserId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>Joueur</TableHead>
          <TableHead className="text-right">Niveau</TableHead>
          <TableHead className="text-right">XP</TableHead>
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
  );
}
