// src/lib/fetchers.ts
export type NameValue = { name: string; value: number }

export async function fetchTop10(site: string, start: string, end: string): Promise<{
  meta: { site: string; start: string; end: string },
  charts: { topCVE: NameValue[]; topAssets: NameValue[] }
}> {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8787'
  const url = `${base}/api/top10?site=${encodeURIComponent(site)}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json()
}
