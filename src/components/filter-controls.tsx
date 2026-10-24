"use client";

import { SearchField } from "@/components/search-field";
import { Filters } from "@/components/filters";
import { useAnime } from "@/context/anime-context";
import type { StatusFilter } from "@/context/anime-context";
import type { FilterableAnime } from "@/actions/anime";

export type { StatusFilter, FilterableAnime };

export const FilterControls = () => {
  const {
    query,
    setQuery,
    status,
    setStatus,
    statusCounts,
    viewMode,
    setViewMode,
  } = useAnime();

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchField value={query} onChange={setQuery} />
      </div>

      <Filters
        status={status}
        onStatusChange={setStatus}
        statusCounts={statusCounts}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
};
