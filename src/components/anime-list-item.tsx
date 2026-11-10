"use client";

import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { FilterableAnime } from "@/actions/anime";
import { AnimePoster } from "@/components/anime-poster";
import { AnimeStatusBadge } from "@/components/anime-status-badge";
import { AnimeEpisodeStepper } from "@/components/anime-episode-stepper";

type AnimeListItemProps = {
  item: FilterableAnime;
  showOriginalTitle: boolean;
  showPosterInTableRow: boolean;
  onEdit: (item: FilterableAnime) => void;
  onDelete: (item: FilterableAnime) => void;
  onEpisodeChange: (id: string, newEpisode: number) => void;
};

const AnimeListItemComponent = ({
  item,
  showOriginalTitle,
  showPosterInTableRow,
  onEdit,
  onDelete,
  onEpisodeChange,
}: AnimeListItemProps) => (
  <li className="animate-scroll-entry flex items-center justify-between gap-3 sm:gap-6 py-3 px-2 sm:px-3 rounded-xl transition-colors hover:bg-accent/40">
    {/* Title, Original Title, Season Badge */}
    <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
      {showPosterInTableRow && (
        <div className="h-10.5 w-7.5 shrink-0 overflow-hidden rounded-md bg-muted/60">
          {item.posterUrl ? (
            <AnimePoster
              src={item.posterUrl}
              alt=""
              size="x96"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
          )}
        </div>
      )}
      <div className="min-w-0 max-w-65 flex-1 space-y-0.5 sm:max-w-sm">
        <div className="flex items-center gap-2 min-w-0">
          <p
            className="truncate text-sm font-semibold text-foreground"
            title={item.title}
          >
            {item.title}
          </p>
          <span className="shrink-0 rounded-md border border-border/60 bg-muted/70 px-1.5 py-0.5 text-[11px] font-bold text-foreground">
            S{item.season || 1}
          </span>
        </div>

        {showOriginalTitle && item.originalTitle && (
          <p
            className="truncate text-xs text-muted-foreground"
            title={item.originalTitle}
          >
            {item.originalTitle}
          </p>
        )}
      </div>
    </div>

    {/* Stepper, Status Badge, Action Buttons */}
    <div className="flex shrink-0 items-center gap-3 sm:gap-5">
      <AnimeEpisodeStepper
        episode={item.episode}
        episodes={item.episodes}
        onEpisodeChange={(newEp) => onEpisodeChange(item.id, newEp)}
      />

      <AnimeStatusBadge status={item.status} />

      <div className="flex items-center gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={() => onEdit(item)}
          title="Edit anime"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95 cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(item)}
          title="Delete anime"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  </li>
);

export const AnimeListItem = memo(AnimeListItemComponent);
