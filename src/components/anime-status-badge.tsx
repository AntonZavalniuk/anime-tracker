import { cn } from "@/lib/utils";
import type { AnimeStatus } from "@/actions/anime";

type AnimeStatusBadgeProps = {
  status: AnimeStatus;
  variant?: "badge" | "card";
  className?: string;
};

const STATUS_CONFIG: Record<
  AnimeStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  AIRING: {
    label: "Airing",
    dotClass: "bg-emerald-500",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  COMPLETED: {
    label: "Completed",
    dotClass: "bg-blue-500",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  UPCOMING: {
    label: "Upcoming",
    dotClass: "bg-amber-500",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

export const AnimeStatusBadge = ({
  status,
  variant = "badge",
  className,
}: AnimeStatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.AIRING;

  if (variant === "card") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-md",
          className,
        )}
      >
        <span
          className={cn("h-1.5 w-1.5 rounded-full shadow-xs", config.dotClass)}
        />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-xs",
        config.badgeClass,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
};
