"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { Property } from "@/types/property";

interface CompareContextValue {
  selectedIds: number[];
  isSelected: (id: number) => boolean;
  toggle: (property: Property) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const selectedIds = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("adam-blueprint-compare-change", onStoreChange);
      return () => window.removeEventListener("adam-blueprint-compare-change", onStoreChange);
    },
    () => readIds(),
    () => [],
  );

  const updateIds = (ids: number[]) => {
    window.localStorage.setItem("adam-blueprint-compare", JSON.stringify(ids));
    window.dispatchEvent(new Event("adam-blueprint-compare-change"));
  };

  const value: CompareContextValue = {
    selectedIds,
    isSelected: (id) => selectedIds.includes(id),
    toggle: (property: Property) => {
      const current = readIds();
      if (current.includes(property.id)) {
        updateIds(current.filter((id) => id !== property.id));
      } else if (current.length < 3) {
        updateIds([...current, property.id]);
      }
    },
    clear: () => updateIds([]),
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

function readIds(): number[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("adam-blueprint-compare") || "[]";
  if (raw === cachedRaw) return cachedIds;
  try {
    const parsed = JSON.parse(raw) as unknown;
    cachedRaw = raw;
    cachedIds = Array.isArray(parsed)
      ? [...new Set(parsed.filter((id): id is number => Number.isInteger(id) && id > 0))].slice(0, 3)
      : [];
    return cachedIds;
  } catch {
    cachedRaw = raw;
    cachedIds = [];
    return cachedIds;
  }
}

let cachedRaw = "";
let cachedIds: number[] = [];

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
