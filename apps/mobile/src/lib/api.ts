import type { FutureCode, MarketQuote, Order, OrderBookSnapshot, Side } from "@cce/shared";
import { ACCOUNT_ID, API_URL } from "./config";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  markets: () => req<MarketQuote[]>("/api/markets"),
  book: (code: string, maturity: string) => req<OrderBookSnapshot>(`/api/markets/${code}/${maturity}/book`),
  optionChain: (code: string, maturity: string, width = 5) => req<any[]>(`/api/options/${code}/${maturity}/chain?width=${width}`),
  etfs: () => req<{ spec: any; quote: any }[]>("/api/etf"),
  portfolio: (accountId = ACCOUNT_ID) => req<any>(`/api/accounts/${accountId}/portfolio`),
  setAck: (ack: boolean, accountId = ACCOUNT_ID) =>
    req<{ id: string; ackOnFile: boolean }>(`/api/accounts/${accountId}/ack`, { method: "POST", body: JSON.stringify({ ack }) }),
  submitFuture: (input: { code: FutureCode; maturity: string; side: Side; kind: "limit" | "market"; qty: number; limitPx?: number }) =>
    req<Order>("/api/orders/future", { method: "POST", body: JSON.stringify({ accountId: ACCOUNT_ID, ...input }) }),
  submitOption: (input: { code: FutureCode; maturity: string; strike: number; optionType: "call" | "put"; side: Side; qty: number }) =>
    req<Order>("/api/orders/option", { method: "POST", body: JSON.stringify({ accountId: ACCOUNT_ID, ...input }) }),
  submitEtf: (input: { code: string; side: "subscribe" | "redeem"; units: number }) =>
    req<Order>("/api/orders/etf", { method: "POST", body: JSON.stringify({ accountId: ACCOUNT_ID, ...input }) }),
  swaps: () => req<{ spec: any; quotes: any[] }[]>("/api/swaps"),
  swap: (code: string, tenorMonths: number) => req<any>(`/api/swaps/${code}/${tenorMonths}`),
  submitSwap: (input: { code: string; tenorMonths: number; side: Side; qty: number }) =>
    req<Order>("/api/orders/swap", { method: "POST", body: JSON.stringify({ accountId: ACCOUNT_ID, ...input }) }),
};
