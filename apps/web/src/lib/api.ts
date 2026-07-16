import type { FutureCode, MarketQuote, Order, OrderBookSnapshot, Side } from "@cce/shared";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const GUEST_ACCOUNT_ID = "demo";

let currentAccountId: string = GUEST_ACCOUNT_ID;
let authToken: string | null = null;

export function setSession(accountId: string | null, token: string | null) {
  currentAccountId = accountId ?? GUEST_ACCOUNT_ID;
  authToken = token;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export interface AuthUser {
  email: string;
  fullName: string;
  accountId: string;
  createdAt: number;
}

export const api = {
  contracts: () => req<{ futures: Record<string, any>; etfs: Record<string, any> }>("/api/contracts"),
  markets: () => req<MarketQuote[]>("/api/markets"),
  market: (code: string, maturity: string) => req<MarketQuote>(`/api/markets/${code}/${maturity}`),
  book: (code: string, maturity: string) => req<OrderBookSnapshot>(`/api/markets/${code}/${maturity}/book`),
  optionChain: (code: string, maturity: string, width = 5) =>
    req<any[]>(`/api/options/${code}/${maturity}/chain?width=${width}`),
  etfs: () => req<{ spec: any; quote: any }[]>("/api/etf"),
  etf: (code: string) => req<{ spec: any; quote: any }>(`/api/etf/${code}`),
  swaps: () => req<{ spec: any; quotes: any[] }[]>("/api/swaps"),
  swap: (code: string, tenorMonths: number) => req<any>(`/api/swaps/${code}/${tenorMonths}`),
  history: (code: string, maturity: string, days = 90) => req<{ date: string; settle: number }[]>(`/api/markets/${code}/${maturity}/history?days=${days}`),
  portfolio: (accountId = currentAccountId) => req<any>(`/api/accounts/${accountId}/portfolio`),
  setAck: (ack: boolean, accountId = currentAccountId) =>
    req<{ id: string; ackOnFile: boolean }>(`/api/accounts/${accountId}/ack`, {
      method: "POST",
      body: JSON.stringify({ ack }),
    }),
  submitFuture: (input: { code: FutureCode; maturity: string; side: Side; kind: "limit" | "market"; qty: number; limitPx?: number }) =>
    req<Order>("/api/orders/future", { method: "POST", body: JSON.stringify({ accountId: currentAccountId, ...input }) }),
  submitOption: (input: { code: FutureCode; maturity: string; strike: number; optionType: "call" | "put"; side: Side; qty: number }) =>
    req<Order>("/api/orders/option", { method: "POST", body: JSON.stringify({ accountId: currentAccountId, ...input }) }),
  submitEtf: (input: { code: string; side: "subscribe" | "redeem"; units: number }) =>
    req<Order>("/api/orders/etf", { method: "POST", body: JSON.stringify({ accountId: currentAccountId, ...input }) }),
  submitSwap: (input: { code: string; tenorMonths: number; side: Side; qty: number }) =>
    req<Order>("/api/orders/swap", { method: "POST", body: JSON.stringify({ accountId: currentAccountId, ...input }) }),
  auth: {
    register: (email: string, password: string, fullName: string) =>
      req<{ token: string; user: AuthUser }>("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, fullName }) }),
    login: (email: string, password: string) =>
      req<{ token: string; user: AuthUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    me: () => req<{ user: AuthUser }>("/api/auth/me"),
    logout: () => req<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  },
};
