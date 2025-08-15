import {
  type RunQueryRequest,
  type RunQueryResponse,
  type TableColumn,
  type TableRow,
} from "./types";

const COMPANY_TOTAL = 2_000_000;
const EMPLOYEE_TOTAL = 1_000_000;
const PRODUCT_TOTAL = 1_000_000;

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(id);
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal.aborted) onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

// -----------------------------
// Column schemas per dataset
// -----------------------------

function generateFinancialColumns(): TableColumn[] {
  return [
    { key: "company_id", name: "Company ID", type: "string" },
    { key: "company_name", name: "Company Name", type: "string" },
    { key: "ticker", name: "Ticker", type: "string" },
    { key: "sector", name: "Sector", type: "string" },
    { key: "fiscal_year", name: "Fiscal Year", type: "number" },
    { key: "fiscal_quarter", name: "Fiscal Quarter", type: "string" },
    { key: "report_date", name: "Report Date", type: "date" },
    { key: "revenue", name: "Revenue", type: "number" },
    { key: "cogs", name: "Cost of Goods Sold", type: "number" },
    { key: "gross_profit", name: "Gross Profit", type: "number" },
    { key: "operating_expenses", name: "Operating Expenses", type: "number" },
    { key: "net_income", name: "Net Income", type: "number" },
  ];
}

function generateEmployeeColumns(): TableColumn[] {
  return [
    { key: "employee_id", name: "Employee ID", type: "string" },
    { key: "first_name", name: "First Name", type: "string" },
    { key: "last_name", name: "Last Name", type: "string" },
    { key: "email", name: "Email", type: "string" },
    { key: "phone", name: "Phone", type: "string" },
    { key: "department", name: "Department", type: "string" },
    { key: "title", name: "Title", type: "string" },
    { key: "hire_date", name: "Hire Date", type: "date" },
    { key: "city", name: "City", type: "string" },
    { key: "country", name: "Country", type: "string" },
    { key: "salary", name: "Salary", type: "number" },
    { key: "bonus", name: "Bonus", type: "number" },
  ];
}

function generateProductColumns(): TableColumn[] {
  return [
    { key: "product_id", name: "Product ID", type: "string" },
    { key: "name", name: "Name", type: "string" },
    { key: "category", name: "Category", type: "string" },
    { key: "subcategory", name: "Subcategory", type: "string" },
    { key: "sku", name: "SKU", type: "string" },
    { key: "release_date", name: "Release Date", type: "date" },
    { key: "price", name: "Price", type: "number" },
    { key: "cost", name: "Cost", type: "number" },
    { key: "margin", name: "Margin", type: "number" },
    { key: "units_in_stock", name: "Units In Stock", type: "number" },
    { key: "units_sold", name: "Units Sold", type: "number" },
    { key: "rating", name: "Rating", type: "number" },
  ];
}

// -----------------------------
// Row generators per dataset
// -----------------------------

function generateFinancialRowAt(index: number, columns: TableColumn[]): TableRow {
  const row: TableRow = {};
  // Deterministic pseudo-data for financials
  const companyNum = index % COMPANY_TOTAL;
  const companyPrefix = String(companyNum).padStart(8, "0");
  const companyId = `C${companyPrefix}`;
  const companyName = `Company ${companyNum}`;
  const ticker = `CMP${companyPrefix}`;
  const sectors = [
    "Technology",
    "Healthcare",
    "Finance",
    "Energy",
    "Consumer Goods",
    "Utilities",
    "Industrial",
    "Telecom",
  ];
  const sector = sectors[companyNum % sectors.length] ?? "Unknown";
  const quarter = (index % 4) + 1; // Q1..Q4
  const year = 2010 + (Math.floor(index / 4) % 15); // 2010..2024 cycling
  const reportDate = new Date(Date.UTC(year, quarter * 3 - 1, 1)).toISOString();

  // Revenue between ~100M and ~2.5B depending on company/year/quarter
  const baseRevenue =
    100_000_000 + (companyNum % 1000) * 1_000_000 + (year - 2010) * 5_000_000 + quarter * 750_000;
  const revenue = Math.round(baseRevenue);
  const cogsRatio = 0.45 + (companyNum % 20) * 0.01; // 0.45..0.64
  const cogs = Math.round(revenue * cogsRatio);
  const grossProfit = revenue - cogs;
  const opExRatio = 0.15 + (quarter - 1) * 0.02; // 0.15..0.21
  const operatingExpenses = Math.round(revenue * opExRatio);
  const netIncome = Math.max(0, grossProfit - operatingExpenses);

  for (const col of columns) {
    switch (col.key) {
      case "company_id":
        row[col.key] = companyId;
        break;
      case "company_name":
        row[col.key] = companyName;
        break;
      case "ticker":
        row[col.key] = ticker;
        break;
      case "sector":
        row[col.key] = sector;
        break;
      case "fiscal_year":
        row[col.key] = year;
        break;
      case "fiscal_quarter":
        row[col.key] = `Q${quarter}`;
        break;
      case "report_date":
        row[col.key] = reportDate;
        break;
      case "revenue":
        row[col.key] = revenue;
        break;
      case "cogs":
        row[col.key] = cogs;
        break;
      case "gross_profit":
        row[col.key] = grossProfit;
        break;
      case "operating_expenses":
        row[col.key] = operatingExpenses;
        break;
      case "net_income":
        row[col.key] = netIncome;
        break;
      default:
        row[col.key] = null;
    }
  }
  return row;
}

function generateEmployeeRowAt(index: number, columns: TableColumn[]): TableRow {
  const row: TableRow = {};
  const employeeNum = index % EMPLOYEE_TOTAL;
  const firstNames = ["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Jamie"];
  const lastNames = ["Lee", "Patel", "Garcia", "Smith", "Chen", "Johnson", "Khan", "Davis"];
  const departments = [
    "Engineering",
    "Sales",
    "Marketing",
    "Finance",
    "HR",
    "Operations",
    "Support",
  ];
  const titles = ["Engineer", "Manager", "Analyst", "Director", "Specialist", "Associate"];
  const cities = ["New York", "London", "Bangalore", "Singapore", "Toronto", "Berlin", "Tokyo"];
  const countries = ["USA", "UK", "India", "Singapore", "Canada", "Germany", "Japan"];

  const first = firstNames[employeeNum % firstNames.length] ?? "Alex";
  const last = lastNames[employeeNum % lastNames.length] ?? "Lee";
  const department = departments[employeeNum % departments.length] ?? "Engineering";
  const title = titles[employeeNum % titles.length] ?? "Engineer";
  const city = cities[employeeNum % cities.length] ?? "New York";
  const country = countries[employeeNum % countries.length] ?? "USA";
  const salary = 50_000 + (employeeNum % 200) * 1_500; // 50k..350k
  const bonus = Math.round(salary * (0.05 + (employeeNum % 10) * 0.01));
  const hireYear = 2005 + (employeeNum % 20);
  const hireDate = new Date(
    Date.UTC(hireYear, employeeNum % 12, (employeeNum % 27) + 1),
  ).toISOString();
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${employeeNum % 1000}@example.com`;
  const phone = `+1-555-${String(employeeNum % 1000).padStart(3, "0")}-${String((employeeNum * 7) % 10000).padStart(4, "0")}`;

  for (const col of columns) {
    switch (col.key) {
      case "employee_id":
        row[col.key] = `E${String(employeeNum).padStart(8, "0")}`;
        break;
      case "first_name":
        row[col.key] = first;
        break;
      case "last_name":
        row[col.key] = last;
        break;
      case "email":
        row[col.key] = email;
        break;
      case "phone":
        row[col.key] = phone;
        break;
      case "department":
        row[col.key] = department;
        break;
      case "title":
        row[col.key] = title;
        break;
      case "hire_date":
        row[col.key] = hireDate;
        break;
      case "city":
        row[col.key] = city;
        break;
      case "country":
        row[col.key] = country;
        break;
      case "salary":
        row[col.key] = salary;
        break;
      case "bonus":
        row[col.key] = bonus;
        break;
      default:
        row[col.key] = null;
    }
  }
  return row;
}

function generateProductRowAt(index: number, columns: TableColumn[]): TableRow {
  const row: TableRow = {};
  const productNum = index % PRODUCT_TOTAL;
  const categories = ["Electronics", "Apparel", "Home", "Sports", "Toys"];
  const subcategories = {
    Electronics: ["Phones", "Laptops", "Audio", "Accessories"],
    Apparel: ["Men", "Women", "Kids"],
    Home: ["Kitchen", "Furniture", "Decor"],
    Sports: ["Outdoor", "Fitness", "Team Sports"],
    Toys: ["Educational", "Action Figures", "Puzzles"],
  } as const;
  const category = categories[productNum % categories.length] ?? "Electronics";
  const subcats = (subcategories as any)[category] as string[];
  const subcategory = subcats[productNum % subcats.length] ?? "General";
  const basePrice = 10 + (productNum % 500) * 3.25; // ~$10..$1620
  const cost = Math.round(basePrice * (0.5 + (productNum % 30) * 0.01));
  const price = Math.round(basePrice);
  const margin = price - cost;
  const unitsInStock = (productNum * 13) % 10_000;
  const unitsSold = (productNum * 17) % 200_000;
  const rating = Math.round(((productNum % 50) / 10 + 2.5) * 10) / 10; // 2.5..7.4
  const releaseDate = new Date(
    Date.UTC(2015 + (productNum % 10), productNum % 12, (productNum % 27) + 1),
  ).toISOString();
  const name = `Product ${productNum}`;
  const sku = `SKU-${String(productNum).padStart(8, "0")}`;

  for (const col of columns) {
    switch (col.key) {
      case "product_id":
        row[col.key] = `P${String(productNum).padStart(8, "0")}`;
        break;
      case "name":
        row[col.key] = name;
        break;
      case "category":
        row[col.key] = category;
        break;
      case "subcategory":
        row[col.key] = subcategory;
        break;
      case "sku":
        row[col.key] = sku;
        break;
      case "release_date":
        row[col.key] = releaseDate;
        break;
      case "price":
        row[col.key] = price;
        break;
      case "cost":
        row[col.key] = cost;
        break;
      case "margin":
        row[col.key] = margin;
        break;
      case "units_in_stock":
        row[col.key] = unitsInStock;
        break;
      case "units_sold":
        row[col.key] = unitsSold;
        break;
      case "rating":
        row[col.key] = rating;
        break;
      default:
        row[col.key] = null;
    }
  }
  return row;
}

// -----------------------------
// Query dispatcher
// -----------------------------

type Dataset = "company" | "employees" | "products";

function detectDatasetFromSql(sql: string): Dataset {
  const lowered = sql.toLowerCase();
  if (/\bfrom\s+company_current_financials\b/.test(lowered)) return "company";
  if (/\bfrom\s+employees\b/.test(lowered)) return "employees";
  if (/\bfrom\s+products\b/.test(lowered)) return "products";
  return "company";
}

function applyFilters(
  rows: TableRow[],
  filters: RunQueryRequest["filters"],
  columns: TableColumn[],
): TableRow[] {
  if (!filters || filters.length === 0) return rows;

  const normalizeNumber = (val: unknown): number => {
    const str = String(val).replace(/[,_\s]/g, "");
    return Number(str);
  };

  const parseBool = (val: unknown): boolean => {
    if (typeof val === "boolean") return val;
    const s = String(val).trim().toLowerCase();
    return s === "true" || s === "1" || s === "yes" || s === "y";
  };

  const compareByType = (
    a: unknown,
    b: unknown,
    type: TableColumn["type"] | undefined,
    op: "gt" | "gte" | "lt" | "lte" | "eq" | "neq",
  ): boolean => {
    if (type === "number" || typeof a === "number") {
      const na = normalizeNumber(a);
      const nb = normalizeNumber(b);
      if (Number.isFinite(na) && Number.isFinite(nb)) {
        switch (op) {
          case "gt":
            return na > nb;
          case "gte":
            return na >= nb;
          case "lt":
            return na < nb;
          case "lte":
            return na <= nb;
          case "eq":
            return na === nb;
          case "neq":
            return na !== nb;
        }
      }
    }

    if (type === "date" || (typeof a === "string" && !Number.isNaN(Date.parse(a as string)))) {
      const ta = Date.parse(String(a));
      const tb = Date.parse(String(b));
      if (!Number.isNaN(ta) && !Number.isNaN(tb)) {
        switch (op) {
          case "gt":
            return ta > tb;
          case "gte":
            return ta >= tb;
          case "lt":
            return ta < tb;
          case "lte":
            return ta <= tb;
          case "eq":
            return ta === tb;
          case "neq":
            return ta !== tb;
        }
      }
    }

    if (type === "boolean" || typeof a === "boolean") {
      const ba = parseBool(a);
      const bb = parseBool(b);
      switch (op) {
        case "eq":
          return ba === bb;
        case "neq":
          return ba !== bb;
        case "gt":
          return (ba ? 1 : 0) > (bb ? 1 : 0);
        case "gte":
          return (ba ? 1 : 0) >= (bb ? 1 : 0);
        case "lt":
          return (ba ? 1 : 0) < (bb ? 1 : 0);
        case "lte":
          return (ba ? 1 : 0) <= (bb ? 1 : 0);
      }
    }

    // Fallback to case-insensitive string compare with numeric awareness
    const sa = String(a).trim();
    const sb = String(b).trim();
    if (op === "eq")
      return sa.localeCompare(sb, undefined, { sensitivity: "accent", numeric: true }) === 0;
    if (op === "neq")
      return sa.localeCompare(sb, undefined, { sensitivity: "accent", numeric: true }) !== 0;
    const res = sa.localeCompare(sb, undefined, { sensitivity: "base", numeric: true });
    return op === "gt" || op === "gte" ? res > 0 : res < 0;
  };

  return rows.filter((row) =>
    filters.every(({ key, op, value }) => {
      const columnType = columns.find((c) => c.key === key)?.type;
      const cell = row[key];
      const valueTrimmed = String(value).trim();

      if (cell == null) {
        // Treat null as failing most ops except neq with a non-empty value
        if (op === "neq") return valueTrimmed.length > 0;
        return false;
      }

      const s = String(cell).toLowerCase();
      const v = valueTrimmed.toLowerCase();

      switch (op) {
        case "contains":
          return s.includes(v);
        case "startsWith":
          return s.startsWith(v);
        case "endsWith":
          return s.endsWith(v);
        case "eq":
        case "neq":
        case "gt":
        case "gte":
        case "lt":
        case "lte":
          return compareByType(cell, valueTrimmed, columnType, op);
        default:
          return true;
      }
    }),
  );
}

function applySort(
  rows: TableRow[],
  sort: RunQueryRequest["sort"],
  columns: TableColumn[],
): TableRow[] {
  if (!sort) return rows;
  const { key, desc } = sort;

  const colType = columns.find((c) => c.key === key)?.type;

  const compare = (a: unknown, b: unknown): number => {
    if (a === b) return 0;
    if (a == null) return 1; // nulls last
    if (b == null) return -1;

    switch (colType) {
      case "number": {
        const na = Number(a);
        const nb = Number(b);
        if (Number.isFinite(na) && Number.isFinite(nb)) return na === nb ? 0 : na < nb ? -1 : 1;
        // Fallback to string if not numeric
        break;
      }
      case "date": {
        const ta = Date.parse(String(a));
        const tb = Date.parse(String(b));
        if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta === tb ? 0 : ta < tb ? -1 : 1;
        // Fallback to string if unparsable
        break;
      }
      case "boolean": {
        const ba = typeof a === "boolean" ? a : String(a).toLowerCase() === "true";
        const bb = typeof b === "boolean" ? b : String(b).toLowerCase() === "true";
        return ba === bb ? 0 : ba ? 1 : -1;
      }
      case "string":
      default: {
        const sa = String(a);
        const sb = String(b);
        return sa.localeCompare(sb, undefined, { sensitivity: "base", numeric: true });
      }
    }

    const sa = String(a);
    const sb = String(b);
    return sa.localeCompare(sb, undefined, { sensitivity: "base", numeric: true });
  };

  return rows.slice().sort((a, b) => {
    const res = compare(a[key], b[key]);
    return desc ? -res : res;
  });
}

export async function simulateRunQuery(
  req: RunQueryRequest,
  opts?: { signal?: AbortSignal },
): Promise<RunQueryResponse> {
  const started = performance.now();

  // Simulate latency and minor jitter; error if SQL contains "error"
  const base = 250 + Math.random() * 450;
  await sleep(base, opts?.signal);
  if (/\berror\b/i.test(req.sql)) {
    throw new Error("Simulated query error from mock backend");
  }

  const dataset: Dataset = req.dataset ?? detectDatasetFromSql(req.sql);
  const columns =
    dataset === "company"
      ? generateFinancialColumns()
      : dataset === "employees"
        ? generateEmployeeColumns()
        : generateProductColumns();
  const totalRowCount =
    dataset === "company"
      ? COMPANY_TOTAL
      : dataset === "employees"
        ? EMPLOYEE_TOTAL
        : PRODUCT_TOTAL;

  const page = Math.max(1, req.page ?? 1);
  const pageSize = Math.min(2000, Math.max(1, req.pageSize ?? 100));

  // Filtering-aware pagination and total counting leveraging generator periodicity
  const PERIOD = dataset === "company" ? 15_000 : dataset === "employees" ? 10_000 : 12_000;

  const hasFilters = !!(req.filters && req.filters.length > 0);

  const matchesAtIndex = (i: number): boolean => {
    if (!hasFilters) return true;
    const row =
      dataset === "company"
        ? generateFinancialRowAt(i, columns)
        : dataset === "employees"
          ? generateEmployeeRowAt(i, columns)
          : generateProductRowAt(i, columns);
    return applyFilters([row], req.filters!, columns).length === 1;
  };

  // Count matches within one period
  const countMatchesInRange = (start: number, endExclusive: number): number => {
    let count = 0;
    for (let i = start; i < endExclusive; i++) {
      if (matchesAtIndex(i)) count++;
    }
    return count;
  };

  let filteredTotal = totalRowCount;
  if (hasFilters) {
    const matchesPerPeriod = countMatchesInRange(0, Math.min(PERIOD, totalRowCount));
    if (matchesPerPeriod === 0) {
      // No rows match at all
      const elapsedMs = Math.round(performance.now() - started);
      return { columns, rows: [], page, pageSize, totalRowCount: 0, elapsedMs };
    }
    const fullPeriods = Math.floor(totalRowCount / PERIOD);
    const remainder = totalRowCount % PERIOD;
    filteredTotal = fullPeriods * matchesPerPeriod + countMatchesInRange(0, remainder);
  }

  // Compute starting offset in the filtered sequence
  const offset = (page - 1) * pageSize;
  if (hasFilters) {
    if (offset >= filteredTotal) {
      const elapsedMs = Math.round(performance.now() - started);
      return { columns, rows: [], page, pageSize, totalRowCount: filteredTotal, elapsedMs };
    }
  }

  const collectPageRows = (): TableRow[] => {
    const rows: TableRow[] = [];
    if (!hasFilters) {
      const endIndex = Math.min(offset + pageSize, totalRowCount);
      for (let i = offset; i < endIndex; i++) {
        rows.push(
          dataset === "company"
            ? generateFinancialRowAt(i, columns)
            : dataset === "employees"
              ? generateEmployeeRowAt(i, columns)
              : generateProductRowAt(i, columns),
        );
      }
      return rows;
    }

    // Skip indices up to the offset in filtered space using periods to jump ahead
    const matchesPerPeriod = countMatchesInRange(0, Math.min(PERIOD, totalRowCount));
    let index = 0;
    if (matchesPerPeriod > 0) {
      const fullPeriodsToSkip = Math.min(
        Math.floor(offset / matchesPerPeriod),
        Math.floor(totalRowCount / PERIOD),
      );
      index = fullPeriodsToSkip * PERIOD;
    }

    // Skip remaining matches within the current period
    let skipped =
      matchesPerPeriod > 0
        ? Math.min(offset, Math.floor(offset / matchesPerPeriod) * matchesPerPeriod)
        : 0;
    while (index < totalRowCount && skipped < offset && rows.length < pageSize) {
      if (matchesAtIndex(index)) {
        skipped++;
      }
      index++;
    }

    // Collect up to pageSize matching rows
    while (index < totalRowCount && rows.length < pageSize) {
      if (matchesAtIndex(index)) {
        rows.push(
          dataset === "company"
            ? generateFinancialRowAt(index, columns)
            : dataset === "employees"
              ? generateEmployeeRowAt(index, columns)
              : generateProductRowAt(index, columns),
        );
      }
      index++;
    }
    return rows;
  };

  let rows = collectPageRows();
  rows = applySort(rows, req.sort, columns);

  const elapsedMs = Math.round(performance.now() - started);

  return {
    columns,
    rows,
    page,
    pageSize,
    totalRowCount: hasFilters ? filteredTotal : totalRowCount,
    elapsedMs,
  };
}
