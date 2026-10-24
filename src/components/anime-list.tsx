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
      <div className="rounded-2xl border border-border/60 bg-card/40 p-3 sm:p-5 backdrop-blur-xl shadow-lg transition-all">
        <ul className="divide-y divide-border/60">
          {animeList.map((item) => (
            <li
              key={item.id}
              className="animate-scroll-entry flex items-center justify-between gap-3 sm:gap-6 py-3 px-2 sm:px-3 rounded-xl transition-colors hover:bg-accent/40"
            >
              {/* Title, Original Title, Season Badge */}
              <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                <div className="min-w-0 flex-1 space-y-0.5">
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
                  onEpisodeChange={(newEp) => updateEpisode(item.id, newEp)}
                />

                <AnimeStatusBadge status={item.status} />

                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingAnime(item)}
                    title="Edit anime"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95 cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingAnime(item)}
                    title="Delete anime"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
