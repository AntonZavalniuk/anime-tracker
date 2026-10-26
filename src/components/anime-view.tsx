"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useAnime } from "@/context/anime-context";
import { AnimeNotFound } from "@/components/anime-not-found";
import { AnimeGrid } from "@/components/anime-grid";
import { AnimeList } from "@/components/anime-list";

export const AnimeView = () => {
  const {
    animeList,
    viewMode,
    showOriginalTitle,
    showPosterInTableRow,
    hasMore,
    isLoading,
    isLoadingMore,
    loadMore,
  } = useAnime();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: "250px",
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  if (isLoading && animeList.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {animeList.length === 0 ? (
        <AnimeNotFound />
      ) : viewMode === "GRID" ? (
        <AnimeGrid
          animeList={animeList}
          showOriginalTitle={showOriginalTitle}
        />
      ) : (
        <AnimeList
          animeList={animeList}
          showOriginalTitle={showOriginalTitle}
          showPosterInTableRow={showPosterInTableRow}
        />
      )}

      {/* Sentinel element for infinite scroll */}
      {hasMore && <div ref={sentinelRef} className="h-6 w-full" />}

      {isLoadingMore && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
};
