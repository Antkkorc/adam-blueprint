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

let themeSnapshot: Theme = "light";

function getThemeSnapshot(): Theme {
  return themeSnapshot;
}

function subscribeToTheme(callback: () => void): () => void {
  const handleThemeChange = () => {
    const saved = window.localStorage.getItem("adam-blueprint-theme");
    themeSnapshot = saved === "dark" || saved === "light" ? saved : "light";
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
    window.localStorage.setItem("adam-blueprint-theme", nextTheme);
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
