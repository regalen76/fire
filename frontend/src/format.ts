// All money and date formatting lives here. Money arrives as integer minor
// units (×100 for every currency).

import type { Direction } from './api';

/** "Rp 25.000" (IDR, no decimals) or "$12.80". Negative values get a leading "-". */
export function money(minor: number, currency: string, opts: { signed?: boolean } = {}): string {
  const major = Math.abs(minor) / 100;
  const sign = opts.signed ? (minor < 0 ? '-' : '+') : minor < 0 ? '-' : '';
  if (currency === 'IDR') {
    return `${sign}Rp ${major.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  }
  try {
    return sign + major.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 2 });
  } catch {
    // Unknown ISO code: fall back to "12.80 XYZ".
    return `${sign}${major.toFixed(2)} ${currency}`;
  }
}

/**
 * A transaction amount as the copy rules want it: "+Rp 25.000" for income,
 * "-Rp 25.000" for spending, unsigned for internal moves.
 */
export function signedMoney(minor: number, currency: string, direction: Direction): string {
  if (direction === 'internal') return money(Math.abs(minor), currency);
  return money(minor, currency, { signed: true });
}

/** CSS colour for an amount: green income, muted spending and internal moves. */
export function amountColor(direction: Direction): string {
  return direction === 'in' ? 'var(--income)' : 'var(--text-secondary)';
}

/** Short money for chart edges and tight spots: "Rp 5M", "Rp 750K", "$1.2K". */
export function compactMoney(minor: number, currency: string): string {
  const major = Math.abs(minor) / 100;
  const sign = minor < 0 ? '-' : '';
  const units: [number, string][] = [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
  ];
  const [div, suffix] = units.find(([d]) => major >= d) ?? [1, ''];
  const n = (major / div).toLocaleString('en-US', { maximumFractionDigits: major / div < 10 ? 1 : 0 });
  const symbol = currency === 'IDR' ? 'Rp ' : currency === 'USD' ? '$' : `${currency} `;
  return `${sign}${symbol}${n}${suffix}`;
}

/**
 * Scales base-currency values for a chart axis so tick labels stay short.
 * Returns the divisor, a unit label ("Rp M") and a nice axis max (a multiple of 5 steps).
 */
export function chartScale(maxMinor: number, currency: string) {
  const major = maxMinor / 100;
  const units: [number, string][] = [
    [1e9, 'B'],
    [1e6, 'M'],
    [1e3, 'K'],
    [1, ''],
  ];
  // The largest unit that still leaves at least 5 on the axis, so labels aren't all 0 and 1.
  const [div, suffix] = units.find(([d]) => major / d >= 5) ?? [1, ''];
  const scaled = major / div;
  const step = niceStep(Math.max(scaled, 1) / 5);
  const symbol = currency === 'IDR' ? 'Rp' : currency === 'USD' ? '$' : currency;
  return {
    /** Divide minor units by this to get chart values. */
    divisor: div * 100,
    unit: suffix ? `${symbol} ${suffix}` : symbol,
    max: step * 5,
  };
}

function niceStep(raw: number): number {
  const pow = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) {
    if (m * pow >= raw) return m * pow;
  }
  return 10 * pow;
}

/** "+12%" / "-5%" change versus a previous value; undefined when there is no baseline. */
export function change(current: number, previous: number): string | undefined {
  if (previous === 0) return undefined;
  const pct = Math.round(((current - previous) / Math.abs(previous)) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}%`;
}

/** "+3" / "-1" difference in a count; undefined when both are 0. */
export function countChange(current: number, previous: number): string | undefined {
  if (current === 0 && previous === 0) return undefined;
  const d = current - previous;
  return `${d >= 0 ? '+' : ''}${d}`;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Parses the backend's local timestamps. "YYYY-MM-DDTHH:MM[:SS]" (no offset) is the
 * owner's wall-clock time and is kept as is; RFC 3339 with an offset is converted
 * to the browser's time.
 */
export function parseTime(s: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(s);
  if (m) {
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  }
  return new Date(s);
}

function time12(d: Date): string {
  const h = d.getHours() % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
}

/** "9 October 2026" */
export function longDate(s: string): string {
  const d = parseTime(s);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "9 October 2026, at 4:36 PM" */
export function longDateTime(s: string): string {
  return `${longDate(s)}, at ${time12(parseTime(s))}`;
}

/** "October 2026" from "2026-10" */
export function monthName(yyyyMm: string, opts: { year?: boolean } = { year: true }): string {
  const [y, m] = yyyyMm.split('-').map(Number);
  return opts.year === false ? MONTHS[m - 1] : `${MONTHS[m - 1]} ${y}`;
}

/** "Jan" … "Dec" from "2026-01" */
export function shortMonth(yyyyMm: string): string {
  return MONTHS[Number(yyyyMm.slice(5, 7)) - 1].slice(0, 3);
}

/** Value for <input type="datetime-local">: "YYYY-MM-DDTHH:MM" in the browser's time. */
export function localInputNow(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
