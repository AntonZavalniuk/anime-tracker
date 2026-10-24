"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchField = ({ value, onChange }: SearchFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 min-w-60">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title or original title..."
        className="h-12 w-full rounded-xl border-border/70 bg-card/60 pl-10 pr-20 text-sm shadow-sm backdrop-blur-md transition-all focus:border-indigo-500/80 focus:bg-background focus:ring-4 focus:ring-indigo-500/15"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
        {value ? (
          <button
            onClick={() => onChange("")}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            title="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border/80 bg-muted/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-[9px]">⌘</span>k
          </kbd>
        )}
      </div>
    </div>
  );
};
