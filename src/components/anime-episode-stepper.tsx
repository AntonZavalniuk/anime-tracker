"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type AnimeEpisodeStepperProps = {
  episode: number;
  episodes: number;
  onEpisodeChange: (newEpisode: number) => void;
  className?: string;
  compact?: boolean;
};

export const AnimeEpisodeStepper = ({
  episode,
  episodes,
  onEpisodeChange,
  className,
  compact = false,
}: AnimeEpisodeStepperProps) => {
  const hasLimit = episodes > 0;
  const progressPercent = hasLimit
    ? Math.min(100, Math.max(0, Math.round((episode / episodes) * 100)))
    : 0;

  const canDecrement = episode > 0;
  const canIncrement = !hasLimit || episode < episodes;

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canDecrement) {
      onEpisodeChange(Math.max(0, episode - 1));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canIncrement) {
      onEpisodeChange(episode + 1);
    }
  };

  return (
    <div
      className={cn("flex flex-col items-center gap-1.5 shrink-0", className)}
    >
      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label="Previous episode"
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-foreground active:scale-95 cursor-pointer",
            !canDecrement &&
              "pointer-events-none opacity-30 hover:border-border/60 hover:bg-background/60 hover:text-muted-foreground",
          )}
        >
          <Minus className="h-3 w-3" />
        </button>

        <span className="flex items-center gap-1 font-medium tracking-tight whitespace-nowrap min-w-16 justify-center">
          <span className="font-bold text-foreground">{episode}</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="text-muted-foreground">
            {hasLimit ? episodes : "?"}
          </span>
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label="Next episode"
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-foreground active:scale-95 cursor-pointer",
            !canIncrement &&
              "pointer-events-none opacity-30 hover:border-border/60 hover:bg-background/60 hover:text-muted-foreground",
          )}
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={cn(
          "h-1.5 w-24 sm:w-28 overflow-hidden rounded-full bg-border/80 dark:bg-muted/80 shadow-inner",
          compact && "w-20",
        )}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
