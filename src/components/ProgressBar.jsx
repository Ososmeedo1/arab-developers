"use client";

import { cn } from "@/lib/utils";

export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm text-muted-foreground">
          Step{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {current}
          </span>{" "}
          of {total}
        </span>
        <span className="text-sm tabular-nums text-muted-foreground">
          {pct}%
        </span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-primary-accent transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
