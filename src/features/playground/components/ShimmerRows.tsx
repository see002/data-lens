"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ShimmerRows({ columns, rows = 12 }: { columns: number; rows?: number }) {
  return (
    <div className="p-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="mb-2 grid grid-cols-12 gap-2 last:mb-0">
          {Array.from({ length: columns || 6 }).map((__, c) => (
            <Skeleton key={c} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
