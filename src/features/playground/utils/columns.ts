import type { TableColumn, TableRow } from "@/lib/api/types";

import type { ColumnDef } from "@tanstack/react-table";

export function buildColumnDefs(columns: TableColumn[]): ColumnDef<TableRow>[] {
  return columns.map((col) => ({
    id: col.key,
    accessorKey: col.key,
    header: col.name,
    cell: (info) => {
      const v = info.getValue() as unknown;
      return String(v ?? "");
    },
    enableSorting: true,
  }));
}
