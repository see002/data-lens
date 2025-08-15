"use client";

import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, ArrowRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRunQuery } from "../hooks/useRunQuery";
import { usePlaygroundStore } from "../state/playgroundStore";

export default function PaginationControls() {
  const liveRef = useRef<HTMLDivElement | null>(null);
  const page = usePlaygroundStore((s) => s.page);
  const pageSize = usePlaygroundStore((s) => s.pageSize);
  const total = usePlaygroundStore((s) => s.totalRowCount);
  const setPage = usePlaygroundStore((s) => s.setPage);
  const setPageSize = usePlaygroundStore((s) => s.setPageSize);
  const isRunning = usePlaygroundStore((s) => s.isRunning);

  const { run } = useRunQuery();

  const totalPages = useMemo(
    () => (total ? Math.max(1, Math.ceil(total / pageSize)) : 1),
    [total, pageSize],
  );
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const [goto, setGoto] = useState<string>("");

  const announce = (msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  };

  const goTo = (p: number) => {
    const clamped = Math.min(Math.max(1, p || 1), totalPages);
    setPage(clamped);
    run();
    announce(`Page ${clamped} of ${totalPages}`);
  };

  const onGo = () => {
    const n = Number(goto);
    if (!Number.isFinite(n)) return;
    goTo(n);
    setGoto("");
  };

  const isDisabled = !totalPages || totalPages <= 1 || isRunning ? true : false;

  return (
    <nav aria-label="Results pagination" className="flex flex-col items-center gap-2 lg:flex-row">
      <div className="sr-only" aria-live="polite" ref={liveRef} />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(1)}
            disabled={!canPrev || isDisabled}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(page - 1)}
            disabled={!canPrev || isDisabled}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(page + 1)}
            disabled={!canNext || isDisabled}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goTo(totalPages)}
            disabled={!canNext || isDisabled}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-muted-foreground text-sm sm:block">
          Page {page} of {totalPages}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:ml-auto">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm sm:inline">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const size = Number(v);
              setPageSize(size);
              setPage(1);
              run();
              announce(`Rows per page ${size}`);
            }}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-[100px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[50, 100, 250, 500, 1000, 2000].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <label htmlFor="goto" className="sr-only">
            Go to page
          </label>
          <Input
            id="goto"
            min={1}
            max={Math.max(1, totalPages || 1)}
            type="number"
            value={goto}
            onChange={(e) => setGoto(e.target.value)}
            placeholder="Go to"
            inputMode="numeric"
            className="h-10 w-20"
            aria-label="Go to page"
            onKeyDown={(e) => {
              if (e.key === "Enter") onGo();
            }}
            disabled={isDisabled}
          />
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10"
            onClick={onGo}
            disabled={isDisabled || !goto}
            aria-label="Go"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
