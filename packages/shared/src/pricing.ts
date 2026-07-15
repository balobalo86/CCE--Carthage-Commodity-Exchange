import type { OptionType, SpanMarginResult } from "./types";

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

export function normCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

export function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface Black76Result {
  price: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number; // per calendar day
}

/**
 * Black-76: European option on a futures price F. r is the discount rate
 * applied to both legs (futures carry no separate dividend yield).
 */
export function black76(
  optionType: OptionType,
  F: number,
  K: number,
  T: number, // years to expiry
  r: number,
  sigma: number
): Black76Result {
  if (T <= 0 || sigma <= 0 || F <= 0 || K <= 0) {
    const intrinsic = optionType === "call" ? Math.max(F - K, 0) : Math.max(K - F, 0);
    return { price: intrinsic, delta: optionType === "call" ? (F > K ? 1 : 0) : F < K ? -1 : 0, gamma: 0, vega: 0, theta: 0 };
  }
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(F / K) + (sigma * sigma * 0.5) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  const disc = Math.exp(-r * T);
  const nd1 = normPdf(d1);

  if (optionType === "call") {
    const price = disc * (F * normCdf(d1) - K * normCdf(d2));
    const delta = disc * normCdf(d1);
    const gamma = (disc * nd1) / (F * sigma * sqrtT);
    const vega = disc * F * nd1 * sqrtT;
    const thetaAnnual = disc * (-((F * nd1 * sigma) / (2 * sqrtT)) - r * K * normCdf(d2) + r * F * normCdf(d1));
    return { price, delta, gamma, vega, theta: thetaAnnual / 365 };
  }
  const price = disc * (K * normCdf(-d2) - F * normCdf(-d1));
  const delta = -disc * normCdf(-d1);
  const gamma = (disc * nd1) / (F * sigma * sqrtT);
  const vega = disc * F * nd1 * sqrtT;
  const thetaAnnual = disc * (-((F * nd1 * sigma) / (2 * sqrtT)) + r * K * normCdf(-d2) - r * F * normCdf(-d1));
  return { price, delta, gamma, vega, theta: thetaAnnual / 365 };
}

export function futuresInitialMargin(notional: number, marginRate: number) {
  return notional * marginRate;
}

export function futuresVariationMargin(
  qtyLots: number,
  tonnes: number,
  entryPx: number,
  settlePx: number,
  side: "buy" | "sell"
) {
  const d = (settlePx - entryPx) * tonnes * qtyLots;
  return side === "buy" ? d : -d;
}

/** Longer-tenor swaps carry more mark-to-market risk before the next reset, so
 * initial margin scales gently with tenor on top of the underlying's own rate. */
export function swapTenorFactor(tenorMonths: number) {
  return Math.min(2, 1 + (tenorMonths - 1) * 0.08);
}

export function swapInitialMargin(notionalTonnes: number, fixedRate: number, underlyingMarginRate: number, tenorMonths: number) {
  return notionalTonnes * fixedRate * underlyingMarginRate * swapTenorFactor(tenorMonths);
}

export function swapVariationMargin(notionalTonnes: number, fixedRate: number, floatingRate: number, side: "buy" | "sell") {
  // side "buy" = pay-fixed (profits when the floating/market rate rises above the fixed rate)
  const d = (floatingRate - fixedRate) * notionalTonnes;
  return side === "buy" ? d : -d;
}

/**
 * Simplified SPAN-style scanning-risk margin for an options leg: reprices
 * the position across a grid of futures-price and volatility shocks and
 * takes the worst-case loss, mirroring (in miniature) how a real CCP's
 * standard portfolio analysis of risk array works.
 */
export function spanScenarioMargin(
  optionType: OptionType,
  side: "buy" | "sell",
  qtyLots: number,
  tonnes: number,
  F: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  entryPremium: number,
  bandPct = 0.03
): SpanMarginResult {
  const priceShocks = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1].map((m) => m * bandPct);
  const volShifts = [-0.3, 0, 0.3];
  const scenarios: SpanMarginResult["scenarios"] = [];
  let worst = 0;
  let worstIdx = 0;

  priceShocks.forEach((ps) => {
    volShifts.forEach((vs) => {
      const shockedF = Math.max(F * (1 + ps), 0.01);
      const shockedSigma = Math.max(sigma * (1 + vs), 0.02);
      const repriced = black76(optionType, shockedF, K, Math.max(T - 1 / 365, 1e-6), r, shockedSigma).price;
      const premiumDelta = (repriced - entryPremium) * tonnes * qtyLots;
      const pnl = side === "buy" ? premiumDelta : -premiumDelta;
      scenarios.push({ priceShockPct: ps, volShift: vs, pnl });
      if (pnl < worst) {
        worst = pnl;
        worstIdx = scenarios.length - 1;
      }
    });
  });

  return { scanningRisk: Math.abs(worst), worstScenarioIdx: worstIdx, scenarios };
}

export function yearsBetween(fromMs: number, toMs: number) {
  return Math.max(toMs - fromMs, 0) / (365 * 24 * 3600 * 1000);
}
