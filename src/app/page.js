import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import { getResponsesCollection } from "@/lib/mongodb";

async function getParticipantCount() {
  try {
    const col = await getResponsesCollection();
    return await col.countDocuments();
  } catch {
    return 0;
  }
}

export default async function Home() {
  const total = await getParticipantCount();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.10),transparent_55%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary-accent/10 blur-3xl"
          />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-14 text-center">
            <div className="inline-flex items-center justify-center gap-2.5 px-3 py-1.5 rounded-full border border-border/80 bg-card/60 mb-8">
              <Logo size={18} />
              <span className="text-sm font-medium text-muted-foreground">
                Anonymous developer community survey
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              Arab Developers
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed"
              dir="rtl"
            >
              شارك في استبيان مجهول مدته أقل من دقيقة، واكتشف شكل مجتمع المبرمجين
              العرب بالأرقام.
            </p>

            <p className="text-sm text-muted-foreground/70 mb-10">
              Your answers are anonymous. No account or personal information
              required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/survey"
                className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-primary-accent text-primary-accent-foreground font-semibold text-[15px] hover:opacity-90 transition-opacity shadow-sm shadow-primary-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/50 min-w-[180px]"
              >
                Start Survey
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center justify-center px-7 py-3 rounded-xl border border-border bg-card text-[15px] font-medium text-card-foreground hover:bg-muted/50 hover:border-primary-accent/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/50"
              >
                View Insights
              </Link>
            </div>

            {total > 0 && (
              <p className="mt-8 text-sm text-muted-foreground">
                <span className="font-bold text-foreground tabular-nums">
                  {total.toLocaleString("en-US")}
                </span>{" "}
                {total === 1 ? "developer" : "developers"} participated
              </p>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Three steps between you and the community picture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Answer 5 questions",
                desc: "Quick, anonymous survey about your stack and background.",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Get your developer profile",
                desc: "See where you fit in among current participants.",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4 0m4 0a4 4 0 00-4 0M16 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Explore community insights",
                desc: "Real aggregate analytics from real developers.",
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M4 19V9m5 10V5m5 14v-7m5 7V3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-border/70 bg-card p-6 shadow-sm shadow-black/[0.02] transition-all hover:border-primary-accent/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-accent/10 text-primary-accent">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground/50">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-card-foreground mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
