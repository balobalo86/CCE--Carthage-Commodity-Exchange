const MONTH_CODES: Record<string, number> = {
  JAN: 0,
  FEV: 1,
  FEB: 1,
  MAR: 2,
  AVR: 3,
  APR: 3,
  MAI: 4,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AOU: 7,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

/** "SEP26" -> last trading day (5th business day before month end), UTC */
export function maturityToExpiry(code: string): Date {
  const monthCode = code.slice(0, 3).toUpperCase();
  const year = 2000 + parseInt(code.slice(3), 10);
  const month = MONTH_CODES[monthCode] ?? 0;
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
  let d = new Date(lastDayOfMonth);
  let businessDaysBack = 5;
  while (businessDaysBack > 0) {
    d = new Date(d.getTime() - 24 * 3600 * 1000);
    const dow = d.getUTCDay();
    if (dow !== 0 && dow !== 6) businessDaysBack--;
  }
  return d;
}

const MONTH_ABBR = ["JAN", "FEV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOU", "SEP", "OCT", "NOV", "DEC"];

function monthCode(monthIndex0: number, year: number): string {
  const y = year + Math.floor(monthIndex0 / 12);
  const m = ((monthIndex0 % 12) + 12) % 12;
  return `${MONTH_ABBR[m]}${String(y % 100).padStart(2, "0")}`;
}

/**
 * Rolling contract calendar: `count` maturities starting `startOffsetMonths`
 * from now, every `stepMonths` months — e.g. stepMonths=1 gives a full
 * monthly curve, stepMonths=2 gives a bi-monthly curve. Mirrors how real
 * agricultural futures list a rolling window of active months rather than a
 * fixed set, and lets each commodity's contract calendar reflect its own
 * harvest/marketing cycle instead of sharing one schedule.
 */
export function generateMaturities(count: number, stepMonths = 1, startOffsetMonths = 1, from: Date = new Date()): string[] {
  const baseMonth = from.getUTCMonth();
  const baseYear = from.getUTCFullYear();
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(monthCode(baseMonth + startOffsetMonths + i * stepMonths, baseYear));
  }
  return out;
}
