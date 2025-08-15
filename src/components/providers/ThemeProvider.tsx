"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

import type { ReactNode } from "react";

export default function ThemeProvider({
  children,
  ...props
}: { children: ReactNode } & ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="dl-theme"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
