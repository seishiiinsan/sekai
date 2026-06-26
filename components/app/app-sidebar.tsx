import Link from "next/link";
import { Flame } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SidebarNav } from "./nav-links";
import { UserMenu } from "./user-menu";
import { levelProgress } from "@/lib/game/xp";
import type { Profile } from "@/lib/data/profile";

/** Fixed desktop sidebar (hidden on mobile, where MobileNav takes over). */
export function AppSidebar({ profile }: { profile: Profile }) {
  const progress = levelProgress(profile.total_xp);

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar md:flex">
      <div className="flex h-14 items-center px-4">
        <Link href="/dashboard" aria-label="Tableau de bord">
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SidebarNav />
      </div>

      <div className="space-y-3 border-t p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-500">
            <Flame className="size-3.5" aria-hidden />
            {profile.current_streak} j
          </span>
          <span className="text-muted-foreground">
            {progress.intoLevel}/{progress.levelSpan} XP
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={progress.levelSpan}
          aria-valuenow={progress.intoLevel}
          aria-label={`Progression vers le niveau ${progress.level + 1}`}
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.round(progress.fraction * 100)}%` }}
          />
        </div>
        <UserMenu
          username={profile.username}
          avatar={profile.avatar}
          level={profile.level}
        />
      </div>
    </aside>
  );
}
