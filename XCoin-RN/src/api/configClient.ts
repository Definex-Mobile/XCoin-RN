import { ApiError, request, type RequestOptions } from "./client";
import { CONFIG_API_BASE_URL, CONFIG_API_KEY } from "./endpoints";

export type ConfigEnvelope<
  TData,
  TMeta = Record<string, unknown>,
  TErr = string | null
> = {
  success: boolean;
  data: TData | null;
  meta?: TMeta;
  error?: TErr;
};

type ConfigGetOptions = Pick<RequestOptions, "headers" | "timeoutMs">;

const DEFAULT_CONFIG_HEADERS: Record<string, string> = {
  "X-API-Key": CONFIG_API_KEY,
};

function buildConfigUrl(path: string): string {
  return `${CONFIG_API_BASE_URL}${path}`;
}

function getBusinessErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  return undefined;
}

export async function configGetEnvelope<
  TData,
  TMeta = Record<string, unknown>,
  TErr = string | null
>(path: string, options: ConfigGetOptions = {}): Promise<ConfigEnvelope<TData, TMeta, TErr>> {
  return request<ConfigEnvelope<TData, TMeta, TErr>>(path, {
    method: "GET",
    baseUrl: CONFIG_API_BASE_URL,
    timeoutMs: options.timeoutMs,
    headers: {
      ...DEFAULT_CONFIG_HEADERS,
      ...(options.headers ?? {}),
    },
  });
}

export async function configGetData<
  TData,
  TMeta = Record<string, unknown>,
  TErr = string | null
>(path: string, options: ConfigGetOptions = {}): Promise<TData> {
  const envelope = await configGetEnvelope<TData, TMeta, TErr>(path, options);

  if (!envelope.success || envelope.data == null) {
    const businessError = getBusinessErrorMessage(envelope.error);
    const message = businessError
      ? `Config API business failure: ${businessError}`
      : "Config API business failure: success=false or data is null";

    throw new ApiError(422, message, buildConfigUrl(path));
  }

  return envelope.data;
}
