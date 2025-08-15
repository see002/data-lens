import { NextResponse, type NextRequest } from "next/server";

import { simulateRunQuery } from "@/lib/api/mock";
import type { RunQueryRequest } from "@/lib/api/types";

export const dynamic = "force-dynamic";
export const revalidate = 0; // no-cache for dynamic query endpoint

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RunQueryRequest;
    if (!body?.sql || typeof body.sql !== "string") {
      return NextResponse.json({ message: "Invalid payload: sql is required" }, { status: 400 });
    }
    const data = await simulateRunQuery(body, { signal: req.signal });
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
