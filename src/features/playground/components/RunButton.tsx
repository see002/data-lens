"use client";

import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useRunQuery } from "../hooks/useRunQuery";
import { usePlaygroundStore } from "../state/playgroundStore";

export default function RunButton() {
  const { run, cancel } = useRunQuery();
  const isRunning = usePlaygroundStore((s) => s.isRunning);
  const getSelectedText = usePlaygroundStore((s) => s.getSelectedText);
  const clearRows = usePlaygroundStore((s) => s.clearRows);

  const triggerRun = () => {
    const sel = getSelectedText?.() || "";
    // Clear rows for primary Run action to avoid showing stale results
    clearRows();
    run(sel || undefined);
  };

  useKeyboardShortcuts(() => {
    if (!isRunning) triggerRun();
  });

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="default"
        onClick={triggerRun}
        disabled={isRunning}
        aria-busy={isRunning}
        aria-label="Run query (Ctrl or Cmd + Enter)"
      >
        <Play className="h-4 w-4" />
        {isRunning ? "Running…" : "Run (Ctrl/Cmd+Enter)"}
      </Button>
      {isRunning ? (
        <Button type="button" variant="secondary" onClick={cancel}>
          Cancel
        </Button>
      ) : null}
    </div>
  );
}
