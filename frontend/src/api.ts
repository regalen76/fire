export interface Stat {
  label: string;
  value: string;
  change: string;
}

export async function getSummary(): Promise<Stat[]> {
  const res = await fetch('/api/summary');
  if (!res.ok) throw new Error(`GET /api/summary failed: ${res.status}`);
  return res.json();
}
