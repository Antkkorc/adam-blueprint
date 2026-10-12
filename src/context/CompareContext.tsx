"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { Property } from "@/types/property";

export type CompareSelection = {
  kind: "property" | "rental";
  id: string;
};

interface CompareContextValue {
  selectedIds: CompareSelection[];
  isSelected: (selection: CompareSelection) => boolean;
  toggle: (selection: CompareSelection | Property) => void;
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

  const updateIds = (ids: CompareSelection[]) => {
    window.localStorage.setItem("adam-blueprint-compare", JSON.stringify(ids));
    window.dispatchEvent(new Event("adam-blueprint-compare-change"));
  };

  const value: CompareContextValue = {
    selectedIds,
    isSelected: (selection) => selectedIds.some((item) => item.kind === selection.kind && item.id === selection.id),
    toggle: (selection) => {
      const comparable: CompareSelection = "kind" in selection
        ? selection
        : { kind: "property", id: String(selection.id) };
      const current = readIds();
      if (current.some((item) => item.kind === comparable.kind && item.id === comparable.id)) {
        updateIds(current.filter((item) => item.kind !== comparable.kind || item.id !== comparable.id));
      } else if (current.length < 3) {
        updateIds([...current, comparable]);
      }
    },
    clear: () => updateIds([]),
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

function readIds(): CompareSelection[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("adam-blueprint-compare") || "[]";
  if (raw === cachedRaw) return cachedIds;
  try {
    const parsed = JSON.parse(raw) as unknown;
    cachedRaw = raw;
    cachedIds = Array.isArray(parsed)
      ? parsed.map((item): CompareSelection | null => {
        if (typeof item === "number" && Number.isInteger(item) && item > 0) {
          return { kind: "property", id: String(item) };
        }
        if (!item || typeof item !== "object" || !("kind" in item) || !("id" in item)) return null;
        const kind = item.kind === "property" || item.kind === "rental" ? item.kind : null;
        return kind && typeof item.id === "string" && item.id ? { kind, id: item.id } : null;
      }).filter((item): item is CompareSelection => item !== null)
        .filter((item, index, all) => all.findIndex((candidate) => candidate.kind === item.kind && candidate.id === item.id) === index)
        .slice(0, 3)
      : [];
    return cachedIds;
  } catch {
    cachedRaw = raw;
    cachedIds = [];
    return cachedIds;
  }
}

let cachedRaw = "";
let cachedIds: CompareSelection[] = [];

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
