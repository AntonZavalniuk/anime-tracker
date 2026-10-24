"use client";

import { useState, useRef } from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  X,
  ArrowUpDown,
  Download,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { exportAnimeList, importAnimeList } from "@/actions/anime";
import { useAnime } from "@/context/anime-context";
import { cn } from "@/lib/utils";

type ExportImportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ExportImportDialog = ({
  isOpen,
  onClose,
}: ExportImportDialogProps) => {
  const { totalCount, refreshList } = useAnime();
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [duplicateMode, setDuplicateMode] = useState<"skip" | "overwrite">("skip");
  const [importJsonText, setImportJsonText] = useState("");
  const [importFileName, setImportFileName] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const data = await exportAnimeList();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `anitracker-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setStatusMessage({
        type: "success",
        text: `Successfully exported ${data.length} anime titles.`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to export data",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importJsonText.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please select a JSON file or paste JSON content.",
      });
      return;
    }

    setIsImporting(true);
    setStatusMessage(null);

    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      if (items.length === 0) {
        throw new Error("No items found in the JSON file.");
      }

      const res = await importAnimeList(items, duplicateMode);
      await refreshList();

      setStatusMessage({
        type: "success",
        text: `Import completed! Created: ${res.createdCount}, Updated: ${res.updatedCount}, Skipped: ${res.skippedCount}.`,
      });
      setImportJsonText("");
      setImportFileName("");
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Invalid JSON format",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <ArrowUpDown className="h-4 w-4" />
              </div>
              <Dialog.Title className="text-base font-bold tracking-tight">
                Export / Import
              </Dialog.Title>
            </div>
            <Dialog.Close
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex rounded-xl border border-border/60 bg-background/50 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("export");
                setStatusMessage(null);
              }}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-medium transition-all",
                activeTab === "export"
                  ? "bg-accent text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("import");
                setStatusMessage(null);
              }}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-medium transition-all",
                activeTab === "import"
                  ? "bg-accent text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Import
            </button>
          </div>

          {statusMessage && (
            <div
              className={cn(
                "mt-4 flex items-center gap-2 rounded-xl border p-3 text-xs font-medium",
                statusMessage.type === "success"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-destructive/20 bg-destructive/10 text-destructive",
              )}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === "export" ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="text-xs text-muted-foreground">
                  Download all your tracked anime (currently{" "}
                  <span className="font-semibold text-foreground">
                    {totalCount}
                  </span>{" "}
                  titles) as a standard JSON backup file.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting || totalCount === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>Download JSON Backup</span>
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/30 p-4 text-center transition-colors hover:border-indigo-500/60 hover:bg-indigo-500/5"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="mt-2 text-xs font-medium text-foreground">
                  {importFileName ? importFileName : "Select JSON file to import"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Click to browse files
                </span>
              </div>

              {/* Duplicate Handling */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Duplicates strategy
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDuplicateMode("skip")}
                    className={cn(
                      "flex-1 rounded-xl border border-border/60 py-2 text-xs font-medium transition-all",
                      duplicateMode === "skip"
                        ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    Skip duplicates
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplicateMode("overwrite")}
                    className={cn(
                      "flex-1 rounded-xl border border-border/60 py-2 text-xs font-medium transition-all",
                      duplicateMode === "overwrite"
                        ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-muted-foreground hover:bg-accent",
                    )}
                  >
                    Overwrite
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleImport}
                disabled={isImporting || !importJsonText}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>Import Titles</span>
              </button>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
