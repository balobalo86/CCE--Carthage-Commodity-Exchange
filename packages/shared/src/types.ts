export type Lang = "fr" | "en" | "ar";

export type FutureCode = "HOV" | "DGN";
export type EtfCode = "OLEA" | "TEMR";
export type Side = "buy" | "sell";
export type OrderKind = "limit" | "market";
export type OptionType = "call" | "put";
export type AssetClass = "future" | "etf" | "option";

export interface LocalizedText {
  fr: string;
  en: string;
  ar: string;
}

export interface FutureContractSpec {
  code: FutureCode;
  assetClass: "future";
  accent: string;
  name: LocalizedText;
  tonnes: number;
  base: number; // TND per tonne, front-month reference
  tick: number; // TND per tonne
  marginRate: number; // initial margin, % of notional
  maintenanceRatio: number; // maintenance margin as % of initial margin
  maturities: string[];
  grade: LocalizedText;
  delivery: LocalizedText;
  posLimit: LocalizedText;
  posLimitNet: number;
  posLimitFrontMonth: number;
  rule: string;
}

export interface EtfSpec {
  code: EtfCode;
  assetClass: "etf";
  accent: string;
  name: LocalizedText;
  description: LocalizedText;
  underlying: FutureCode;
  weights: Record<string, number>; // maturity -> weight, sums to 1
  divisor: number; // NAV = weighted futures basket / divisor
  managementFeeBps: number; // annual, basis points
  creationUnit: number; // ETF units per creation/redemption basket
  inceptionNav: number;
}

export interface PriceBand {
  lo: number;
  hi: number;
  pct: number;
}

export interface MarketQuote {
  code: FutureCode;
  maturity: string;
  ref: number; // prior settlement
  last: number;
  hi: number;
  lo: number;
  vol: number;
  oi: number;
  ts: number;
  history: { t: number; p: number }[];
}

export interface BookLevel {
  px: number;
  qty: number;
}

export interface OrderBookSnapshot {
  code: FutureCode;
  maturity: string;
  bids: BookLevel[];
  asks: BookLevel[];
}

export interface RiskCheckResult {
  ok: boolean;
  reasonCode?:
    | "NO_ACK"
    | "OUT_OF_BAND"
    | "POSITION_LIMIT"
    | "INSUFFICIENT_MARGIN"
    | "FAT_FINGER";
  message?: string;
}

export interface Order {
  id: string;
  accountId: string;
  assetClass: AssetClass;
  code: string; // future/ETF/option code
  maturity?: string;
  strike?: number;
  optionType?: OptionType;
  side: Side;
  kind: OrderKind;
  qty: number;
  limitPx?: number;
  status: "filled" | "rejected";
  fillPx?: number;
  rejectReason?: string;
  ts: number;
}

export interface FuturePosition {
  assetClass: "future";
  code: FutureCode;
  maturity: string;
  side: Side;
  lots: number;
  entryPx: number;
}

export interface EtfPosition {
  assetClass: "etf";
  code: EtfCode;
  units: number;
  entryNav: number;
}

export interface OptionPosition {
  assetClass: "option";
  code: FutureCode;
  maturity: string;
  strike: number;
  optionType: OptionType;
  side: Side;
  lots: number;
  entryPremium: number;
}

export type Position = FuturePosition | EtfPosition | OptionPosition;

export interface Account {
  id: string;
  cashTnd: number;
  positions: Position[];
  orders: Order[];
  ackOnFile: boolean;
}

export interface OptionQuote {
  code: FutureCode;
  maturity: string;
  strike: number;
  optionType: OptionType;
  premium: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  iv: number;
}

export interface SpanMarginResult {
  scanningRisk: number;
  worstScenarioIdx: number;
  scenarios: { priceShockPct: number; volShift: number; pnl: number }[];
}
