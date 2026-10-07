"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Property } from "@/types/property";

interface CompareContextValue {
  selectedIds: number[];
  isSelected: (id: number) => boolean;
  toggle: (property: Property) => void;
  clear: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = window.localStorage.getItem("adam-blueprint-compare");
    if (!stored) return [];
    try {
      const ids = JSON.parse(stored) as number[];
      if (Array.isArray(ids)) return ids.slice(0, 3).map((id) => ({ id } as Property));
    } catch {
      window.localStorage.removeItem("adam-blueprint-compare");
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem("adam-blueprint-compare", JSON.stringify(properties.map((property) => property.id)));
  }, [properties]);

  const value = useMemo<CompareContextValue>(() => ({
    selectedIds: properties.map((property) => property.id),
    isSelected: (id) => properties.some((property) => property.id === id),
    toggle: (property) => setProperties((current) => {
      if (current.some((item) => item.id === property.id)) {
        return current.filter((item) => item.id !== property.id);
      }
      if (current.length >= 3) return current;
      return [...current, property];
    }),
    clear: () => setProperties([]),
  }), [properties]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
