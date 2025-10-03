// src/server/queries.ts
export type NameValue = { name: string; value: number };

type Top10Response = {
  meta: { site: string; start: string; end: string };
  charts: { topCVE: NameValue[]; topAssets: NameValue[] };
};

const API_BASE =
  import.meta?.env?.VITE_API_BASE?.trim() ||
  // por defecto a tu API local:
  "http://localhost:8787";

/**
 * Obtiene Top10 de CVE y Activos desde la API.
 * Si NO pasas start/end, el servidor calcula: start = hoy-3m, end = hoy.
 */
export async function fetchTop10(
  site: string,
  start?: string,
  end?: string
): Promise<Top10Response> {
  const params = new URLSearchParams({ site });
  if (start) params.set("start", start);
  if (end) params.set("end", end);

  const url = `${API_BASE}/api/top10?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${url} -> ${res.status} ${res.statusText}: ${text}`);
  }
  const json = (await res.json()) as Top10Response;
  return json;
}
