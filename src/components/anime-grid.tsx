"use client";

import { useState } from "react";
import { Pencil, Trash2, Film } from "lucide-react";
import type { FilterableAnime } from "@/actions/anime";
import { useAnime } from "@/context/anime-context";
import { AnimeStatusBadge } from "@/components/anime-status-badge";
import { AnimeEpisodeStepper } from "@/components/anime-episode-stepper";
import { AnimeDialog } from "@/components/anime-dialog";
import { AnimeDeleteDialog } from "@/components/anime-delete-dialog";

type AnimeGridProps = {
  animeList: FilterableAnime[];
  showOriginalTitle: boolean;
};

export const AnimeGrid = ({ animeList, showOriginalTitle }: AnimeGridProps) => {
  const { updateEpisode } = useAnime();
  const [editingAnime, setEditingAnime] = useState<FilterableAnime | null>(
    null,
  );
  const [deletingAnime, setDeletingAnime] = useState<FilterableAnime | null>(
    null,
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {animeList.map((item) => (
          <div
            key={item.id}
            className="group animate-scroll-entry relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-md backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl"
          >
            {/* Poster / Image Section */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/40">
              {item.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 text-center">
                  <Film className="h-8 w-8 text-muted-foreground/40" />
                  <span className="mt-2 line-clamp-2 text-xs font-medium text-muted-foreground/70">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/35 to-black/30" />

              {/* Top Badges */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10">
                <span className="rounded-lg border border-white/15 bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
                  S{item.season || 1}
                </span>

                <AnimeStatusBadge status={item.status} variant="card" />
              </div>

              {/* Action Buttons (Edit / Delete) */}
              <div className="absolute right-2.5 bottom-16 z-10 flex items-center gap-1.5 opacity-90 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditingAnime(item)}
                  title="Edit anime"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white/90 shadow-md backdrop-blur-md transition-all hover:bg-black/90 hover:text-white active:scale-95"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeletingAnime(item)}
                  title="Delete anime"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white/90 shadow-md backdrop-blur-md transition-all hover:bg-destructive hover:text-white active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Titles at the bottom of the poster */}
              <div className="absolute inset-x-2.5 bottom-2.5 z-10 space-y-0.5">
                <p
                  className="line-clamp-2 text-sm font-bold text-white drop-shadow-sm leading-tight"
                  title={item.title}
                >
                  {item.title}
                </p>
                {showOriginalTitle && item.originalTitle && (
                  <p
                    className="truncate text-[11px] text-white/70 drop-shadow-xs"
                    title={item.originalTitle}
                  >
                    {item.originalTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Section: Stepper & Progress Bar */}
            <div className="flex flex-col items-center justify-center border-t border-border/40 bg-card/90 p-2.5 dark:bg-card/70">
              <AnimeEpisodeStepper
                episode={item.episode}
                episodes={item.episodes}
                onEpisodeChange={(newEp) => updateEpisode(item.id, newEp)}
                className="w-full"
              />
            </div>
          </div>
        ))}
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
