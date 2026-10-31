import Link from "next/link";
import { Tv, Sparkles } from "lucide-react";
import { NAVIGATION_LINKS } from "@/constants";
import { getCurrentUser } from "@/lib/dal";
import { ThemeToggle } from "./theme-toggle";
import { UserControls } from "./user-controls";
import { AnimeCountBadge } from "./anime-count-badge";

export const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/40 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href={NAVIGATION_LINKS.home}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md ring-1 shadow-indigo-500/20 ring-white/20"
          >
            <Tv className="h-5 w-5" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 animate-pulse text-yellow-300" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link href={NAVIGATION_LINKS.home}>
                <h1 className="bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
                  AniTracker
                </h1>
              </Link>
              <AnimeCountBadge />
            </div>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Track your anime, seasons &amp; watching progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserControls user={user} />
        </div>
      </div>
    </header>
  );
};

export const NavbarFallback = () => (
  <header className="sticky top-0 z-40 h-16 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl" />
);
