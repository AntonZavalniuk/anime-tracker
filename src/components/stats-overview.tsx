import { Film, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { getMyAnimeList } from "@/actions/anime";

export const StatsOverview = async () => {
  const anime = await getMyAnimeList();

  const total = anime.length;
  const airing = anime.filter((item) => item.status === "AIRING").length;
  const completed = anime.filter((item) => item.status === "COMPLETED").length;
  const upcoming = anime.filter((item) => item.status === "UPCOMING").length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
      <StatsCard
        label="Total Anime"
        value={total}
        unit="titles"
        icon={Film}
        iconClassName="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        barClassName="bg-linear-to-r from-indigo-500 to-purple-500"
      />

      <StatsCard
        label="Airing"
        value={airing}
        unit="airing"
        icon={PlayCircle}
        iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        valueClassName="text-emerald-600 dark:text-emerald-400"
        barClassName="bg-emerald-500"
        pulse
      />

      <StatsCard
        label="Completed"
        value={completed}
        unit="watched"
        icon={CheckCircle2}
        iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        valueClassName="text-blue-600 dark:text-blue-400"
        barClassName="bg-blue-500"
      />

      <StatsCard
        label="Upcoming"
        value={upcoming}
        unit="planned"
        icon={Clock}
        iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        valueClassName="text-amber-600 dark:text-amber-400"
        barClassName="bg-amber-500"
      />
    </div>
  );
};

export const StatsOverviewFallback = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-23 animate-pulse rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl"
      />
    ))}
  </div>
);
