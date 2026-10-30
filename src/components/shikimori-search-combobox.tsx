"use client";

import { useEffect, useRef, useState } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { Loader2, Search } from "lucide-react";
import { searchShikimoriAnime, type ShikimoriSearchResult } from "@/actions/shikimori";
import { cn } from "@/lib/utils";

type ShikimoriSearchComboboxProps = {
  onSelect: (result: ShikimoriSearchResult) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export const ShikimoriSearchCombobox = ({
  onSelect,
  placeholder = "Search anime title...",
  autoFocus,
}: ShikimoriSearchComboboxProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<ShikimoriSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const trimmed = debouncedQuery.trim();

    let isSubscribed = true;
    setIsLoading(true);

    searchShikimoriAnime(trimmed)
      .then((res) => {
        if (!isSubscribed) return;
        setResults(res);
        setErrorMessage(null);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setResults([]);
        setErrorMessage(
          err instanceof Error ? err.message : "Shikimori search failed.",
        );
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [debouncedQuery]);

  const isQueryTooShort = debouncedQuery.trim().length < 2;
  const displayResults = isQueryTooShort ? [] : results;

  return (
    <Combobox.Root<ShikimoriSearchResult>
      items={displayResults}
      filter={null}
      inputValue={query}
      onInputValueChange={(value) => setQuery(value)}
      onValueChange={(value) => {
        if (value) onSelect(value);
      }}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Combobox.Input
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border/60 bg-background/50 py-2 pr-3.5 pl-9 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <Combobox.Portal>
        <Combobox.Positioner className="z-50 w-(--anchor-width) outline-none" sideOffset={6}>
          <Combobox.Popup className="max-h-72 overflow-auto rounded-xl border border-border/60 bg-card/95 p-1.5 shadow-2xl backdrop-blur-xl">
            {errorMessage && (
              <div className="px-2.5 py-2 text-xs font-medium text-destructive">
                {errorMessage}
              </div>
            )}

            <Combobox.Status
              className={cn(
                "text-xs text-muted-foreground",
                isLoading ? "px-2.5 py-2" : "sr-only",
              )}
            >
              {isLoading ? "Searching Shikimori..." : ""}
            </Combobox.Status>

            {!isLoading && !errorMessage && (
              <Combobox.Empty className="px-2.5 py-2 text-xs text-muted-foreground">
                {isQueryTooShort
                  ? "Type at least 2 characters to search."
                  : "No results found."}
              </Combobox.Empty>
            )}

            <Combobox.List>
              {(item: ShikimoriSearchResult) => (
                <Combobox.Item
                  key={item.shikimoriId}
                  value={item}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                    "data-[highlighted]:bg-indigo-500/10",
                  )}
                >
                  {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnailUrl}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-11 w-8 shrink-0 rounded-md border border-border/60 bg-muted object-cover"
                    />
                  ) : (
                    <div className="h-11 w-8 shrink-0 rounded-md border border-border/60 bg-muted" />
                  )}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.title}
                    </p>
                    {item.originalTitle && item.originalTitle !== item.title && (
                      <p className="truncate text-[11px] text-muted-foreground">
                        {item.originalTitle}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground">
                      {item.year ?? "—"} · {item.episodes || "?"} eps · {item.kind}
                    </p>
                  </div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
};
