"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { FilterableAnime } from "@/actions/anime";
import { useAnime } from "@/context/anime-context";
import { AnimeStatusBadge } from "@/components/anime-status-badge";
import { AnimeEpisodeStepper } from "@/components/anime-episode-stepper";
import { AnimeDialog } from "@/components/anime-dialog";
import { AnimeDeleteDialog } from "@/components/anime-delete-dialog";

type AnimeListProps = {
  animeList: FilterableAnime[];
  showOriginalTitle: boolean;
};

export const AnimeList = ({ animeList, showOriginalTitle }: AnimeListProps) => {
  const { updateEpisode } = useAnime();
  const [editingAnime, setEditingAnime] = useState<FilterableAnime | null>(
    null,
  );
  const [deletingAnime, setDeletingAnime] = useState<FilterableAnime | null>(
    null,
  );

  return (
    <>
      <ul className="divide-y divide-border/50">
        {animeList.map((item) => (
          <li
            key={item.id}
            className="animate-scroll-entry flex flex-col gap-3 py-3.5 px-3 -mx-3 rounded-2xl transition-colors hover:bg-card/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            {/* Title, Original Title, Season */}
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
              <p className="truncate text-sm font-semibold text-foreground">
                {item.title}
              </p>

              {showOriginalTitle && item.originalTitle && (
                <p className="truncate text-xs text-muted-foreground">
                  {item.originalTitle}
                </p>
              )}

              <span className="shrink-0 rounded-lg border border-border/50 bg-muted/60 px-2 py-0.5 text-xs font-semibold text-foreground">
                S{item.season || 1}
              </span>
            </div>

            {/* Stepper, Status, Actions */}
            <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-5">
              <AnimeEpisodeStepper
                episode={item.episode}
                episodes={item.episodes}
                onEpisodeChange={(newEp) => updateEpisode(item.id, newEp)}
              />

              <AnimeStatusBadge status={item.status} />

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingAnime(item)}
                  title="Edit anime"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingAnime(item)}
                  title="Delete anime"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Dialog */}
      <AnimeDialog
        isOpen={Boolean(editingAnime)}
        onClose={() => setEditingAnime(null)}
        anime={editingAnime}
      />

      {/* Delete Dialog */}
      <AnimeDeleteDialog
        isOpen={Boolean(deletingAnime)}
        onClose={() => setDeletingAnime(null)}
        anime={deletingAnime}
      />
    </>
  );
};
