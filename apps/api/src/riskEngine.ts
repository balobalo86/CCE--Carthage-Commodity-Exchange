import type { Account, RiskCheckResult, Side } from "@cce/shared";

const MAX_ORDER_QTY = 50;

export function checkAck(account: Account): RiskCheckResult {
  if (!account.ackOnFile) {
    return { ok: false, reasonCode: "NO_ACK", message: "Risk acknowledgement not on file for this account." };
  }
  return { ok: true };
}

export function checkFatFinger(qty: number): RiskCheckResult {
  if (qty <= 0 || qty > MAX_ORDER_QTY) {
    return { ok: false, reasonCode: "FAT_FINGER", message: `Order size must be between 1 and ${MAX_ORDER_QTY} contracts.` };
  }
  return { ok: true };
}

export function checkBand(limitPx: number | undefined, lo: number, hi: number): RiskCheckResult {
  if (limitPx == null) return { ok: true };
  if (limitPx < lo || limitPx > hi) {
    return { ok: false, reasonCode: "OUT_OF_BAND", message: `Price ${limitPx} outside daily band [${lo}, ${hi}].` };
  }
  return { ok: true };
}

/** Net position projection: how many lots this account would hold net, and in the front month, after the order. */
export function checkPositionLimit(
  currentNet: number,
  currentFront: number,
  isFrontMonth: boolean,
  side: Side,
  qty: number,
  netLimit: number,
  frontLimit: number
): RiskCheckResult {
  const delta = side === "buy" ? qty : -qty;
  const projectedNet = Math.abs(currentNet + delta);
  const projectedFront = isFrontMonth ? Math.abs(currentFront + delta) : currentFront;
  if (projectedNet > netLimit || projectedFront > frontLimit) {
    return { ok: false, reasonCode: "POSITION_LIMIT", message: "Order would exceed the exchange position limit." };
  }
  return { ok: true };
}

export function checkMarginAvailable(availableCash: number, requiredMargin: number): RiskCheckResult {
  if (requiredMargin > availableCash) {
    return { ok: false, reasonCode: "INSUFFICIENT_MARGIN", message: "Insufficient collateral for this order's margin requirement." };
  }
  return { ok: true };
}
