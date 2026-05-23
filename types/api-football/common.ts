export interface ApiFootballEnvelope<T> {
  get?: string;
  parameters?: Record<string, string>;
  errors?: string[] | Record<string, string>;
  results?: number;
  response?: T;
}

export function unwrapResponse<T>(data: unknown): T {
  if (data && typeof data === "object" && "response" in data) {
    const envelope = data as ApiFootballEnvelope<T>;
    return (envelope.response ?? []) as T;
  }
  return data as T;
}

export function hasApiErrors(data: ApiFootballEnvelope<unknown>): boolean {
  if (!data.errors) return false;
  if (Array.isArray(data.errors)) return data.errors.length > 0;
  return Object.keys(data.errors).length > 0;
}
