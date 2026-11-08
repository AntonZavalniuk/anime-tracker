"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "@/lib/toast";

export const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme = "dark" } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4.5 shrink-0 text-emerald-500" />
        ),
        error: <OctagonXIcon className="size-4.5 shrink-0 text-destructive" />,
        info: <InfoIcon className="size-4.5 shrink-0 text-blue-500" />,
        warning: (
          <TriangleAlertIcon className="size-4.5 shrink-0 text-amber-500" />
        ),
        loading: (
          <Loader2Icon className="size-4.5 shrink-0 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-border/60 group-[.toaster]:bg-card/95 group-[.toaster]:text-card-foreground group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:font-sans group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:min-w-[320px] sm:group-[.toaster]:min-w-[360px]",
          title:
            "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:text-foreground",
          description:
            "group-[.toast]:text-xs group-[.toast]:text-muted-foreground leading-normal mt-0.5",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:font-medium",
          closeButton:
            "group-[.toast]:bg-background/60 group-[.toast]:border-border/60 group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground",
          success:
            "group-[.toaster]:border-emerald-500/30 group-[.toaster]:bg-emerald-500/10 group-[.toaster]:text-foreground",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-foreground",
          info: "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-foreground",
          warning:
            "group-[.toaster]:border-amber-500/30 group-[.toaster]:bg-amber-500/10 group-[.toaster]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

export { toast };
