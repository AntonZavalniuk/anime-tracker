"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FormInputProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
};

export const FormInput = ({
  id,
  label,
  icon: Icon,
  error,
  type = "text",
  className,
  ...props
}: FormInputProps) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className={cn(
            "w-full rounded-xl border border-border/60 bg-background/60 py-2.5 pl-10 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none",
            isPassword ? "pr-10" : "pr-4",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
