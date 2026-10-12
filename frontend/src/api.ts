// Typed helpers for every backend route. Types mirror the backend's camelCase
// JSON. Money is integer minor units (×100); requests send decimal strings.

export type Direction = 'in' | 'out' | 'internal';
export type CategoryKind = 'expense' | 'income' | 'internal';
export type ReceiptStatus = 'processing' | 'done' | 'failed' | 'rejected' | 'duplicate';

export interface Category {
  id: string;
  label: string;
  icon: string;
  kind: CategoryKind;
}

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

export interface Cashflow {
  year: number;
  baseCurrency: string;
  months: { month: string; incomeMinor: number; spendingMinor: number }[];
}

export interface Transaction {
  id: number;
  receiptId: number | null;
  categoryId: string;
  direction: Direction;
  merchant: string;
  /** Owner's local time, "YYYY-MM-DDTHH:MM:SS" with no offset. */
  occurredAt: string;
  amountMinor: number;
  currency: string;
  amountBaseMinor: number;
  fxRate: number;
  paymentMethod: string | null;
  source: 'receipt' | 'manual';
  note: string | null;
  createdAt: string;
}

export interface TransactionItem {
  name: string;
  quantity: number | null;
  amountMinor: number | null;
}

export interface TransactionDetail extends Transaction {
  items: TransactionItem[];
}

export interface TransactionPage {
  items: Transaction[];
  total: number;
}

export interface Receipt {
  id: number;
  status: ReceiptStatus;
  error: string | null;
  createdAt: string;
  processedAt: string | null;
  duplicateOf: number | null;
  llmModel: string | null;
  transaction: Pick<
    Transaction,
    'id' | 'merchant' | 'direction' | 'categoryId' | 'occurredAt' | 'amountMinor' | 'currency' | 'amountBaseMinor'
  > | null;
}

export interface Budget {
  amountMinor: number | null;
  currency: string;
}

export interface NewTransaction {
  direction: Direction;
  merchant: string;
  /** Positive decimal string, e.g. "5000000" or "12.80". */
  amount: string;
  currency?: string;
  categoryId: string;
  /** Local time "YYYY-MM-DDTHH:MM"; defaults to now on the server. */
  occurredAt?: string;
  paymentMethod?: string;
  note?: string;
}

export interface TransactionPatch {
  categoryId?: string;
  direction?: Direction;
  merchant?: string;
  occurredAt?: string;
  /** Empty string clears it. */
  note?: string;
}

export interface TransactionQuery {
  direction?: Direction;
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `${method} ${path} failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.error === 'string') message = data.error;
    } catch {
      // Not JSON (e.g. the backend is down and the dev proxy answered).
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

function query(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const getCategories = () => request<Category[]>('GET', '/api/categories');

export const getSummary = (month?: string) => request<Summary>('GET', `/api/summary${query({ month })}`);

export const getCashflow = (year?: number) => request<Cashflow>('GET', `/api/cashflow${query({ year })}`);

export const getTransactions = (q: TransactionQuery = {}) =>
  request<TransactionPage>('GET', `/api/transactions${query({ ...q })}`);

export const getTransaction = (id: number) => request<TransactionDetail>('GET', `/api/transactions/${id}`);

export const createTransaction = (t: NewTransaction) =>
  request<TransactionDetail>('POST', '/api/transactions', t);

export const patchTransaction = (id: number, patch: TransactionPatch) =>
  request<TransactionDetail>('PATCH', `/api/transactions/${id}`, patch);

export const deleteTransaction = (id: number) => request<void>('DELETE', `/api/transactions/${id}`);

export const getReceipts = (q: { status?: ReceiptStatus; limit?: number; offset?: number } = {}) =>
  request<Receipt[]>('GET', `/api/receipts${query(q)}`);

export const receiptImageUrl = (id: number) => `/api/receipts/${id}/image`;

export const retryReceipt = (id: number) => request<{ id: number; status: ReceiptStatus }>('POST', `/api/receipts/${id}/retry`);

export const deleteReceipt = (id: number) => request<void>('DELETE', `/api/receipts/${id}`);

export const getBudget = () => request<Budget>('GET', '/api/settings/budget');

/** `null` clears the budget. */
export const putBudget = (amount: string | null) => request<Budget>('PUT', '/api/settings/budget', { amount });
