"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { UserAvatar } from "./user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({
  username,
  avatar,
  level,
}: {
  username: string;
  avatar: string;
  level: number;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <UserAvatar avatar={avatar} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{username}</span>
          <span className="block text-xs text-muted-foreground">Niveau {level}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem render={<Link href="/profile" />}>
          <User className="size-4" aria-hidden />
          Profil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOutAction()}
        >
          <LogOut className="size-4" aria-hidden />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
