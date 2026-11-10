"use client";

import { useState } from "react";
import type { FilterableAnime } from "@/actions/anime";
import { useAnime } from "@/context/anime-context";
import { AnimeListItem } from "@/components/anime-list-item";
import { AnimeDialog } from "@/components/anime-dialog";
import { AnimeDeleteDialog } from "@/components/anime-delete-dialog";

type AnimeListProps = {
  animeList: FilterableAnime[];
  showOriginalTitle: boolean;
  showPosterInTableRow: boolean;
};

export const AnimeList = ({
  animeList,
  showOriginalTitle,
  showPosterInTableRow,
}: AnimeListProps) => {
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
            <AnimeListItem
              key={item.id}
              item={item}
              showOriginalTitle={showOriginalTitle}
              showPosterInTableRow={showPosterInTableRow}
              onEdit={setEditingAnime}
              onDelete={setDeletingAnime}
              onEpisodeChange={updateEpisode}
            />
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
