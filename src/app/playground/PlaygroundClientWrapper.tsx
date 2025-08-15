"use client";

import QueryProvider from "@/components/providers/QueryProvider";

export default function PlaygroundClientWrapper({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
