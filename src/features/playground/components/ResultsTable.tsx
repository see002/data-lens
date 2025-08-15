"use client";

import {
  type ColumnPinningState,
  type ColumnSizingState,
  type VisibilityState,
  getCoreRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, ArrowUpDown, Columns } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "@/styles/table.module.css";

import { useRunQuery } from "../hooks/useRunQuery";
import { usePlaygroundStore } from "../state/playgroundStore";
import { buildColumnDefs } from "../utils/columns";

export default function ResultsTable() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { run } = useRunQuery();

  const columns = usePlaygroundStore((s) => s.columns);
  const rows = usePlaygroundStore((s) => s.rows);
  const isRunning = usePlaygroundStore((s) => s.isRunning);
  const error = usePlaygroundStore((s) => s.error);
  const total = usePlaygroundStore((s) => s.totalRowCount);
  const sort = usePlaygroundStore((s) => s.sort);
  const setSort = usePlaygroundStore((s) => s.setSort);
  const setPage = usePlaygroundStore((s) => s.setPage);
  const elapsedMs = usePlaygroundStore((s) => s.elapsedMs);
  const page = usePlaygroundStore((s) => s.page);
  const pageSize = usePlaygroundStore((s) => s.pageSize);

  // Prepend index column
  const indexCol = useMemo(
    () => [
      {
        id: "#",
        header: "#",
        accessorFn: (_row: unknown, i: number) => (page - 1) * pageSize + i + 1,
        enableSorting: false,
        size: 72,
      },
    ],
    [page, pageSize],
  );
  const dataColumnDefs = useMemo(() => buildColumnDefs(columns), [columns]);
  const showIndexCol = useMemo(() => dataColumnDefs.length > 0, [dataColumnDefs]);
  const columnDefs = useMemo(
    () => (showIndexCol ? [...indexCol, ...dataColumnDefs] : dataColumnDefs),
    [showIndexCol, indexCol, dataColumnDefs],
  );

  const sortingState: SortingState = useMemo(
    () => (sort ? [{ id: sort.key, desc: !!sort.desc }] : []),
    [sort],
  );

  // Table state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const columnPinning: ColumnPinningState = useMemo(
    () => ({ left: showIndexCol ? ["#"] : [], right: [] }),
    [showIndexCol],
  ); // sticky index only when there are data columns

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    state: {
      sorting: sortingState,
      columnVisibility,
      columnSizing,
      columnPinning,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sortingState) : updater;
      const s = next?.[0];
      setPage(1);
      setSort(s ? { key: String(s.id), desc: !!s.desc } : null);
      run();
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    enableColumnResizing: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    defaultColumn: {
      size: 160,
      minSize: 80,
      maxSize: 600,
    },
  });

  const visibleRows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();

  const colWidths = useMemo(() => {
    // Use current sizing state or fallback distribution
    return visibleColumns.map((col) =>
      col.getSize
        ? `${col.getSize()}px`
        : `${Math.floor(100 / Math.max(1, visibleColumns.length))}%`,
    );
  }, [visibleColumns]);

  // Total width of all visible columns to ensure borders span full scrollable width
  const totalWidthPx = useMemo(() => {
    return visibleColumns.reduce((sum, col) => sum + (col.getSize ? col.getSize() : 0), 0);
  }, [visibleColumns]);

  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 40,
    overscan: 20,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (showIndexCol && !isRunning && el) {
      // Focus for keyboard continuity
      el.focus();

      // Smooth scroll to center the results container in the viewport
      try {
        const rect = el.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const containerCenter = rect.top + rect.height / 2;
        const delta = containerCenter - viewportCenter;
        if (Math.abs(delta) > 24) {
          const targetTop = window.scrollY + delta;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
      } catch {}
    }
  }, [isRunning]);

  const hasRows = rows.length > 0;
  const showShimmer = isRunning && !hasRows && !showIndexCol;
  const hasEnabled = !isRunning && hasRows && showIndexCol;

  const statusLabel = useMemo(() => {
    const shown = hasRows ? `${rows.length.toLocaleString()} rows shown` : "No rows";
    const ofTotal = total ? ` of ${total.toLocaleString()}` : "";
    const ms = elapsedMs ? ` in ${elapsedMs} ms` : "";
    return `${shown}${ofTotal}${ms}`;
  }, [hasRows, rows.length, total, elapsedMs]);

  if (error) {
    return (
      <div role="status" aria-live="polite" className="rounded border p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section
      aria-labelledby="results-heading"
      className={`rounded border ${hasEnabled ? "hover:border-primary/40" : ""}`}
    >
      <h2 id="results-heading" className="sr-only">
        Query results
      </h2>

      {/* Toolbar: Columns visibility */}
      <div className="flex items-center justify-between border-b px-2 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Toggle columns" disabled={!hasEnabled}>
              <Columns className="h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table.getAllLeafColumns().map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(Boolean(v))}
                className="max-w-[300px] truncate"
              >
                {String(col.columnDef.header)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
          <div aria-live="polite">{statusLabel}</div>
        </div>
      </div>

      {/* Scroll container that wraps header + body for synced horizontal scroll */}
      <div
        ref={containerRef}
        className={styles.container}
        aria-busy={isRunning}
        tabIndex={hasEnabled ? 0 : -1}
      >
        {/* Header row (sticky inside scroll container) */}
        <div className={styles.stickyHeader} role="rowgroup" aria-rowcount={visibleRows.length}>
          <div
            role="row"
            className={`${styles.row} bg-background`}
            style={{
              gridTemplateColumns: colWidths.join(" "),
              width: "max-content",
              minWidth: `${totalWidthPx}px`,
            }}
          >
            {table.getFlatHeaders().map((header, idx) => {
              const canSort = header.column.getCanSort() && hasEnabled;
              const sorted = header.column.getIsSorted();
              const ariaSort: "ascending" | "descending" | "none" =
                sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none";
              const Icon =
                sorted === "asc"
                  ? ArrowUpNarrowWide
                  : sorted === "desc"
                    ? ArrowDownNarrowWide
                    : ArrowUpDown;
              const isIndex = header.id === "#";
              if (isIndex && !showIndexCol) return null;
              const sortLable =
                sorted === "asc"
                  ? "(sorted ascending)"
                  : sorted === "desc"
                    ? "(sorted descending)"
                    : "(not sorted)";
              return (
                <button
                  key={header.id}
                  role="columnheader"
                  aria-sort={ariaSort}
                  onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  className={`${styles.cell} ${styles.headerCell} hover:bg-accent hover:text-accent-foreground text-left ${canSort ? "cursor-pointer" : ""} ${isIndex ? styles.stickyIndex : ""}`}
                  style={{ gridColumn: `${idx + 1} / span 1` }}
                  title={canSort ? `${header.column.columnDef.header} - ${sortLable}` : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    {header.column.columnDef.header as string}
                    {canSort ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                    <span className="sr-only">{sortLable}</span>
                  </span>
                  {header.column.getCanResize() ? (
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={styles.resizeHandle}
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {showShimmer ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = visibleRows[virtualRow.index];
              if (!row) return null;
              return (
                <div
                  key={virtualRow.key}
                  role="row"
                  className={`${styles.row} ${styles.hoverRow}`}
                  style={{
                    gridTemplateColumns: colWidths.join(" "),
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "max-content",
                    minWidth: `${totalWidthPx}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {visibleColumns.map((col, i) => {
                    const isIndex = String(col.id) === "#";
                    if (!showIndexCol) return null;
                    const cellVal = row.getValue(col.id);
                    return (
                      <div
                        key={col.id}
                        role="cell"
                        className={`${styles.cell} ${isIndex ? styles.stickyIndex : styles.cellHover}`}
                        style={{ gridColumn: `${i + 1} / span 1` }}
                        title={String(cellVal ?? "")}
                      >
                        {String(cellVal ?? "")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
