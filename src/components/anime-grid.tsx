"use client";

import { useState } from "react";
import type { FilterableAnime } from "@/actions/anime";
import { useAnime } from "@/context/anime-context";
import { AnimeGridCard } from "@/components/anime-grid-card";
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
          <AnimeGridCard
            key={item.id}
            item={item}
            showOriginalTitle={showOriginalTitle}
            onEdit={setEditingAnime}
            onDelete={setDeletingAnime}
            onEpisodeChange={updateEpisode}
          />
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
