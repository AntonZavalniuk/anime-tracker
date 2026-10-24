import {
  LayoutGrid,
  LayoutList,
  ArrowUpDown,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/actions/table-settings";
import type { StatusFilter } from "@/context/anime-context";

type FiltersProps = {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  statusCounts: Record<StatusFilter, number>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAdd: () => void;
  onOpenExportImport: () => void;
  onOpenTableSettings: () => void;
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
  onOpenAdd,
  onOpenExportImport,
  onOpenTableSettings,
}: FiltersProps) => {
  return (
    <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
      {/* Status Filter Tabs (Scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onStatusChange(tab.value)}
            className={cn(
              "h-9 shrink-0 inline-flex items-center rounded-full border border-border/60 px-3.5 text-xs font-medium text-muted-foreground transition-all hover:text-foreground",
              status === tab.value &&
                "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs",
            )}
          >
            {tab.label}
            <span className="ml-1.5 text-muted-foreground/70">
              {statusCounts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* View Mode Switcher */}
        <div className="h-9 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/50 px-1 shadow-xs">
          <button
            type="button"
            onClick={() => onViewModeChange("TABLE")}
            aria-pressed={viewMode === "TABLE"}
            title="Table view"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-all active:scale-95",
              viewMode === "TABLE" &&
                "bg-linear-to-tr from-indigo-600 to-purple-600 text-white shadow-xs",
            )}
          >
            <LayoutList className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("GRID")}
            aria-pressed={viewMode === "GRID"}
            title="Grid view"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-all active:scale-95",
              viewMode === "GRID" &&
                "bg-linear-to-tr from-indigo-600 to-purple-600 text-white shadow-xs",
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Export / Import Button */}
        <button
          type="button"
          onClick={onOpenExportImport}
          title="Export / Import anime list"
          className="h-9 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3.5 text-xs font-medium text-foreground shadow-xs transition-all hover:bg-accent hover:border-border active:scale-95 cursor-pointer"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          <span className="hidden sm:inline">Export / Import</span>
          <span className="sm:hidden">Backup</span>
        </button>

        {/* Table Settings Button */}
        <button
          type="button"
          onClick={onOpenTableSettings}
          title="Table Settings"
          className="h-9 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3.5 text-xs font-medium text-foreground shadow-xs transition-all hover:bg-accent hover:border-border active:scale-95 cursor-pointer"
        >
          <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="hidden sm:inline">Table Settings</span>
          <span className="sm:hidden">Settings</span>
        </button>

        {/* Add Anime Button */}
        <button
          type="button"
          onClick={onOpenAdd}
          title="Add anime"
          className="h-9 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 px-4 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-indigo-500/35 hover:scale-102 active:scale-95 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5] shrink-0" />
          <span>Add anime</span>
        </button>
      </div>
    </div>
  );
};
