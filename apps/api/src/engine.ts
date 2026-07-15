import {
  black76,
  ETFS,
  FUTURES,
  futuresInitialMargin,
  futuresVariationMargin,
  maturityToExpiry,
  priceBand,
  spanScenarioMargin,
  yearsBetween,
  type Account,
  type FuturePosition,
  type MarketQuote,
  type Order,
  type OptionPosition,
  type OptionQuote,
  type OptionType,
  type EtfPosition,
  type RiskReasonCode,
  type Side,
} from "@cce/shared";
import { OrderBook } from "./orderBook.js";
import { checkAck, checkBand, checkFatFinger, checkMarginAvailable, checkPositionLimit } from "./riskEngine.js";

const OPTION_VOL: Record<string, number> = { HOV: 0.22, DGN: 0.26 };
const RISK_FREE_RATE = 0.075; // approximate TND money-market rate, flat assumption

function key(code: string, maturity: string) {
  return `${code}:${maturity}`;
}

function roundToTick(px: number, tick: number) {
  return +(Math.round(px / tick) * tick).toFixed(2);
}

let orderSeq = 1000;
function nextOrderId() {
  orderSeq += 1;
  return `ORD-${orderSeq}`;
}

class Engine {
  quotes = new Map<string, MarketQuote>();
  books = new Map<string, OrderBook>();
  accounts = new Map<string, Account>();
  listeners = new Set<() => void>();

  constructor() {
    for (const future of Object.values(FUTURES)) {
      future.maturities.forEach((m, idx) => {
        const carry = 1 + 0.006 * idx + (Math.random() - 0.5) * 0.002;
        const ref = roundToTick(future.base * carry, future.tick);
        const history: { t: number; p: number }[] = [];
        let p = ref * 0.998;
        for (let t = 0; t < 60; t++) {
          p = Math.max(future.tick, p + (Math.random() - 0.48) * ref * 0.0012);
          history.push({ t, p: roundToTick(p, future.tick) });
        }
        const last = history[history.length - 1].p;
        const k = key(future.code, m);
        this.quotes.set(k, { code: future.code as any, maturity: m, ref, last, hi: last, lo: last, vol: 90 + Math.floor(Math.random() * 160), oi: 700 + Math.floor(Math.random() * 900), ts: Date.now(), history });
        const book = new OrderBook(future.tick);
        book.reseedAround(last);
        this.books.set(k, book);
      });
    }
    setInterval(() => this.tick(), 1900);
  }

  onUpdate(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private tick() {
    for (const [k, quote] of this.quotes) {
      const future = FUTURES[quote.code];
      const band = priceBand(quote.ref);
      let p = quote.last + (Math.random() - 0.5) * quote.ref * 0.0015;
      p = roundToTick(Math.min(band.hi, Math.max(band.lo, p)), future.tick);
      quote.last = p;
      quote.hi = Math.max(quote.hi, p);
      quote.lo = Math.min(quote.lo, p);
      quote.ts = Date.now();
      quote.vol += Math.random() < 0.35 ? 1 : 0;
      quote.history = [...quote.history.slice(-59), { t: quote.history[quote.history.length - 1].t + 1, p }];
      this.books.get(k)?.reseedAround(p);
    }
    this.listeners.forEach((fn) => fn());
  }

  getAllQuotes(): MarketQuote[] {
    return [...this.quotes.values()];
  }

  getQuote(code: string, maturity: string) {
    return this.quotes.get(key(code, maturity));
  }

  getBook(code: string, maturity: string) {
    return this.books.get(key(code, maturity))?.snapshot();
  }

  getOptionQuote(code: string, maturity: string, strike: number, optionType: OptionType): OptionQuote | null {
    const quote = this.getQuote(code, maturity);
    if (!quote) return null;
    const sigma = OPTION_VOL[code] ?? 0.24;
    const T = yearsBetween(Date.now(), maturityToExpiry(maturity).getTime());
    const r = black76(optionType, quote.last, strike, T, RISK_FREE_RATE, sigma);
    return {
      code: code as any,
      maturity,
      strike,
      optionType,
      premium: +r.price.toFixed(2),
      delta: +r.delta.toFixed(4),
      gamma: +r.gamma.toFixed(6),
      vega: +r.vega.toFixed(2),
      theta: +r.theta.toFixed(2),
      iv: sigma,
    };
  }

  getOptionChain(code: string, maturity: string, width = 5) {
    const future = FUTURES[code];
    const quote = this.getQuote(code, maturity);
    if (!future || !quote) return null;
    const stepRaw = quote.last * 0.02;
    const step = Math.max(roundToTick(stepRaw, future.tick), future.tick * 10);
    const rows = [];
    for (let i = -width; i <= width; i++) {
      const strike = roundToTick(quote.last + i * step, future.tick);
      rows.push({
        strike,
        call: this.getOptionQuote(code, maturity, strike, "call"),
        put: this.getOptionQuote(code, maturity, strike, "put"),
      });
    }
    return rows;
  }

  getEtfQuote(etfCode: string) {
    const etf = ETFS[etfCode];
    if (!etf) return null;
    const future = FUTURES[etf.underlying];
    const front = this.getQuote(future.code, future.maturities[0]);
    const second = this.getQuote(future.code, future.maturities[1] ?? future.maturities[0]);
    if (!front || !second) return null;
    const basket = front.last * etf.weights.front + second.last * (etf.weights.second ?? 0);
    const nav = +(basket / etf.divisor).toFixed(3);
    return { code: etfCode, nav, basket: +basket.toFixed(2), chgPct: +(((nav - etf.inceptionNav) / etf.inceptionNav) * 100).toFixed(2), ts: Date.now() };
  }

  getOrCreateAccount(id: string): Account {
    let acc = this.accounts.get(id);
    if (!acc) {
      acc = {
        id,
        cashTnd: 412000,
        ackOnFile: false,
        orders: [],
        positions:
          id === "demo"
            ? [
                { assetClass: "future", code: "HOV", maturity: FUTURES.HOV.maturities[1], side: "buy", lots: 3, entryPx: FUTURES.HOV.base },
                { assetClass: "future", code: "DGN", maturity: FUTURES.DGN.maturities[1], side: "sell", lots: 4, entryPx: FUTURES.DGN.base },
              ]
            : [],
      };
      this.accounts.set(id, acc);
    }
    return acc;
  }

  setAck(accountId: string, ack: boolean) {
    const acc = this.getOrCreateAccount(accountId);
    acc.ackOnFile = ack;
    return acc;
  }

  computeUsedMargin(account: Account): number {
    let total = 0;
    for (const pos of account.positions) {
      if (pos.assetClass === "future") {
        const future = FUTURES[pos.code];
        const q = this.getQuote(pos.code, pos.maturity);
        if (!future || !q) continue;
        total += futuresInitialMargin(q.last * future.tonnes * pos.lots, future.marginRate);
      } else if (pos.assetClass === "option" && pos.side === "sell") {
        const future = FUTURES[pos.code];
        const q = this.getQuote(pos.code, pos.maturity);
        if (!future || !q) continue;
        const sigma = OPTION_VOL[pos.code] ?? 0.24;
        const T = yearsBetween(Date.now(), maturityToExpiry(pos.maturity).getTime());
        const span = spanScenarioMargin(pos.optionType, pos.side, pos.lots, future.tonnes, q.last, pos.strike, T, RISK_FREE_RATE, sigma, pos.entryPremium);
        total += span.scanningRisk;
      }
    }
    return total;
  }

  computePnl(account: Account): number {
    let total = 0;
    for (const pos of account.positions) {
      if (pos.assetClass === "future") {
        const future = FUTURES[pos.code];
        const q = this.getQuote(pos.code, pos.maturity);
        if (!future || !q) continue;
        total += futuresVariationMargin(pos.lots, future.tonnes, pos.entryPx, q.last, pos.side);
      } else if (pos.assetClass === "option") {
        const future = FUTURES[pos.code];
        const oq = this.getOptionQuote(pos.code, pos.maturity, pos.strike, pos.optionType);
        if (!future || !oq) continue;
        const d = (oq.premium - pos.entryPremium) * future.tonnes * pos.lots;
        total += pos.side === "buy" ? d : -d;
      } else if (pos.assetClass === "etf") {
        const eq = this.getEtfQuote(pos.code);
        if (!eq) continue;
        total += (eq.nav - pos.entryNav) * pos.units;
      }
    }
    return total;
  }

  private netPositionLots(account: Account, code: string, maturity?: string) {
    let net = 0;
    let front = 0;
    const future = FUTURES[code];
    for (const pos of account.positions) {
      if (pos.assetClass !== "future" || pos.code !== code) continue;
      const signed = pos.side === "buy" ? pos.lots : -pos.lots;
      net += signed;
      if (pos.maturity === future.maturities[0]) front += signed;
    }
    return { net, front };
  }

  submitFutureOrder(accountId: string, code: string, maturity: string, side: Side, kind: "limit" | "market", qty: number, limitPx?: number): Order {
    const account = this.getOrCreateAccount(accountId);
    const future = FUTURES[code];
    const quote = this.getQuote(code, maturity);
    const reject = (message: string, reasonCode: RiskReasonCode) => {
      const order: Order = { id: nextOrderId(), accountId, assetClass: "future", code, maturity, side, kind, qty, limitPx, status: "rejected", rejectReason: `${reasonCode}: ${message}`, reasonCode, ts: Date.now() };
      account.orders.unshift(order);
      return order;
    };
    if (!future || !quote) return reject("Unknown contract or maturity.", "UNKNOWN");

    const ack = checkAck(account);
    if (!ack.ok) return reject(ack.message!, ack.reasonCode!);
    const ff = checkFatFinger(qty);
    if (!ff.ok) return reject(ff.message!, ff.reasonCode!);
    const band = priceBand(quote.ref);
    const bandCheck = checkBand(kind === "limit" ? limitPx : undefined, band.lo, band.hi);
    if (!bandCheck.ok) return reject(bandCheck.message!, bandCheck.reasonCode!);

    const { net, front } = this.netPositionLots(account, code);
    const isFrontMonth = maturity === future.maturities[0];
    const posCheck = checkPositionLimit(net, front, isFrontMonth, side, qty, future.posLimitNet, future.posLimitFrontMonth);
    if (!posCheck.ok) return reject(posCheck.message!, posCheck.reasonCode!);

    const book = this.books.get(key(code, maturity))!;
    const match = book.match(side, kind, qty, kind === "limit" ? limitPx : undefined);
    if (!match) return reject("No matching liquidity within band.", "OUT_OF_BAND");

    const notional = match.avgPx * future.tonnes * qty;
    const margin = futuresInitialMargin(notional, future.marginRate);
    const available = account.cashTnd - this.computeUsedMargin(account);
    const marginCheck = checkMarginAvailable(available, margin);
    if (!marginCheck.ok) return reject(marginCheck.message!, marginCheck.reasonCode!);

    quote.last = match.avgPx;
    quote.vol += qty;
    quote.oi += Math.round(qty / 2);

    const order: Order = { id: nextOrderId(), accountId, assetClass: "future", code, maturity, side, kind, qty, limitPx, status: "filled", fillPx: match.avgPx, ts: Date.now() };
    account.orders.unshift(order);
    const position: FuturePosition = { assetClass: "future", code: code as any, maturity, side, lots: qty, entryPx: match.avgPx };
    account.positions.push(position);
    return order;
  }

  submitOptionOrder(accountId: string, code: string, maturity: string, strike: number, optionType: OptionType, side: Side, qty: number): Order {
    const account = this.getOrCreateAccount(accountId);
    const future = FUTURES[code];
    const oq = this.getOptionQuote(code, maturity, strike, optionType);
    const reject = (message: string, reasonCode: RiskReasonCode) => {
      const order: Order = { id: nextOrderId(), accountId, assetClass: "option", code, maturity, strike, optionType, side, kind: "market", qty, status: "rejected", rejectReason: `${reasonCode}: ${message}`, reasonCode, ts: Date.now() };
      account.orders.unshift(order);
      return order;
    };
    if (!future || !oq) return reject("Unknown contract, maturity, or strike.", "UNKNOWN");

    const ack = checkAck(account);
    if (!ack.ok) return reject(ack.message!, ack.reasonCode!);
    const ff = checkFatFinger(qty);
    if (!ff.ok) return reject(ff.message!, ff.reasonCode!);

    const spread = side === "buy" ? 1.01 : 0.99;
    const fillPremium = +(oq.premium * spread).toFixed(2);
    const cashFlow = fillPremium * future.tonnes * qty;

    let requiredMargin = 0;
    if (side === "sell") {
      const sigma = OPTION_VOL[code] ?? 0.24;
      const T = yearsBetween(Date.now(), maturityToExpiry(maturity).getTime());
      const span = spanScenarioMargin(optionType, side, qty, future.tonnes, oq.premium ? this.getQuote(code, maturity)!.last : 0, strike, T, RISK_FREE_RATE, sigma, fillPremium);
      requiredMargin = span.scanningRisk;
    }
    const available = account.cashTnd - this.computeUsedMargin(account) - (side === "buy" ? cashFlow : 0);
    const marginCheck = checkMarginAvailable(available, requiredMargin);
    if (!marginCheck.ok) return reject(marginCheck.message!, marginCheck.reasonCode!);

    account.cashTnd += side === "buy" ? -cashFlow : cashFlow;

    const order: Order = { id: nextOrderId(), accountId, assetClass: "option", code, maturity, strike, optionType, side, kind: "market", qty, status: "filled", fillPx: fillPremium, ts: Date.now() };
    account.orders.unshift(order);
    const position: OptionPosition = { assetClass: "option", code: code as any, maturity, strike, optionType, side, lots: qty, entryPremium: fillPremium };
    account.positions.push(position);
    return order;
  }

  submitEtfOrder(accountId: string, etfCode: string, side: "subscribe" | "redeem", units: number): Order {
    const account = this.getOrCreateAccount(accountId);
    const etf = ETFS[etfCode];
    const eq = this.getEtfQuote(etfCode);
    const reject = (message: string, reasonCode: RiskReasonCode) => {
      const order: Order = { id: nextOrderId(), accountId, assetClass: "etf", code: etfCode, side: side === "subscribe" ? "buy" : "sell", kind: "market", qty: units, status: "rejected", rejectReason: `${reasonCode}: ${message}`, reasonCode, ts: Date.now() };
      account.orders.unshift(order);
      return order;
    };
    if (!etf || !eq) return reject("Unknown ETF.", "UNKNOWN");
    const ack = checkAck(account);
    if (!ack.ok) return reject(ack.message!, ack.reasonCode!);

    const cost = eq.nav * units;
    if (side === "subscribe") {
      const available = account.cashTnd - this.computeUsedMargin(account);
      if (cost > available) return reject("Insufficient cash for this subscription.", "INSUFFICIENT_MARGIN");
      account.cashTnd -= cost;
      account.positions.push({ assetClass: "etf", code: etfCode as any, units, entryNav: eq.nav });
    } else {
      const owned = account.positions.filter((p): p is EtfPosition => p.assetClass === "etf" && p.code === etfCode).reduce((s, p) => s + p.units, 0);
      if (units > owned) return reject("Insufficient units held for this redemption.", "POSITION_LIMIT");
      let remaining = units;
      account.positions = account.positions.filter((p) => {
        if (p.assetClass !== "etf" || p.code !== etfCode || remaining <= 0) return true;
        if (p.units <= remaining) {
          remaining -= p.units;
          return false;
        }
        p.units -= remaining;
        remaining = 0;
        return true;
      });
      account.cashTnd += cost;
    }

    const order: Order = { id: nextOrderId(), accountId, assetClass: "etf", code: etfCode, side: side === "subscribe" ? "buy" : "sell", kind: "market", qty: units, status: "filled", fillPx: eq.nav, ts: Date.now() };
    account.orders.unshift(order);
    return order;
  }

  private enrichPositions(account: Account) {
    return account.positions.map((pos, idx) => {
      if (pos.assetClass === "future") {
        const future = FUTURES[pos.code];
        const q = this.getQuote(pos.code, pos.maturity);
        const markPx = q?.last ?? pos.entryPx;
        const unrealizedPnl = q ? futuresVariationMargin(pos.lots, future.tonnes, pos.entryPx, markPx, pos.side) : 0;
        return { ...pos, idx, markPx, unrealizedPnl: +unrealizedPnl.toFixed(2) };
      }
      if (pos.assetClass === "option") {
        const future = FUTURES[pos.code];
        const oq = this.getOptionQuote(pos.code, pos.maturity, pos.strike, pos.optionType);
        const markPx = oq?.premium ?? pos.entryPremium;
        const d = (markPx - pos.entryPremium) * future.tonnes * pos.lots;
        return { ...pos, idx, markPx, unrealizedPnl: +(pos.side === "buy" ? d : -d).toFixed(2) };
      }
      const eq = this.getEtfQuote(pos.code);
      const markPx = eq?.nav ?? pos.entryNav;
      return { ...pos, idx, markPx, unrealizedPnl: +((markPx - pos.entryNav) * pos.units).toFixed(2) };
    });
  }

  getPortfolio(accountId: string) {
    const account = this.getOrCreateAccount(accountId);
    return {
      cashTnd: account.cashTnd,
      usedMargin: +this.computeUsedMargin(account).toFixed(2),
      pnl: +this.computePnl(account).toFixed(2),
      ackOnFile: account.ackOnFile,
      positions: this.enrichPositions(account),
      orders: account.orders.slice(0, 50),
    };
  }
}

export const engine = new Engine();
