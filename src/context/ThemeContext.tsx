"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Theme = "neon" | "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "neon",
  setTheme: () => {},
});

let themeSnapshot: Theme = "neon";

function getThemeSnapshot(): Theme {
  return themeSnapshot;
}

function subscribeToTheme(callback: () => void): () => void {
  const handleThemeChange = () => {
    const saved = window.localStorage.getItem("adam-blueprint-theme");
    themeSnapshot = saved === "neon" || saved === "light" || saved === "dark" ? saved : "neon";
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
    (): Theme => "neon"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = (nextTheme: Theme) => {
    window.localStorage.setItem("adam-blueprint-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event("adam-blueprint-theme-change"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
