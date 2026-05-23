import { getProxyBaseUrl, getProxyTimeoutMs } from "./config";

export class FootballProxyError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "FootballProxyError";
  }
}

export type ProxyParams = Record<string, string | number | boolean | undefined>;

export async function proxyGet<T = unknown>(
  path: string,
  params?: ProxyParams
): Promise<T> {
  const base = getProxyBaseUrl();
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getProxyTimeoutMs());

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new FootballProxyError(
        `Proxy ${res.status}: ${path}`,
        res.status
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof FootballProxyError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new FootballProxyError(`Proxy timeout: ${path}`);
    }
    throw new FootballProxyError(
      err instanceof Error ? err.message : "Proxy request failed"
    );
  } finally {
    clearTimeout(timeout);
  }
}
