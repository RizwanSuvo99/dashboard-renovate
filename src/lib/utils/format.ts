/** Currency formatter (USD by default; pass locale + currency to override). */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

/** Compact number formatter — 1,234 → "1.2K". */
export function formatCompact(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/** Percent formatter — 0.12 → "12%". */
export function formatPercent(value: number, fractionDigits: number = 0): string {
  return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: fractionDigits }).format(value);
}

/** "2 hours ago" relative time, no external dep. */
export function formatRelative(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34524, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];
  let value = -seconds;
  for (const [div, unit] of intervals) {
    if (Math.abs(value) < div) {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(Math.round(value), unit);
    }
    value /= div;
  }
  return d.toDateString();
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join('');
}
