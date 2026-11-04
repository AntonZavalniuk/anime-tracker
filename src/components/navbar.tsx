import Link from "next/link";
import Image from "next/image";
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
            className="flex h-10 w-10 items-center justify-center"
          >
            <Image
              src="/logo.svg"
              alt="AniTracker logo"
              width={40}
              height={40}
              preload
              className="h-10 w-10"
            />
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
