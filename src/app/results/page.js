"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import SectionCard from "@/components/SectionCard";

const FOCUS_LABELS = { frontend: "Frontend", backend: "Backend", fullstack: "Full-stack" };
const FE_LABELS = { react: "React", angular: "Angular", vue: "Vue" };
const BE_LABELS = { node: "Node.js", dotnet: ".NET", php: "PHP", python: "Python", java: "Java" };
const AGE_LABELS = { under18: "Under 18", "18-24": "18–24", "25-34": "25–34", "35-44": "35–44", "45+": "45+" };
const EDU_LABELS = { graduate: "Graduate", student: "Student" };
const EMP_LABELS = { employed: "Employed", freelancer: "Freelancer", unemployed: "Un-employed" };

const CHANNEL_URL = "https://youtube.com/@masar1424";

function getPercentage(value, items) {
  const item = items.find((i) => i.key === value);
  return item ? item.percentage : 0;
}

function getComparisonInfo(field, value, analytics) {
  const items = analytics[field];
  if (!items || items.length === 0) return null;

  const pct = getPercentage(value, items);
  if (pct === 0) return null;

  const labels =
    field === "focus"
      ? FOCUS_LABELS
      : field === "frontendFramework"
        ? FE_LABELS
        : field === "backendFramework"
          ? BE_LABELS
          : field === "ageRange"
            ? AGE_LABELS
            : field === "education"
              ? EDU_LABELS
              : EMP_LABELS;

  const label = labels[value] || value;

  const textByField = {
    focus: `You're part of ${pct}% of participants who identify as ${label}.`,
    frontendFramework: `You're part of ${pct}% of participants who use ${label}.`,
    backendFramework: `You're part of ${pct}% of participants who use ${label}.`,
    ageRange: `You're part of ${pct}% of participants in the ${label} age group.`,
    education: `You're part of ${pct}% of participants who are ${label}.`,
    employment: `You're part of ${pct}% of participants who are ${label}.`,
  };

  return { label, pct, text: textByField[field] };
}

export default function ResultsPage() {
  const [response, setResponse] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [resRes, anaRes] = await Promise.all([
          fetch("/api/responses/me"),
          fetch("/api/analytics"),
        ]);

        if (!resRes.ok) {
          setError("no-response");
          setLoading(false);
          return;
        }

        const resData = await resRes.json();
        const anaData = anaRes.ok ? await anaRes.json() : null;

        setResponse(resData);
        setAnalytics(anaData);
      } catch {
        setError("load-failed");
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

  if (error === "no-response") {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-5 max-w-md">
            <h1 className="text-2xl font-bold tracking-tight">No profile yet</h1>
            <p className="text-muted-foreground">
              Answer a few quick questions to build your developer profile and
              see how you compare.
            </p>
            <Link
              href="/survey"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-primary-accent text-primary-accent-foreground font-semibold text-[15px] hover:opacity-90 transition-opacity shadow-sm shadow-primary-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/50"
            >
              Start Survey
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (error === "load-failed") {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">
              Failed to load your profile. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/25 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </>
    );
  }

  const comparisons = [];
  if (analytics) {
    const push = (field, value) => {
      const info = getComparisonInfo(field, value, analytics);
      if (info) comparisons.push(info);
    };
    push("focus", response.focus);
    if (response.frontendFramework) push("frontendFramework", response.frontendFramework);
    if (response.backendFramework) push("backendFramework", response.backendFramework);
    push("ageRange", response.ageRange);
    push("education", response.education);
    push("employment", response.employment);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
          {/* Profile header */}
          <SectionCard className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-accent/10 blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <Logo size={16} />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-accent" />
                Your Developer Profile
              </div>
              <div className="flex flex-wrap gap-2">
                <ProfileTag>{FOCUS_LABELS[response.focus]}</ProfileTag>
                {response.frontendFramework && (
                  <ProfileTag>{FE_LABELS[response.frontendFramework]}</ProfileTag>
                )}
                {response.backendFramework && (
                  <ProfileTag>{BE_LABELS[response.backendFramework]}</ProfileTag>
                )}
                <ProfileTag>{AGE_LABELS[response.ageRange]}</ProfileTag>
                <ProfileTag>{EDU_LABELS[response.education]}</ProfileTag>
                <ProfileTag>{EMP_LABELS[response.employment]}</ProfileTag>
              </div>
            </div>
          </SectionCard>

          {/* Comparisons */}
          {comparisons.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide px-1">
                How you compare
              </div>
              <div className="space-y-2.5">
                {comparisons.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/70 bg-card px-5 py-4 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-14 text-center">
                      <div className="text-lg font-bold text-primary-accent tabular-nums">
                        {c.pct}%
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-1">
                        <div
                          className="h-full rounded-full bg-primary-accent transition-all duration-500"
                          style={{ width: `${Math.max(c.pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <Link
              href="/survey"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-card-foreground hover:bg-muted/50 hover:border-primary-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40"
            >
              Edit My Answers
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-card-foreground hover:bg-muted/50 hover:border-primary-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40"
            >
              Explore Insights
            </Link>
          </div>

          {/* YouTube CTA */}
          <YouTubeCTA />
        </div>
      </main>
    </>
  );
}

function ProfileTag({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-muted/70 border border-border/60 text-sm font-medium text-foreground">
      {children}
    </span>
  );
}

function YouTubeCTA() {
  const handleChannelClick = async () => {
    try {
      // Fire and forget tracking
      fetch("/api/channel-click", { method: "POST" }).catch(() => {
        // Silently fail - don't block navigation
      });
    } catch (err) {
      // Silently fail
    }
  };

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7">
      <div className="flex items-center gap-2 mb-3">

        <Logo size={20} />

        <span className="text-sm font-semibold text-muted-foreground">
          مسار برمجي
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5" dir="rtl">
        لو أنت مهتم بمحتوي ال &quot;Frontend&quot; ف القناة دي هي الأولي من نوعها في المحتوي العربي و يعتبر فيها محتوي ال Frontend كله
      </p>
      <a
        href={CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleChannelClick}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/50"
      >
        Visit my channel
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
