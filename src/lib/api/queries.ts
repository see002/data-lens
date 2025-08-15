import { postJson } from "./client";

import type { RunQueryRequest, RunQueryResponse } from "./types";

export async function runQuery(
  req: RunQueryRequest,
  opts?: { signal?: AbortSignal },
): Promise<RunQueryResponse> {
  return postJson<RunQueryResponse>("/api/query", req, { signal: opts?.signal });
}
