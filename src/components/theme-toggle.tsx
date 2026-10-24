"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const useIsMounted = () => {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
};

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();
  const isDark = isMounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 gap-2 rounded-xl border border-border/50 bg-background/40 px-0 transition-all hover:bg-accent hover:text-accent-foreground sm:w-auto sm:px-3"
      title="Toggle theme (Press D)"
      suppressHydrationWarning
    >
      {isDark ? (
        <Sun className="h-4 w-4 rotate-0 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 rotate-0 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
      )}
      <span
        className="hidden text-xs font-medium sm:inline"
        suppressHydrationWarning
      >
        {!isMounted ? "Theme" : isDark ? "Dark" : "Light"}
      </span>
      <kbd className="hidden h-5 items-center rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
        D
      </kbd>
    </Button>
  );
};
