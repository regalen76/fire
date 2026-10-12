/** Formats minor units: IDR as "Rp 25.000" (no decimals), others like "$12.80". */
export function money(minor: number, currency: string, opts: { signed?: boolean } = {}): string {
  const major = Math.abs(minor) / 100;
  const sign = opts.signed ? (minor < 0 ? '-' : '+') : minor < 0 ? '-' : '';
  if (currency === 'IDR') {
    return `${sign}Rp ${major.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
  }
  const s = major.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 2 });
  return sign + s;
}

/** "+12%" / "-5%" change versus a previous value; undefined when there is no baseline. */
export function change(current: number, previous: number): string | undefined {
  if (previous === 0) return undefined;
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? '+' : ''}${pct}%`;
}
