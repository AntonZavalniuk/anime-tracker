import { Badge } from "@/components/ui/badge";
import type { FilterableAnime } from "@/actions/anime";

type AnimeListProps = {
  animeList: FilterableAnime[];
  showOriginalTitle: boolean;
};

export const AnimeList = ({ animeList, showOriginalTitle }: AnimeListProps) => {
  return (
    <ul className="divide-y divide-border/60">
      {animeList.map((item) => (
        <li
          key={item.id}
          className="animate-scroll-entry flex items-center justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.title}</p>
            {showOriginalTitle && item.originalTitle && (
              <p className="truncate text-xs text-muted-foreground">
                {item.originalTitle}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
            <span>
              Ep {item.episode}/{item.episodes || "?"}
            </span>
            <Badge variant="secondary">{item.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
};
