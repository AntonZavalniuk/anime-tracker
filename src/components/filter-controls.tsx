"use client";

import { useState } from "react";
import { SearchField } from "@/components/search-field";
import { Filters } from "@/components/filters";
import { AnimeDialog } from "@/components/anime-dialog";
import { ExportImportDialog } from "@/components/export-import-dialog";
import { TableSettingsDialog } from "@/components/table-settings-dialog";
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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5 backdrop-blur-xl shadow-lg transition-all">
      {/* Search Input across the full row */}
      <div className="w-full">
        <SearchField value={query} onChange={setQuery} />
      </div>

      {/* Status Filter Tabs & Action Toolbar */}
      <Filters
        status={status}
        onStatusChange={setStatus}
        statusCounts={statusCounts}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAdd={() => setIsAddOpen(true)}
        onOpenExportImport={() => setIsExportImportOpen(true)}
        onOpenTableSettings={() => setIsTableSettingsOpen(true)}
      />

      {/* Modals */}
      <AnimeDialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ExportImportDialog
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
      />
      <TableSettingsDialog
        isOpen={isTableSettingsOpen}
        onClose={() => setIsTableSettingsOpen(false)}
      />
    </div>
  );
};
