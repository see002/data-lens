"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

import { runQuery } from "@/lib/api/queries";
import type { RunQueryRequest } from "@/lib/api/types";

import { usePlaygroundStore } from "../state/playgroundStore";

export function useRunQuery() {
  const abortRef = useRef<AbortController | null>(null);

  // Note: do not capture request parameters here to avoid stale closures.

  const setRunning = usePlaygroundStore((s) => s.setRunning);
  const setResults = usePlaygroundStore((s) => s.setResults);
  const resetResults = usePlaygroundStore((s) => s.resetResults);
  const setError = usePlaygroundStore((s) => s.setError);
  const setElapsedMs = usePlaygroundStore((s) => s.setElapsedMs);
  const pushHistory = usePlaygroundStore((s) => s.pushHistory);

  const mutation = useMutation({
    mutationFn: async (sqlOverride?: string) => {
      // Read the freshest state at call time to avoid stale request params
      const {
        queryText: currentQueryText,
        page: currentPage,
        pageSize: currentPageSize,
        sort: currentSort,
        filters: currentFilters,
      } = usePlaygroundStore.getState();

      const base =
        typeof sqlOverride === "string" && sqlOverride.trim().length > 0
          ? sqlOverride
          : typeof currentQueryText === "string"
            ? currentQueryText
            : "";
      const sql = base.trim();
      if (!sql) throw new Error("Please enter a SQL query before running.");

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const req: RunQueryRequest = {
        sql,
        page: currentPage,
        pageSize: currentPageSize,
        sort: currentSort ?? undefined,
        filters: currentFilters.length ? currentFilters : undefined,
      };

      // Execute request (no IndexedDB caching)
      return runQuery(req, { signal: abortRef.current.signal });
    },
    onMutate: (_vars?: string) => {
      setError(null);
      setRunning(true);
    },
    onSuccess: (data, sqlOverride) => {
      setResults(data.columns, data.rows, data.totalRowCount);
      setElapsedMs(data.elapsedMs);
      const used =
        (typeof sqlOverride === "string" && sqlOverride.trim()) ||
        (usePlaygroundStore.getState().queryText || "").trim();
      if (used) pushHistory(used);
    },
    onError: (err: unknown) => {
      // Ignore abort errors from rapid re-runs/sorts
      const anyErr = err as { name?: string; message?: string } | undefined;
      const isAbort = anyErr?.name === "AbortError" || /abort/i.test(String(anyErr?.message ?? ""));
      if (isAbort) return;
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    },
    onSettled: () => {
      setRunning(false);
    },
  });

  const cancel = () => {
    abortRef.current?.abort();
    resetResults();
    setRunning(false);
  };

  return {
    run: (sqlOverride?: string) => mutation.mutate(sqlOverride),
    runAsync: (sqlOverride?: string) => mutation.mutateAsync(sqlOverride),
    cancel,
    isPending: mutation.isPending,
  };
}
