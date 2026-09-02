"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import StatBar from "@/components/StatBar";
import InsightCard from "@/components/InsightCard";
import SectionCard from "@/components/SectionCard";
import CrossAnalyticsChart from "@/components/CrossAnalyticsChart";

export default function InsightsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAnalytics(data);
      } catch {
        setError("Failed to load analytics.");
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <ErrorState message={error} />
        </main>
      </>
    );
  }

  if (analytics.total === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md py-10">
            <h1 className="text-2xl font-bold tracking-tight">No responses yet</h1>
            <p className="text-muted-foreground">
              Community insights will appear here once developers start
              participating.
            </p>
          </div>
        </main>
      </>
    );
  }

  const total = analytics.total;
  const rankedFE = [...analytics.frontendFramework].sort((a, b) => b.count - a.count);
  const rankedBE = [...analytics.backendFramework].sort((a, b) => b.count - a.count);
  const rankedAge = [...analytics.ageRange].sort((a, b) => b.count - a.count);
  const topFocus = [...analytics.focus].sort((a, b) => b.count - a.count)[0];
  const topFE = rankedFE[0];
  const topBE = rankedBE[0];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
          {/* Hero stat */}
          <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-7 sm:p-9 shadow-sm shadow-black/[0.02]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-primary-accent/10 blur-3xl"
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Community Insights
              </p>
              <div className="flex items-end gap-3">
                <span className="text-5xl sm:text-6xl font-bold tracking-tight tabular-nums leading-none">
                  {total.toLocaleString()}
                </span>
                <span className="pb-1 text-muted-foreground text-lg">
                  {total === 1 ? "developer" : "developers"} participated
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniStat label="Top focus" value={topFocus.label} accent />
                <MiniStat label="Top frontend" value={topFE.count > 0 ? topFE.label : "—"} />
                <MiniStat label="Top backend" value={topBE.count > 0 ? topBE.label : "—"} />
              </div>
            </div>
          </header>

          {/* Findings */}
          {analytics.findings.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
                Interesting findings
              </div>
              <div className="grid grid-cols-1 gap-3">
                {analytics.findings.map((f, i) => (
                  <InsightCard key={i} text={f.text} />
                ))}
              </div>
            </div>
          )}

          {/* Development Focus */}
          <SectionCard title="Development Focus" subtitle="How participants describe their primary focus.">
            <div className="space-y-3.5">
              {analytics.focus.map((item) => (
                <StatBar
                  key={item.key}
                  label={item.label}
                  count={item.count}
                  percentage={item.percentage}
                />
              ))}
            </div>
          </SectionCard>

          {/* Frontend & Backend Frameworks */}
          <div className="grid grid-cols-1 gap-6">
            <SectionCard title="Frontend Frameworks" subtitle="Ranked by selection among participants.">
              {rankedFE.some((i) => i.count > 0) ? (
                <div className="space-y-3.5">
                  {rankedFE.map((item) => (
                    <StatBar
                      key={item.key}
                      label={item.label}
                      count={item.count}
                      percentage={item.percentage}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              )}
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SectionCard title="Backend Frameworks" subtitle="Ranked by selection among participants.">
              {rankedBE.some((i) => i.count > 0) ? (
                <div className="space-y-3.5">
                  {rankedBE.map((item) => (
                    <StatBar
                      key={item.key}
                      label={item.label}
                      count={item.count}
                      percentage={item.percentage}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              )}
            </SectionCard>
          </div>

          {/* Age */}
          <SectionCard title="Age" subtitle="Age distribution of participants.">
            <div className="space-y-3.5">
              {rankedAge.map((item) => (
                <StatBar
                  key={item.key}
                  label={item.label}
                  count={item.count}
                  percentage={item.percentage}
                />
              ))}
            </div>
          </SectionCard>

          {/* Education & Employment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CompactSection title="Education" items={analytics.education} color="bg-secondary-accent" />
            <CompactSection title="Employment" items={analytics.employment} color="bg-primary-accent/80" />
          </div>

          {/* Cross Analytics */}
          {analytics.crossAnalytics.length > 0 && (
            <div className="space-y-6">
              <div className="text-lg font-semibold text-card-foreground tracking-tight px-1">
                Cross Analysis
              </div>
              <div className="space-y-6">
                {analytics.crossAnalytics.map((cross, i) => (
                  <CrossAnalyticsChart
                    key={i}
                    title={cross.title}
                    rows={cross.rows}
                    columns={cross.columns}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function MiniStat({ label, value, accent }) {
  return (
    <div
      className={
        accent
          ? "rounded-xl border border-primary-accent/20 bg-primary-accent/[0.06] px-4 py-3"
          : "rounded-xl border border-border/60 bg-muted/30 px-4 py-3"
      }
    >
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="font-semibold text-foreground">{value}</div>
    </div>
  );
}

function CompactSection({ title, items, color }) {
  return (
    <SectionCard title={title}>
      <div className="space-y-3.5">
        {items.map((item) => (
          <StatBar
            key={item.key}
            label={item.label}
            count={item.count}
            percentage={item.percentage}
            color={color}
          />
        ))}
      </div>
    </SectionCard>
  );
}

function ErrorState({ message }) {
  return (
    <div className="text-center space-y-3 py-10">
      <p className="text-muted-foreground">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/25 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40"
      >
        Retry
      </button>
    </div>
  );
}
