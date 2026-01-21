import { BASE_URL } from "./endpoints";
import { logRequest, logResponse, logError } from "./logger";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  constructor(public status: number, public message: string, public url: string) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown; // GET/POST/PUT/PATCH
  headers?: Record<string, string>;
  timeoutMs?: number; // 15s
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const method: HttpMethod = options.method ?? "GET";

  const requestId = Math.random().toString(16).slice(2);
  const startTime = Date.now();
  logRequest({ id: requestId, method, url });

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const finalHeaders: Record<string, string> = {
    ...(options.headers ?? {}),
  };

  let finalBody: any = undefined;

  if (options.body !== undefined && options.body !== null) {
    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    if (isFormData) {
      finalBody = options.body;
    } else if (typeof options.body === "string") {
      finalBody = options.body;
    } else {
      finalBody = JSON.stringify(options.body);
      if (!finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "application/json";
      }
    }
  }

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      headers: finalHeaders,
      body: finalBody,
    });

    clearTimeout(timeoutId);

    const durationMs = Date.now() - startTime;
    const responseText = await response.text();

    logResponse({
      id: requestId,
      method,
      url,
      status: response.status,
      durationMs,
      bodySnippet: responseText,
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Request failed with status ${response.status}`,
        url
      );
    }

    try {
      // JSON bekliyoruz (mevcut yapın böyle)
      const data = JSON.parse(responseText) as T;
      return data;
    } catch {
      throw new ApiError(0, "Failed to parse JSON response", url);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    if (error instanceof Error && error.name === "AbortError") {
      const timeoutError = new ApiError(
        408,
        `Request timeout after ${Math.round(timeoutMs / 1000)} seconds`,
        url
      );
      logError({
        id: requestId,
        method,
        url,
        durationMs,
        error: timeoutError.message,
      });
      throw timeoutError;
    }

    if (error instanceof ApiError) {
      logError({
        id: requestId,
        method,
        url,
        durationMs,
        error: `${error.status} - ${error.message}`,
      });
      throw error;
    }

    const genericError = new ApiError(
      0,
      error instanceof Error ? error.message : "Unknown error occurred",
      url
    );
    logError({
      id: requestId,
      method,
      url,
      durationMs,
      error: genericError.message,
    });
    throw genericError;
  }
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(path, { method: "POST", body, headers });
}

export function put<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(path, { method: "PUT", body, headers });
}

export function patch<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(path, { method: "PATCH", body, headers });
}

export function del<T>(path: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(path, { method: "DELETE", headers });
}
