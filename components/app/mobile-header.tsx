import Link from "next/link";
import { Flame } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { UserAvatar } from "./user-avatar";
import type { Profile } from "@/lib/data/profile";

/** Compact top bar shown on mobile (desktop uses the sidebar instead). */
export function MobileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
      <Link href="/dashboard" aria-label="Tableau de bord">
        <Logo />
      </Link>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-500">
          <Flame className="size-4" aria-hidden />
          {profile.current_streak}
        </span>
        <Link href="/profile" aria-label="Profil">
          <UserAvatar avatar={profile.avatar} size="sm" />
        </Link>
      </div>
    </header>
  );
}
