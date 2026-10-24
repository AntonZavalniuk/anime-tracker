"use client";

import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X, Loader2, Sparkles, Film } from "lucide-react";
import { useAnime } from "@/context/anime-context";
import type {
  AnimeStatus,
  FilterableAnime,
  UpdateAnimeInput,
} from "@/actions/anime";
import { cn } from "@/lib/utils";

type AnimeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  anime?: FilterableAnime | null;
};

const STATUS_OPTIONS: { value: AnimeStatus; label: string }[] = [
  { value: "AIRING", label: "Airing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "UPCOMING", label: "Upcoming" },
];

type AnimeDialogFormProps = {
  anime?: FilterableAnime | null;
  onClose: () => void;
};

const AnimeDialogForm = ({ anime, onClose }: AnimeDialogFormProps) => {
  const { addAnime, updateAnime } = useAnime();
  const isEditing = Boolean(anime);

  const [title, setTitle] = useState(anime?.title ?? "");
  const [originalTitle, setOriginalTitle] = useState(
    anime?.originalTitle ?? "",
  );
  const [posterUrl, setPosterUrl] = useState(anime?.posterUrl ?? "");
  const [season, setSeason] = useState(anime?.season || 1);
  const [episode, setEpisode] = useState(anime?.episode || 0);
  const [episodes, setEpisodes] = useState(anime?.episodes || 12);
  const [status, setStatus] = useState<AnimeStatus>(anime?.status ?? "AIRING");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload: UpdateAnimeInput = {
        title: title.trim(),
        originalTitle: originalTitle.trim() || null,
        posterUrl: posterUrl.trim() || null,
        season: Math.max(1, Number(season) || 1),
        episode: Math.max(0, Number(episode) || 0),
        episodes: Math.max(0, Number(episodes) || 0),
        status,
      };

      if (isEditing && anime) {
        await updateAnime(anime.id, payload);
      } else {
        await addAnime(payload);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-xs font-medium text-destructive">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="anime-title"
          className="text-xs font-medium text-muted-foreground"
        >
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="anime-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Безупречный мир / Perfect World"
          className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          required
        />
      </div>

      {/* Original Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="anime-original-title"
          className="text-xs font-medium text-muted-foreground"
        >
          Original Title
        </label>
        <input
          id="anime-original-title"
          type="text"
          value={originalTitle}
          onChange={(e) => setOriginalTitle(e.target.value)}
          placeholder="e.g. 完美世界 / Wanmei Shijie"
          className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Poster URL */}
      <div className="space-y-1.5">
        <label
          htmlFor="anime-poster-url"
          className="text-xs font-medium text-muted-foreground"
        >
          Poster URL
        </label>
        <input
          id="anime-poster-url"
          type="url"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          placeholder="https://example.com/poster.jpg"
          className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Season, Episode, Episodes */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="anime-season"
            className="text-xs font-medium text-muted-foreground"
          >
            Season
          </label>
          <input
            id="anime-season"
            type="number"
            min="1"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="anime-episode"
            className="text-xs font-medium text-muted-foreground"
          >
            Watched Ep
          </label>
          <input
            id="anime-episode"
            type="number"
            min="0"
            value={episode}
            onChange={(e) => setEpisode(Number(e.target.value))}
            className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="anime-episodes"
            className="text-xs font-medium text-muted-foreground"
          >
            Total Eps
          </label>
          <input
            id="anime-episodes"
            type="number"
            min="0"
            value={episodes}
            onChange={(e) => setEpisodes(Number(e.target.value))}
            className="w-full rounded-xl border border-border/60 bg-background/50 px-3.5 py-2 text-sm text-foreground transition-all outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Status
        </label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={cn(
                "flex-1 rounded-xl border border-border/60 py-2 text-xs font-medium transition-all",
                status === opt.value
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isEditing ? "Save Changes" : "Create Anime"}
        </button>
      </div>
    </form>
  );
};

export const AnimeDialog = ({ isOpen, onClose, anime }: AnimeDialogProps) => {
  const isEditing = Boolean(anime);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Film className="h-4 w-4" />
              </div>
              <Dialog.Title className="text-lg font-bold tracking-tight">
                {isEditing ? "Edit Anime" : "Add New Anime"}
              </Dialog.Title>
            </div>
            <Dialog.Close
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <AnimeDialogForm
            key={anime?.id ?? "new"}
            anime={anime}
            onClose={onClose}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
