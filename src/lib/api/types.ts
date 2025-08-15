export type ColumnType = "string" | "number" | "boolean" | "date";

export interface TableColumn {
  key: string;
  name: string;
  type: ColumnType;
  // Optional presentation hint from backend
  isAmount?: boolean;
}

export type TableRow = Record<string, string | number | boolean | null>;

export type FilterOp =
  | "contains"
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "startsWith"
  | "endsWith";

export interface QuerySort {
  key: string;
  desc?: boolean;
}

export interface QueryFilter {
  key: string;
  op: FilterOp;
  value: string;
}

export interface RunQueryRequest {
  sql: string;
  page?: number;
  pageSize?: number;
  sort?: QuerySort | null;
  filters?: QueryFilter[];
  // optional dataset hint parsed from SQL by mock
  dataset?: "company" | "employees" | "products";
}

export interface RunQueryResponse {
  columns: TableColumn[];
  rows: TableRow[];
  page: number;
  pageSize: number;
  totalRowCount: number;
  elapsedMs: number;
}
