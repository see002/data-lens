"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QueryFilter } from "@/lib/api/types";

import { useRunQuery } from "../hooks/useRunQuery";
import { usePlaygroundStore } from "../state/playgroundStore";

const OPS: Array<{ value: QueryFilter["op"]; label: string }> = [
  { value: "contains", label: "contains" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equal" },
  { value: "gt", label: "greater than" },
  { value: "gte", label: "greater than or equal" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "less than or equal" },
  { value: "startsWith", label: "starts with" },
  { value: "endsWith", label: "ends with" },
];

export default function FiltersBar() {
  const columns = usePlaygroundStore((s) => s.columns);
  const filters = usePlaygroundStore((s) => s.filters);
  const addFilter = usePlaygroundStore((s) => s.addFilter);
  const removeFilterAt = usePlaygroundStore((s) => s.removeFilterAt);
  const clearFilters = usePlaygroundStore((s) => s.clearFilters);
  const setPage = usePlaygroundStore((s) => s.setPage);
  const isRunning = usePlaygroundStore((s) => s.isRunning);

  const { run } = useRunQuery();

  const [col, setCol] = useState<string>("");
  const [op, setOp] = useState<QueryFilter["op"]>("contains");
  const [val, setVal] = useState<string>("");

  const canAdd = useMemo(() => !!col && !!op && val.trim().length > 0, [col, op, val]);

  const onAdd = () => {
    if (!canAdd) return;
    addFilter({ key: col, op, value: val });
    setVal("");
    setPage(1);
    run();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex flex-wrap gap-2">
          <div className="flex-basis-[calc(50%_-_4px)] lg:flex-basis-[160px] w-[calc(50%_-_4px)] flex-shrink-0 flex-grow-0 lg:w-[160px]">
            <Select value={col} onValueChange={setCol} disabled={columns.length === 0 || isRunning}>
              <SelectTrigger aria-label="Filter column" className="w-full">
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((c) => (
                  <SelectItem key={c.key} value={c.key} className="max-w-[200px]">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-basis-[calc(50%_-_2px)] lg:flex-basis-[160px] w-[calc(50%_-_4px)] flex-shrink-0 flex-grow-0 lg:w-[160px]">
            <Select
              value={op}
              onValueChange={(v) => setOp(v as QueryFilter["op"])}
              disabled={!col || isRunning}
            >
              <SelectTrigger aria-label="Operator" className="w-full">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {OPS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="max-w-[200px]">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1">
          <Input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Value"
            aria-label="Filter value"
            disabled={!col || !op || isRunning}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAdd();
            }}
          />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" onClick={onAdd} disabled={!canAdd || isRunning}>
            Add filter
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              clearFilters();
              setPage(1);
              run();
            }}
            disabled={!filters.length || isRunning}
          >
            Clear
          </Button>
        </div>
      </div>
      {filters?.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-live="polite">
          {filters.map((f, i) => (
            <Badge key={`${f.key}-${i}`} variant="secondary" className="flex items-center gap-1">
              <span className="max-w-[200px] truncate">
                {f.key} {f.op} “{f.value}”
              </span>
              <button
                type="button"
                onClick={() => {
                  removeFilterAt(i);
                  setPage(1);
                  run();
                }}
                aria-label={`Remove filter ${f.key} ${f.op} ${f.value}`}
                className="inline-flex"
              >
                <X className="h-3.5 w-3.5 cursor-pointer" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
