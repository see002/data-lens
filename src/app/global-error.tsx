"use client";

import Link from "next/link";
import { useEffect } from "react";

import type { ReactNode } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): ReactNode {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen">
        <div role="alert" aria-live="assertive" className="mx-auto max-w-lg px-4 py-16">
          <h1 className="mb-2 text-2xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">
            An unexpected error occurred. You can try again or go back home.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reset}
              className="bg-primary text-primary-foreground cursor-pointer rounded px-3 py-2"
              aria-label="Try again"
            >
              Try again
            </button>
            <Link
              href="/"
              className="hover:bg-accent hover:text-accent-foreground rounded border px-3 py-2"
              aria-label="Go to homepage"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
