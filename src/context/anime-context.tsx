"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  useOptimistic,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type {
  AnimeStatus,
  FilterableAnime,
  AnimeCounts,
  AnimeBatchResult,
  UpdateAnimeInput,
} from "@/actions/anime";
import {
  getAnimeBatch,
  getAnimeCounts,
  addNewAnime,
  updateAnime,
  deleteAnime,
  updateAnimeEpisode,
} from "@/actions/anime";
import type { ViewMode } from "@/actions/table-settings";
import { updateTableSettings } from "@/actions/table-settings";

export type StatusFilter = AnimeStatus | "ALL";

type OptimisticAction =
  | { type: "ADD"; payload: FilterableAnime }
  | { type: "UPDATE"; payload: FilterableAnime }
  | { type: "DELETE"; payload: { id: string } }
  | { type: "UPDATE_EPISODE"; payload: { id: string; episode: number } };

interface AnimeContextValue {
  animeList: FilterableAnime[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  loadMore: () => Promise<void>;
  refreshList: () => Promise<void>;

  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;
  query: string;
  setQuery: (query: string) => void;
  statusCounts: AnimeCounts;
  totalCount: number;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showOriginalTitle: boolean;
  setShowOriginalTitle: (show: boolean) => void;
  showPosterInTableRow: boolean;
  setShowPosterInTableRow: (show: boolean) => void;

  addAnime: (input: UpdateAnimeInput) => Promise<void>;
  updateAnime: (id: string, input: UpdateAnimeInput) => Promise<void>;
  deleteAnime: (id: string) => Promise<void>;
  updateEpisode: (id: string, episode: number) => Promise<void>;
}

const AnimeContext = createContext<AnimeContextValue | null>(null);

export function useAnime() {
  const context = useContext(AnimeContext);
  if (!context) {
    throw new Error("useAnime must be used within an AnimeProvider");
  }
  return context;
}

interface AnimeProviderProps {
  children: ReactNode;
  initialBatch: AnimeBatchResult;
  initialCounts: AnimeCounts;
  initialTableSettings: {
    viewMode: ViewMode;
    showOriginalTitle: boolean;
    showPosterInTableRow: boolean;
  };
}

export const AnimeProvider = ({
  children,
  initialBatch,
  initialCounts,
  initialTableSettings,
}: AnimeProviderProps) => {
  const [items, setItems] = useState<FilterableAnime[]>(initialBatch.items);
  const [hasMore, setHasMore] = useState<boolean>(initialBatch.hasMore);
  const [nextOffset, setNextOffset] = useState<number | null>(
    initialBatch.nextOffset,
  );

  const [status, setStatus] = useState<StatusFilter>("AIRING");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [counts, setCounts] = useState<AnimeCounts>(initialCounts);
  const [viewMode, setViewModeState] = useState<ViewMode>(
    initialTableSettings.viewMode,
  );
  const [showOriginalTitle, setShowOriginalTitleState] = useState<boolean>(
    initialTableSettings.showOriginalTitle,
  );
  const [showPosterInTableRow, setShowPosterInTableRowState] =
    useState<boolean>(initialTableSettings.showPosterInTableRow);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [, startActionTransition] = useTransition();

  // Optimistic updates for anime list
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items,
    (currentItems, action: OptimisticAction) => {
      switch (action.type) {
        case "ADD":
          return [action.payload, ...currentItems];
        case "UPDATE":
          return currentItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, ...action.payload }
              : item,
          );
        case "DELETE":
          return currentItems.filter((item) => item.id !== action.payload.id);
        case "UPDATE_EPISODE":
          return currentItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, episode: action.payload.episode }
              : item,
          );
        default:
          return currentItems;
      }
    },
  );

  // Optimistic updates for counts
  const [optimisticCounts, setOptimisticCounts] = useOptimistic(
    counts,
    (currentCounts, action: OptimisticAction) => {
      switch (action.type) {
        case "ADD": {
          const s = action.payload.status;
          return {
            ...currentCounts,
            ALL: currentCounts.ALL + 1,
            [s]: currentCounts[s] + 1,
          };
        }
        case "DELETE": {
          const item = items.find((i) => i.id === action.payload.id);
          if (!item) {
            return {
              ...currentCounts,
              ALL: Math.max(0, currentCounts.ALL - 1),
            };
          }
          return {
            ...currentCounts,
            ALL: Math.max(0, currentCounts.ALL - 1),
            [item.status]: Math.max(0, currentCounts[item.status] - 1),
          };
        }
        case "UPDATE": {
          const prev = items.find((i) => i.id === action.payload.id);
          if (!prev || prev.status === action.payload.status) {
            return currentCounts;
          }
          return {
            ...currentCounts,
            [prev.status]: Math.max(0, currentCounts[prev.status] - 1),
            [action.payload.status]: currentCounts[action.payload.status] + 1,
          };
        }
        default:
          return currentCounts;
      }
    },
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Track initial render to skip re-fetching what was already provided via initialBatch
  const isFirstMount = useRef(true);

  // Refetch batch when status or debounced query changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    let isSubscribed = true;
    setIsLoading(true);

    getAnimeBatch({
      offset: 0,
      limit: 25,
      status,
      query: debouncedQuery,
    })
      .then((res) => {
        if (!isSubscribed) return;
        setItems(res.items);
        setHasMore(res.hasMore);
        setNextOffset(res.nextOffset);
      })
      .finally(() => {
        if (isSubscribed) {
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [status, debouncedQuery]);

  // Infinite scroll loader
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) return;

    setIsLoadingMore(true);
    try {
      const res = await getAnimeBatch({
        offset: nextOffset ?? items.length,
        limit: 25,
        status,
        query: debouncedQuery,
      });

      setItems((prev) => {
        const existingIds = new Set(prev.map((i) => i.id));
        const newItems = res.items.filter((i) => !existingIds.has(i.id));
        return [...prev, ...newItems];
      });
      setHasMore(res.hasMore);
      setNextOffset(res.nextOffset);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    hasMore,
    isLoadingMore,
    isLoading,
    nextOffset,
    items.length,
    status,
    debouncedQuery,
  ]);

  // Refresh entire list
  const refreshList = useCallback(async () => {
    setIsLoading(true);
    try {
      const [batch, newCounts] = await Promise.all([
        getAnimeBatch({
          offset: 0,
          limit: 25,
          status,
          query: debouncedQuery,
        }),
        getAnimeCounts(),
      ]);
      setItems(batch.items);
      setHasMore(batch.hasMore);
      setNextOffset(batch.nextOffset);
      setCounts(newCounts);
    } finally {
      setIsLoading(false);
    }
  }, [status, debouncedQuery]);

  // View mode handler
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    startActionTransition(async () => {
      await updateTableSettings({ viewMode: mode });
    });
  }, []);

  // Show original title toggle handler
  const setShowOriginalTitle = useCallback((show: boolean) => {
    setShowOriginalTitleState(show);
    startActionTransition(async () => {
      await updateTableSettings({ showOriginalTitle: show });
    });
  }, []);

  // Show poster in table row toggle handler
  const setShowPosterInTableRow = useCallback((show: boolean) => {
    setShowPosterInTableRowState(show);
    startActionTransition(async () => {
      await updateTableSettings({ showPosterInTableRow: show });
    });
  }, []);

  // Action: Add Anime
  const handleAddAnime = useCallback(
    async (input: UpdateAnimeInput) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticItem: FilterableAnime = {
        id: tempId,
        title: input.title,
        originalTitle: input.originalTitle,
        season: input.season,
        episode: input.episode,
        episodes: input.episodes,
        status: input.status,
        posterUrl: input.posterUrl ?? null,
      };

      startActionTransition(async () => {
        setOptimisticItems({ type: "ADD", payload: optimisticItem });
        setOptimisticCounts({ type: "ADD", payload: optimisticItem });

        const created = await addNewAnime(input);
        if (created) {
          setItems((prev) => [created, ...prev.filter((i) => i.id !== tempId)]);
          setCounts((prev) => ({
            ...prev,
            ALL: prev.ALL + 1,
            [input.status]: prev[input.status] + 1,
          }));
        }
      });
    },
    [setOptimisticItems, setOptimisticCounts],
  );

  // Action: Update Anime
  const handleUpdateAnime = useCallback(
    async (id: string, input: UpdateAnimeInput) => {
      const optimisticItem: FilterableAnime = {
        id,
        title: input.title,
        originalTitle: input.originalTitle,
        season: input.season,
        episode: input.episode,
        episodes: input.episodes,
        status: input.status,
        posterUrl: input.posterUrl ?? null,
      };

      startActionTransition(async () => {
        setOptimisticItems({ type: "UPDATE", payload: optimisticItem });
        setOptimisticCounts({ type: "UPDATE", payload: optimisticItem });

        const updated = await updateAnime(id, input);
        if (updated) {
          setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
        }
      });
    },
    [setOptimisticItems, setOptimisticCounts],
  );

  // Action: Delete Anime
  const handleDeleteAnime = useCallback(
    async (id: string) => {
      const target = items.find((i) => i.id === id);

      startActionTransition(async () => {
        setOptimisticItems({ type: "DELETE", payload: { id } });
        setOptimisticCounts({ type: "DELETE", payload: { id } });

        await deleteAnime(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (target) {
          setCounts((prev) => ({
            ...prev,
            ALL: Math.max(0, prev.ALL - 1),
            [target.status]: Math.max(0, prev[target.status] - 1),
          }));
        }
      });
    },
    [items, setOptimisticItems, setOptimisticCounts],
  );

  // Action: Update Episode
  const handleUpdateEpisode = useCallback(
    async (id: string, episode: number) => {
      startActionTransition(async () => {
        setOptimisticItems({
          type: "UPDATE_EPISODE",
          payload: { id, episode },
        });

        await updateAnimeEpisode(id, episode);
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, episode } : i)),
        );
      });
    },
    [setOptimisticItems],
  );

  return (
    <AnimeContext.Provider
      value={{
        animeList: optimisticItems,
        hasMore,
        isLoading,
        isLoadingMore,
        loadMore,
        refreshList,
        status,
        setStatus,
        query,
        setQuery,
        statusCounts: optimisticCounts,
        totalCount: optimisticCounts.ALL,
        viewMode,
        setViewMode,
        showOriginalTitle,
        setShowOriginalTitle,
        showPosterInTableRow,
        setShowPosterInTableRow,
        addAnime: handleAddAnime,
        updateAnime: handleUpdateAnime,
        deleteAnime: handleDeleteAnime,
        updateEpisode: handleUpdateEpisode,
      }}
    >
      {children}
    </AnimeContext.Provider>
  );
};
