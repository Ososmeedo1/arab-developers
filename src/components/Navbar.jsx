"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useHasResponse } from "@/lib/useHasResponse";

export default function Navbar() {
  const pathname = usePathname();
  const { hasResponse, loaded } = useHasResponse();

  const isInsightsActive = pathname === "/insights";
  const isProfileActive = pathname === "/results";

  return (
    <nav className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Arab Developers home"
        >
          <Logo size={26} />
          <span className="text-[15px] font-semibold tracking-tight">
            Arab Developers
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/insights"
            className={`px-3.5 py-2 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40 ${isInsightsActive
                ? "font-medium text-foreground bg-muted/50"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
          >
            Insights
          </Link>
          {loaded && hasResponse ? (
            <Link
              href="/results"
              className={`px-3.5 py-2 rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40 ${isProfileActive
                  ? "font-medium text-foreground bg-muted/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
            >
              My Profile
            </Link>
          ) : loaded && !hasResponse ? (
            <Link
              href="/survey"
              className="inline-flex items-center px-3.5 py-2 rounded-lg text-sm font-medium bg-primary-accent text-primary-accent-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40"
            >
              Start Survey
            </Link>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
