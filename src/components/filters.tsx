import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/actions/table-settings";
import type { StatusFilter } from "@/context/anime-context";

type FiltersProps = {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  statusCounts: Record<StatusFilter, number>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "AIRING", label: "Airing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "UPCOMING", label: "Upcoming" },
];

export const Filters = ({
  status,
  onStatusChange,
  statusCounts,
  viewMode,
  onViewModeChange,
}: FiltersProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={cn(
              "rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              status === tab.value &&
                "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-muted-foreground/70">
              {statusCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-background/40 p-1">
        <button
          type="button"
          onClick={() => onViewModeChange("TABLE")}
          aria-pressed={viewMode === "TABLE"}
          title="Table view"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors",
            viewMode === "TABLE" && "bg-accent text-foreground",
          )}
        >
          <LayoutList className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("GRID")}
          aria-pressed={viewMode === "GRID"}
          title="Grid view"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors",
            viewMode === "GRID" && "bg-accent text-foreground",
          )}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
