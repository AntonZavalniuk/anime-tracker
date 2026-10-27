"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAnime } from "@/context/anime-context";
import type { FilterableAnime } from "@/actions/anime";

type AnimeDeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  anime: FilterableAnime | null;
};

export const AnimeDeleteDialog = ({
  isOpen,
  onClose,
  anime,
}: AnimeDeleteDialogProps) => {
  const { deleteAnime } = useAnime();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!anime) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAnime(anime.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-destructive/20 bg-card/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <Dialog.Title className="text-base font-bold text-foreground">
                Delete Anime
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                This action cannot be undone.
              </Dialog.Description>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              &quot;{anime.title}&quot;
            </span>{" "}
            from your list?
          </p>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-xl border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:bg-destructive/90 active:scale-95 disabled:opacity-60"
            >
              {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete
            </button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
