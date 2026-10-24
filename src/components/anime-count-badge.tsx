"use client";

import { useAnime } from "@/context/anime-context";

export const AnimeCountBadge = () => {
  const { totalCount } = useAnime();

  return (
    <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-500/20 ring-inset dark:text-indigo-400">
      {totalCount}
    </span>
  );
};
