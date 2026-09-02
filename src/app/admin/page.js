"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch("/api/admin/channel-clicks");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/channel-clicks");
        if (response.ok) {
          setIsAuthenticated(true);
          await loadStats();
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setPassword("");
        setIsAuthenticated(true);
        await loadStats();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("Failed to authenticate");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAuthenticated(false);
      setStats(null);
      setPassword("");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

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

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {!isAuthenticated ? (
            <LoginForm
              password={password}
              setPassword={setPassword}
              error={error}
              submitting={submitting}
              onSubmit={handleLogin}
            />
          ) : (
            <Dashboard
              stats={stats}
              loading={statsLoading}
              onLogout={handleLogout}
              onRefresh={loadStats}
            />
          )}
        </div>
      </main>
    </>
  );
}

function LoginForm({ password, setPassword, error, submitting, onSubmit }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Enter your password to access the dashboard.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-accent/40 disabled:opacity-50"
            placeholder="Enter admin password"
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !password}
          className="w-full px-5 py-2.5 rounded-xl bg-primary-accent text-primary-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-accent/40"
        >
          {submitting ? "Authenticating..." : "Login"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ stats, loading, onLogout, onRefresh }) {
  const formattedLastClick = stats?.lastClick
    ? formatCairoTime(new Date(stats.lastClick))
    : "Never";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            YouTube Channel Clicks Analytics
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-card-foreground hover:bg-muted/50 hover:border-primary-accent/30 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent/40"
        >
          Logout
        </button>
      </div>

      {loading && !stats ? (
        <div className="text-muted-foreground text-sm">Loading statistics...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatsCard
            label="Total Channel Clicks"
            value={stats?.totalClicks ?? 0}
          />
          <StatsCard
            label="Last Click — Cairo time"
            value={formattedLastClick}
          />
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Timezone: Cairo (Africa/Cairo)
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-card-foreground hover:bg-muted/50 hover:border-primary-accent/30 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-accent/40"
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}

function StatsCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {label}
      </div>
      <div className="text-4xl font-bold text-primary-accent">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </div>
    </div>
  );
}

function formatCairoTime(date) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (err) {
    console.error("Failed to format time:", err);
    return date.toISOString();
  }
}
