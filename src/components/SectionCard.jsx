import { cn } from "@/lib/utils";

export default function SectionCard({ title, subtitle, children, className }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-sm shadow-black/[0.02]",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-lg font-semibold text-card-foreground tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
