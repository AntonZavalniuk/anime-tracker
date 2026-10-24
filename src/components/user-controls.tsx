"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";
import { NAVIGATION_LINKS } from "@/constants";
import type { SessionUser } from "@/lib/dal";

type UserControlsProps = {
  user: SessionUser | null;
};

export const UserControls = ({ user }: UserControlsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  if (!user) {
    return (
      <Link
        href={NAVIGATION_LINKS.login}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-background/40 transition-all hover:bg-accent"
        title="Log in"
      >
        <User className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <>
      <Link
        href={NAVIGATION_LINKS.userSettings}
        className="relative inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border/50 bg-background/50 px-3 transition-all hover:bg-accent hover:text-accent-foreground"
        title="Profile settings"
      >
        <Settings className="h-4 w-4 text-muted-foreground" />
        <span className="hidden text-xs font-medium text-muted-foreground sm:block">
          @{user.username}
        </span>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isPending}
        className="relative h-9 w-9 rounded-xl border border-border/50 bg-background/40 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-500"
        title="Log out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </>
  );
};
