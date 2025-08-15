"use client";

import { useEffect } from "react";

export function useKeyboardShortcuts(onRun: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.userAgent);
      const runCombo = (isMac && e.metaKey) || (!isMac && e.ctrlKey);
      if (runCombo && e.key.toLowerCase() === "enter") {
        e.preventDefault();
        onRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onRun]);
}
