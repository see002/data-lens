export class HttpError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

type JsonInit = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  body?: unknown;
  signal?: AbortSignal;
  cache?: RequestCache;
};

export async function jsonRequest<T>(url: string, init: JsonInit = {}): Promise<T> {
  const { body, headers, ...rest } = init;

  const h = new Headers(headers);
  h.set("Accept", "application/json");
  if (body !== undefined) h.set("Content-Type", "application/json");

  const res = await fetch(url, {
    ...rest,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") ?? "";
  let data: unknown = undefined;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = undefined;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = undefined;
    }
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "message" in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).message)
        : `HTTP ${res.status}`;
    throw new HttpError(message, res.status, data);
  }

  return data as T;
}

export function postJson<T>(
  url: string,
  body: unknown,
  init?: Omit<JsonInit, "method" | "body">,
): Promise<T> {
  return jsonRequest<T>(url, { ...init, method: "POST", body });
}
