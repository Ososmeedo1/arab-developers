"use client";

import { cn } from "@/lib/utils";

export default function StatBar({ label, count, percentage, color = "bg-primary-accent" }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-card-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">
          {count} <span className="text-xs">({percentage}%)</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", color)}
          style={{ width: `${Math.max(percentage, 0.6)}%` }}
        />
      </div>
    </div>
  );
}
