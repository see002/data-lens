"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { usePlaygroundStore } from "../state/playgroundStore";

export default function HistoryPanel() {
  const history = usePlaygroundStore((s) => s.history);
  const setQueryText = usePlaygroundStore((s) => s.setQueryText);
  const clearHistory = usePlaygroundStore((s) => s.clearHistory);
  const isRunning = usePlaygroundStore((s) => s.isRunning);

  // Avoid flashing "No history yet" before persisted state hydrates
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="hover:border-primary/40 max-h-[320px] min-h-[320px] space-y-2 overflow-auto rounded border p-3 pt-0">
      <div className="bg-background sticky top-0 z-10 flex items-center justify-between pt-2">
        <h2 className="text-sm font-medium">History</h2>
        <Button variant="ghost" size="sm" onClick={clearHistory} disabled={!history.length}>
          Clear
        </Button>
      </div>
      <ul className="space-y-2">
        {!mounted ? (
          Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded border p-2">
              <Skeleton className="h-4 w-5/6" />
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-6 w-16" />
              </div>
            </li>
          ))
        ) : history.length === 0 ? (
          <li className="text-muted-foreground text-sm">No history yet</li>
        ) : (
          history.map((h, i) => (
            <li
              key={i}
              className="hover:border-primary/40 flex items-center justify-between gap-2 rounded border p-2"
            >
              <div className="text-muted-foreground mb-2 line-clamp-2 text-xs break-words">
                {h.sql}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setQueryText(h.sql)}
                  disabled={isRunning}
                  aria-label="Load query into editor"
                >
                  Load
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
