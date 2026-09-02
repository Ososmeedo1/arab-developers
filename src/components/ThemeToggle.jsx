"use client";

import { useTheme } from "@/lib/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-5 h-5" />;
    }
    return theme === "light" ? (
      <Moon className="w-5 h-5" />
    ) : (
      <Sun className="w-5 h-5" />
    );
  };

  const getLabel = () => {
    if (theme === "system") {
      return "Switch to light mode";
    }
    return `Switch to ${theme === "light" ? "dark" : "system"} mode`;
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/40"
    >
      {getIcon()}
    </button>
  );
}
