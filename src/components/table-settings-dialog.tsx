"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X, Settings, LayoutGrid, LayoutList } from "lucide-react";
import { useAnime } from "@/context/anime-context";
import { cn } from "@/lib/utils";

type TableSettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const TableSettingsDialog = ({
  isOpen,
  onClose,
}: TableSettingsDialogProps) => {
  const {
    showOriginalTitle,
    setShowOriginalTitle,
    viewMode,
    setViewMode,
  } = useAnime();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Settings className="h-4 w-4" />
              </div>
              <Dialog.Title className="text-base font-bold tracking-tight">
                Table Settings
              </Dialog.Title>
            </div>
            <Dialog.Close
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="mt-5 space-y-4">
            {/* Show Original Title Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3.5">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  Original Title
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Display original Japanese/Chinese title
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={showOriginalTitle}
                onClick={() => setShowOriginalTitle(!showOriginalTitle)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden",
                  showOriginalTitle ? "bg-indigo-600" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    showOriginalTitle ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>

            {/* View Mode Preference */}
            <div className="rounded-xl border border-border/60 bg-background/40 p-3.5 space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Default View Mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("TABLE")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-all",
                    viewMode === "TABLE"
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "border-border/60 text-muted-foreground hover:bg-accent",
                  )}
                >
                  <LayoutList className="h-4 w-4" />
                  <span>Table</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("GRID")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-all",
                    viewMode === "GRID"
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "border-border/60 text-muted-foreground hover:bg-accent",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 cursor-pointer"
            >
              Done
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
