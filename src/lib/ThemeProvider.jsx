"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

const ThemeContext = createContext(undefined);

function applyTheme(newTheme) {
  let isDark = false;
  if (newTheme === "dark") {
    isDark = true;
  } else if (newTheme === "light") {
    isDark = false;
  } else if (newTheme === "system") {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("system");

  useLayoutEffect(() => {
    // Get theme from localStorage or default to system
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme || "system";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = localStorage.getItem("theme") || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    let newTheme;
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      newTheme = isDark ? "light" : "dark";
    } else if (theme === "light") {
      newTheme = "dark";
    } else {
      newTheme = "light";
    }
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
