import { Badge } from "@/components/ui/badge";
import type { FilterableAnime } from "@/actions/anime";

type AnimeGridProps = {
  animeList: FilterableAnime[];
  showOriginalTitle: boolean;
};

export const AnimeGrid = ({ animeList, showOriginalTitle }: AnimeGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {animeList.map((item) => (
        <div
          key={item.id}
          className="animate-scroll-entry space-y-1 rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-border"
        >
          <p className="truncate text-sm font-medium">{item.title}</p>
          {showOriginalTitle && item.originalTitle && (
            <p className="truncate text-xs text-muted-foreground">
              {item.originalTitle}
            </p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              Ep {item.episode}/{item.episodes || "?"}
            </span>
            <Badge variant="secondary">{item.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
