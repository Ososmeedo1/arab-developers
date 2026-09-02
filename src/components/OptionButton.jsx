"use client";

import { cn } from "@/lib/utils";

export default function OptionButton({ label, selected, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative w-full text-left px-5 py-4 rounded-xl border transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/50",
        "active:scale-[0.99]",
        selected
          ? "border-primary-accent/70 bg-primary-accent/[0.08] ring-1 ring-primary-accent/30 shadow-sm"
          : "border-border bg-card hover:border-primary-accent/40 hover:bg-muted/40 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full border transition-colors",
            selected
              ? "border-primary-accent bg-primary-accent"
              : "border-border group-hover:border-primary-accent/50"
          )}
          aria-hidden="true"
        >
          {selected && (
            <span className="w-2 h-2 rounded-full bg-primary-accent-foreground" />
          )}
        </span>
        {icon && <span className="text-lg opacity-70">{icon}</span>}
        <span
          className={cn(
            "font-medium",
            selected ? "text-foreground" : "text-card-foreground"
          )}
        >
          {label}
        </span>
      </div>
    </button>
  );
}
