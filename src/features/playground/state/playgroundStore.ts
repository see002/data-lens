"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { TableColumn, TableRow, QuerySort, QueryFilter } from "@/lib/api/types";
import { QUERY_TEMPLATES } from "@/lib/constants";

export interface PlaygroundSettings {
  debounceMs: number;
  defaultPageSize: number;
}
export interface QueryHistoryItem {
  sql: string;
  ts: number;
}

interface PlaygroundState {
  queryText: string;
  isRunning: boolean;

  page: number;
  pageSize: number;
  totalRowCount: number;
  elapsedMs: number;

  columns: TableColumn[];
  rows: TableRow[];
  sort: QuerySort | null;
  filters: QueryFilter[];
  error: string | null;

  settings: PlaygroundSettings;
  history: QueryHistoryItem[];

  getSelectedText?: () => string;
  setSelectedTextGetter: (fn: () => string) => void;

  setQueryText: (text: string) => void;
  setRunning: (running: boolean) => void;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  setSort: (sort: QuerySort | null) => void;
  setFilters: (filters: QueryFilter[]) => void;
  addFilter: (filter: QueryFilter) => void;
  removeFilterAt: (index: number) => void;
  clearFilters: () => void;

  setResults: (cols: TableColumn[], rows: TableRow[], total: number) => void;

  setElapsedMs: (ms: number) => void;
  setError: (msg: string | null) => void;
  resetResults: () => void;
  clearRows: () => void;

  pushHistory: (sql: string) => void;
  clearHistory: () => void;
}

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set, get) => ({
      queryText: QUERY_TEMPLATES[0]?.sql || "",
      isRunning: false,

      page: 1,
      pageSize: 100,
      totalRowCount: 0,
      elapsedMs: 0,

      columns: [],
      rows: [],
      sort: null,
      filters: [],
      error: null,

      settings: { debounceMs: 250, defaultPageSize: 100 },
      history: [],

      getSelectedText: undefined,
      setSelectedTextGetter: (fn) => set({ getSelectedText: fn }),

      setQueryText: (text) => set({ queryText: text }),
      setRunning: (running) => set({ isRunning: running }),

      setPage: (page) => set({ page: Math.max(1, page) }),
      setPageSize: (size) => set({ pageSize: Math.max(1, size) }),

      setSort: (sort) => set({ sort }),
      setFilters: (filters) => set({ filters }),
      addFilter: (filter) => {
        const existing = get().filters.filter((f) => f.key !== filter.key);
        set({ filters: [...existing, filter] });
      },
      removeFilterAt: (index) => set({ filters: get().filters.filter((_, i) => i !== index) }),
      clearFilters: () => set({ filters: [] }),

      setResults: (cols, rows, total) => set({ columns: cols, rows, totalRowCount: total }),

      setElapsedMs: (ms) => set({ elapsedMs: ms }),
      setError: (msg) => set({ error: msg }),
      resetResults: () =>
        set({ columns: [], rows: [], sort: null, filters: [], totalRowCount: 0, page: 1 }),
      clearRows: () =>
        set({
          columns: [],
          rows: [],
          sort: null,
          filters: [],
          error: null,
          totalRowCount: 0,
          page: 1,
          elapsedMs: 0,
        }),

      pushHistory: (sql) =>
        set((state) => {
          const trimmed = sql.trim();
          if (!trimmed) return state;
          const last = state.history[0]?.sql ?? "";
          if (last === trimmed) return state;
          const next = [{ sql: trimmed, ts: Date.now() }, ...state.history].slice(0, 10);
          return { history: next };
        }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "playground-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        queryText: s.queryText,
        pageSize: s.pageSize,
        settings: s.settings,
        history: s.history,
      }),
      version: 1,
      migrate: (state: any) => {
        if (state && typeof state.queryText !== "string") state.queryText = "";
        return state;
      },
    },
  ),
);
