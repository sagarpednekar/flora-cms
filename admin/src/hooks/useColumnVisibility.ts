import { useState, useMemo, useCallback, useEffect } from "react";

export type ColumnDef = { id: string; label: string };

function loadStoredIds(storageKey: string, validIds: Set<string>): string[] | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw == null) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const ids = parsed.filter((id): id is string => typeof id === "string" && validIds.has(id));
    return ids.length > 0 ? ids : null;
  } catch {
    return null;
  }
}

export function useColumnVisibility(
  columns: ColumnDef[],
  initialVisibleIds?: string[],
  storageKey?: string
) {
  const defaultIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const columnIdSet = useMemo(() => new Set(columns.map((c) => c.id)), [columns]);

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(() => {
    if (storageKey) {
      const stored = loadStoredIds(storageKey, columnIdSet);
      if (stored) return stored;
    }
    return initialVisibleIds ?? [...defaultIds];
  });

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(visibleColumnIds));
    }
  }, [storageKey, visibleColumnIds]);

  const visibleColumnsOrdered = useMemo(
    () => columns.filter((c) => visibleColumnIds.includes(c.id)),
    [columns, visibleColumnIds]
  );

  const toggleColumn = useCallback((columnId: string) => {
    setVisibleColumnIds((prev) => {
      const next = prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId];
      if (next.length === 0) return prev;
      return next;
    });
  }, []);

  return { visibleColumnIds, visibleColumnsOrdered, toggleColumn };
}
