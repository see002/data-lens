import Editor from "@/features/playground/components/Editor";
import FiltersBar from "@/features/playground/components/FiltersBar";
import HistoryPanel from "@/features/playground/components/HistoryPanel";
import PaginationControls from "@/features/playground/components/PaginationControls";
import ResultsTable from "@/features/playground/components/ResultsTable";
import RunButton from "@/features/playground/components/RunButton";
import TemplatesMenu from "@/features/playground/components/TemplatesMenu";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run SQL Queries Online | Real-Time Editor & Data Visualization Table | DataLenz",
  description:
    "Write, run, and visualize SQL queries instantly with our powerful online editor. Explore, search, filter, and sort large datasets seamlessly. Perfect for data analysts seeking fast, scalable, and interactive data insights.",
};

export default function PlaygroundPage() {
  return (
    <section aria-labelledby="playground-heading" className="w-full space-y-6">
      <div className="flex flex-col justify-between gap-3 lg:flex-row">
        <h1 id="playground-heading" className="text-2xl font-semibold text-balance">
          SQL Playground
        </h1>
        <div className="flex items-center gap-3 lg:justify-end">
          <TemplatesMenu />
          <RunButton />
        </div>
      </div>
      <div className="flex flex-[0_0_75%] flex-col gap-3 lg:flex-row">
        <Editor />
        <aside className="flex-[0_0_25%]" aria-label="Query history">
          <HistoryPanel />
        </aside>
      </div>
      <div className="flex flex-[0_0_100%] flex-col gap-3">
        <FiltersBar />
        <ResultsTable />
        <PaginationControls />
      </div>
    </section>
  );
}
