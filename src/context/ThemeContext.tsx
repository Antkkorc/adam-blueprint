"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

function readSavedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem("adam-blueprint-theme");
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
}

// Keep the first server and client render identical; localStorage is applied
// after hydration through the external-store subscription.
let themeSnapshot: Theme = "light";

function getThemeSnapshot(): Theme {
  return themeSnapshot;
}

function subscribeToTheme(callback: () => void): () => void {
  const handleThemeChange = () => {
    themeSnapshot = readSavedTheme() ?? "light";
    callback();
  };
  window.addEventListener("adam-blueprint-theme-change", handleThemeChange);
  handleThemeChange();
  return () => window.removeEventListener("adam-blueprint-theme-change", handleThemeChange);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    (): Theme => "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    try {
      window.localStorage.setItem("adam-blueprint-theme", nextTheme);
    } catch {
      // The in-memory theme still updates when storage is unavailable.
    }
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.dispatchEvent(new Event("adam-blueprint-theme-change"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
