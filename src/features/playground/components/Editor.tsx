"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { usePlaygroundStore } from "../state/playgroundStore";

const Monaco = dynamic(async () => (await import("@monaco-editor/react")).default, {
  ssr: false,
  loading: () => (
    <div className="hover:border-primary/40 h-[320px] w-full rounded border" aria-hidden>
      <Skeleton className="h-full w-full" aria-hidden />
    </div>
  ),
});

export default function Editor() {
  const { resolvedTheme } = useTheme();
  const valueRaw = usePlaygroundStore((s) => s.queryText);
  const setValue = usePlaygroundStore((s) => s.setQueryText);
  const isRunning = usePlaygroundStore((s) => s.isRunning);
  const setGetter = usePlaygroundStore((s) => s.setSelectedTextGetter);

  const [editorReady, setEditorReady] = useState(false);

  const themeName = useMemo(
    () => (resolvedTheme === "dark" ? "vs-dark" : "light"),
    [resolvedTheme],
  );
  const value = typeof valueRaw === "string" ? valueRaw : "";

  return (
    <div className="hover:border-primary/40 relative h-[320px] w-full overflow-hidden rounded border">
      {!editorReady && (
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full" aria-hidden />
        </div>
      )}
      <Monaco
        key={themeName}
        height="100%"
        defaultLanguage="sql"
        theme={themeName}
        value={value}
        onChange={(v) => setValue(typeof v === "string" ? v : "")}
        loading={<Skeleton className="h-full w-full" aria-hidden />}
        onMount={(editor) => {
          const getSel = () => {
            const model = editor.getModel();
            const sel = editor.getSelection();
            if (!model || !sel) return "";
            const text = model.getValueInRange(sel);
            return (text || "").trim();
          };
          setGetter(getSel);
          // Mark editor as ready on next frame to ensure it's painted
          requestAnimationFrame(() => setEditorReady(true));
        }}
        options={{
          readOnly: isRunning,
          fontSize: 14,
          lineNumbers: "on",
          minimap: { enabled: false },
          smoothScrolling: false,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          renderWhitespace: "selection",
          renderLineHighlight: "none",
          scrollbar: {
            // Let wheel events bubble when the editor cannot scroll further,
            // so the page can continue scrolling.
            alwaysConsumeMouseWheel: false,
          },
          padding: {
            top: 20,
            bottom: 10,
          },
          tabIndex: -1,
        }}
        aria-label="SQL editor. Press Control or Command plus Enter to run the query."
        className={editorReady ? "" : "invisible"}
      />
    </div>
  );
}
