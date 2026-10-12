// Types mirror the backend's camelCase JSON. Money is integer minor units (×100).

export interface Totals {
  incomeMinor: number;
  spendingMinor: number;
  netMinor: number;
  transactionCount: number;
  receiptCount: number;
}

export interface Summary extends Totals {
  month: string;
  baseCurrency: string;
  previous: Totals;
  byCategory: { categoryId: string; spendingMinor: number }[];
  budgetMinor: number | null;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export const getSummary = (month?: string) =>
  getJson<Summary>(month ? `/api/summary?month=${month}` : '/api/summary');
