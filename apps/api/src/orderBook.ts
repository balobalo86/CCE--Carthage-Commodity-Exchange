import type { BookLevel, Side } from "@cce/shared";

interface Level {
  px: number;
  qty: number;
  ts: number;
}

export interface Fill {
  px: number;
  qty: number;
}

export interface MatchResult {
  avgPx: number;
  fills: Fill[];
}

const TARGET_DEPTH = 20;

/**
 * Price-time priority limit order book for one (contract, maturity).
 * Resting liquidity is synthetic (reseeded around the last trade price on
 * every tick) but incoming client orders walk it exactly like a real book:
 * best price first, oldest first at a given price.
 */
export class OrderBook {
  bids: Level[] = [];
  asks: Level[] = [];

  constructor(private tick: number) {}

  reseedAround(last: number) {
    this.bids = [];
    this.asks = [];
    this.topUp("buy", last);
    this.topUp("sell", last);
  }

  private topUp(side: Side, refPx: number) {
    const book = side === "buy" ? this.bids : this.asks;
    let base = book.length > 0 ? book[book.length - 1].px : refPx;
    while (book.length < TARGET_DEPTH) {
      base = side === "buy" ? base - this.tick : base + this.tick;
      book.push({ px: +base.toFixed(2), qty: 3 + Math.floor(Math.random() * 10), ts: Date.now() });
    }
    book.sort((a, b) => (side === "buy" ? b.px - a.px : a.px - b.px) || a.ts - b.ts);
  }

  /** Matches an incoming order (price-time priority) against the opposite side. */
  match(side: Side, kind: "limit" | "market", qty: number, limitPx?: number): MatchResult | null {
    const book = side === "buy" ? this.asks : this.bids;
    let remaining = qty;
    let notional = 0;
    const fills: Fill[] = [];
    let i = 0;

    while (remaining > 0 && i < book.length) {
      const level = book[i];
      if (kind === "limit" && limitPx != null) {
        if (side === "buy" && level.px > limitPx) break;
        if (side === "sell" && level.px < limitPx) break;
      }
      const take = Math.min(remaining, level.qty);
      fills.push({ px: level.px, qty: take });
      notional += take * level.px;
      level.qty -= take;
      remaining -= take;
      if (level.qty <= 0) book.splice(i, 1);
      else i++;
    }

    if (remaining > 0 || fills.length === 0) return null;
    this.topUp(side, book[0]?.px ?? limitPx ?? 0);
    return { avgPx: +(notional / qty).toFixed(2), fills };
  }

  snapshot(depth = 5): { bids: BookLevel[]; asks: BookLevel[] } {
    return {
      bids: this.bids.slice(0, depth).map((l) => ({ px: l.px, qty: l.qty })),
      asks: this.asks.slice(0, depth).map((l) => ({ px: l.px, qty: l.qty })),
    };
  }

  bestBid() {
    return this.bids[0]?.px;
  }

  bestAsk() {
    return this.asks[0]?.px;
  }
}
