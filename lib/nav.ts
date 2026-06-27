import { LayoutDashboard, Gamepad2, Trophy, User, Globe2, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Primary navigation, shared by the desktop sidebar and the mobile bottom bar. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/play", label: "Jouer", icon: Gamepad2 },
  { href: "/atlas", label: "Atlas", icon: Globe2 },
  { href: "/leaderboard", label: "Classement", icon: Trophy },
  { href: "/profile", label: "Profil", icon: User },
];
