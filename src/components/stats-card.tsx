import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  iconClassName: string;
  valueClassName?: string;
  barClassName: string;
  pulse?: boolean;
};

export const StatsCard = ({
  label,
  value,
  unit,
  icon: Icon,
  iconClassName,
  valueClassName,
  barClassName,
  pulse,
}: StatsCardProps) => {
  return (
    <div className="group flex gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md">
      <div className={cn("w-1.5 h-full opacity-60", barClassName)} />

      <div className="flex-1 py-4 pr-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <div
            className={cn(
              "relative rounded-xl p-2 transition-transform group-hover:scale-110",
              iconClassName,
            )}
          >
            <Icon className="h-4 w-4" />
            {pulse && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={cn("text-2xl font-bold tracking-tight", valueClassName)}
          >
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
    </div>
  );
};
