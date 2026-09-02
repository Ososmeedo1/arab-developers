"use client";

export default function ComparisonCard({ text }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-5 py-4">
      <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
