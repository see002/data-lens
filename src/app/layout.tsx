import Link from "next/link";

import SkipToContent from "@/components/common/SkipToContent";
import ThemeToggle from "@/components/common/ThemeToggle";
import ThemeProvider from "@/components/providers/ThemeProvider";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Effortlessly Query and Analyze Data | Interactive SQL Playground for Analysts | DataLenz",
  description:
    "Unlock the power of data with our interactive SQL playground. Designed for data analysts, easily run queries, explore large datasets, and gain actionable insights through fast, responsive visualizations and intuitive tools.",
  metadataBase: new URL("https://data-lens.example"),
  openGraph: {
    title:
      "Effortlessly Query and Analyze Data | Interactive SQL Playground for Analysts | DataLenz",
    description:
      "Unlock the power of data with our interactive SQL playground. Designed for data analysts, easily run queries, explore large datasets, and gain actionable insights through fast, responsive visualizations and intuitive tools.",
    type: "website",
  },
  twitter: {
    title:
      "Effortlessly Query and Analyze Data | Interactive SQL Playground for Analysts | DataLenz",
    description:
      "Unlock the power of data with our interactive SQL playground. Designed for data analysts, easily run queries, explore large datasets, and gain actionable insights through fast, responsive visualizations and intuitive tools.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-background flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider>
          <SkipToContent />
          <header className="bg-background sticky top-0 z-40 border-b">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <Link href="/" className="cursor-pointer text-2xl font-semibold tracking-widest">
                DATALENZ
              </Link>
              <nav aria-label="Primary">
                <ul className="flex items-center justify-between gap-4">
                  <li>
                    <Link
                      href="/playground"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Playground
                    </Link>
                  </li>
                  <li>
                    <ThemeToggle />
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
            {children}
          </main>
          <footer className="border-t">
            <div className="text-muted-foreground mx-auto max-w-7xl px-4 py-4 text-sm">
              © {new Date().getFullYear()} DataLenz
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
