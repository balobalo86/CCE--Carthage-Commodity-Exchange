import { useEffect, useMemo, useState } from "react";
import { Bar, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FUTURES, priceBand, type FutureCode, type OrderBookSnapshot, type OrderKind, type Side } from "@cce/shared";
import { Chip, Panel, Row } from "../components/Atoms";
import PriceChart from "../components/PriceChart";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";
import { useToastCtx } from "../lib/ToastContext";

export default function MarketsPage() {
  const { lang, t } = useLang();
  const { quotes } = useMarket();
  const { portfolio, refresh } = useAccount();
  const { showToast } = useToastCtx();

  const [sel, setSel] = useState<FutureCode>("HOV");
  const [maturity, setMaturity] = useState(FUTURES.HOV.maturities[0]);
  const [book, setBook] = useState<OrderBookSnapshot | null>(null);
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState(1);
  const [ordType, setOrdType] = useState<OrderKind>("limit");
  const [limitPx, setLimitPx] = useState("");
  const [ack, setAckLocal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const future = FUTURES[sel];
  const key = `${sel}:${maturity}`;
  const quote = quotes[key];

  useEffect(() => {
    if (!FUTURES[sel].maturities.includes(maturity)) setMaturity(FUTURES[sel].maturities[0]);
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    function poll() {
      api.book(sel, maturity).then((b) => !cancelled && setBook(b)).catch(() => {});
    }
    poll();
    const id = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sel, maturity]);

  useEffect(() => {
    if (portfolio) setAckLocal(portfolio.ackOnFile);
  }, [portfolio?.ackOnFile]); // eslint-disable-line react-hooks/exhaustive-deps

  const band = quote ? priceBand(quote.ref) : { lo: 0, hi: 0, pct: 0.03 };
  const notional = (limitPx ? +limitPx : quote?.last ?? 0) * future.tonnes * qty;
  const margin = notional * future.marginRate;

  const curveData = useMemo(
    () => future.maturities.map((m) => ({ m, settle: quotes[`${sel}:${m}`]?.ref ?? 0, last: quotes[`${sel}:${m}`]?.last ?? 0, oi: quotes[`${sel}:${m}`]?.oi ?? 0 })),
    [future, quotes, sel]
  );

  async function toggleAck(next: boolean) {
    setAckLocal(next);
    await api.setAck(next).catch(() => {});
    refresh();
  }

  async function submit() {
    if (!quote) return;
    if (!ack) return showToast({ kind: "warn", msg: t.trade.ackWarn });
    setSubmitting(true);
    try {
      const order = await api.submitFuture({ code: sel, maturity, side, kind: ordType, qty, limitPx: ordType === "limit" ? +limitPx || undefined : undefined });
      if (order.status === "rejected") {
        showToast({ kind: "warn", msg: order.rejectReason ?? "Order rejected." });
      } else {
        showToast({
          kind: "ok",
          msg: t.trade.execOk(order.id, side === "buy" ? t.common.buy : t.common.sell, String(qty), sel, maturity, String(order.fillPx)),
        });
      }
      refresh();
    } catch (e: any) {
      showToast({ kind: "warn", msg: e.message ?? "Order failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
        {Object.values(FUTURES).map((ct) => {
          const front = quotes[`${ct.code}:${ct.maturities[0]}`];
          const d = front ? front.last - front.ref : 0;
          const active = sel === ct.code;
          return (
            <button
              key={ct.code}
              onClick={() => setSel(ct.code as FutureCode)}
              style={{ background: active ? T.panelUp : T.panel, border: `1px solid ${active ? ct.accent : T.line}`, borderRadius: 6, padding: "10px 14px", textAlign: "start", minWidth: 260, fontFamily: "inherit", color: T.text }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{ct.name[lang]}</span>
                <span style={{ color: ct.accent, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{ct.code}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, alignItems: "baseline" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18 }}>
                  {front ? front.last.toLocaleString("en-US") : "—"} <span style={{ fontSize: 11, color: T.muted }}>{t.common.perT}</span>
                </span>
                {front && (
                  <span style={{ color: d >= 0 ? T.up : T.down, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                    {d >= 0 ? "+" : "−"}
                    {((Math.abs(d) / front.ref) * 100).toFixed(2)} %
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr", gap: 16 }}>
        <Panel
          title={`${future.name[lang]} — ${maturity}`}
          right={quote && <Chip color={quote.last - quote.ref >= 0 ? T.up : T.down}>{t.common.settle}: {quote.ref.toLocaleString("en-US")} · ±{(band.pct * 100).toFixed(0)} %</Chip>}
        >
          {quote && <PriceChart history={quote.history} loB={band.lo} hiB={band.hi} refPx={quote.ref} accent={future.accent} unit="TND/t" lastLabel={t.common.last} />}
          {quote && (
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0 22px", marginTop: 8 }}>
              <Row label={t.common.vol} value={quote.vol.toLocaleString(lang)} />
              <Row label={t.common.oi} value={quote.oi.toLocaleString(lang)} />
              <Row label={`${t.common.high} / ${t.common.low}`} value={`${quote.hi.toLocaleString("en-US")} / ${quote.lo.toLocaleString("en-US")}`} />
            </div>
          )}
        </Panel>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title={t.trade.orderTicket} right={<Chip color={future.accent} border={future.accent + "55"}>{sel} — {maturity}</Chip>}>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {(["buy", "sell"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 4, fontWeight: 600, fontSize: 13, fontFamily: "inherit", background: side === s ? (s === "buy" ? T.up : T.down) : "transparent", color: side === s ? "#0c130e" : T.muted, border: `1px solid ${side === s ? "transparent" : T.line}` }}
                >
                  {s === "buy" ? t.common.buy : t.common.sell}
                </button>
              ))}
            </div>
            <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.common.maturities}</label>
            <select value={maturity} onChange={(e) => setMaturity(e.target.value)} style={{ width: "100%", margin: "5px 0 12px", background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
              {future.maturities.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.trade.ordType}</label>
            <div style={{ display: "flex", gap: 8, margin: "5px 0 12px" }}>
              {([["limit", t.trade.limit], ["market", t.trade.market]] as const).map(([k, lbl]) => (
                <button key={k} onClick={() => setOrdType(k)} style={{ flex: 1, padding: "8px 0", borderRadius: 4, fontSize: 12, fontFamily: "inherit", background: ordType === k ? T.panelUp : "transparent", color: ordType === k ? T.text : T.muted, border: `1px solid ${ordType === k ? T.faint : T.line}` }}>
                  {lbl}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.common.qty}</label>
                <input type="number" min={1} max={50} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} style={{ width: "100%", marginTop: 5, background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.trade.pxLimit}</label>
                <input
                  type="number"
                  step={future.tick}
                  disabled={ordType === "market"}
                  value={ordType === "market" ? quote?.last ?? "" : limitPx}
                  placeholder={quote ? String(quote.last) : ""}
                  onChange={(e) => setLimitPx(e.target.value)}
                  style={{ width: "100%", marginTop: 5, background: T.panelUp, color: ordType === "market" ? T.faint : T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, direction: "ltr" }}
                />
              </div>
            </div>
            <div style={{ marginTop: 14, background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 12 }}>
              <Row label={t.trade.notional} value={`${notional.toLocaleString(lang)} TND`} />
              <Row label={`${t.trade.margin} (${(future.marginRate * 100).toFixed(0)} %)`} value={`${margin.toLocaleString(lang)} TND`} strong color={future.accent} />
              <Row label={t.trade.bands} value={`${band.lo.toLocaleString("en-US")} – ${band.hi.toLocaleString("en-US")}`} />
              <Row label={t.trade.posLimit} value={future.posLimit[lang]} />
            </div>
            <label style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 14, fontSize: 11.5, color: T.muted, lineHeight: 1.55, cursor: "pointer" }}>
              <input type="checkbox" checked={ack} onChange={(e) => toggleAck(e.target.checked)} style={{ marginTop: 2, accentColor: future.accent }} />
              <span>{t.trade.ackTxt}</span>
            </label>
            <button
              onClick={submit}
              disabled={submitting || !quote}
              style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 4, border: "none", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: side === "buy" ? T.up : T.down, color: "#0c130e", opacity: submitting ? 0.6 : 1 }}
            >
              {t.common.submit} — {side === "buy" ? t.common.buy : t.common.sell} {qty} × {sel}
            </button>
            <div style={{ marginTop: 9, fontSize: 10.5, color: T.faint, textAlign: "center" }}>{t.trade.auditTrail}</div>
          </Panel>
        </div>
      </div>

      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 16 }}>
        <Panel title={t.trade.orders} right={<Chip>{portfolio?.orders.length ?? 0}</Chip>}>
          {!portfolio || portfolio.orders.length === 0 ? (
            <div style={{ color: T.faint, fontSize: 13, padding: "26px 0", textAlign: "center" }}>{t.trade.noOrders}</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
              <tbody>
                {portfolio.orders.slice(0, 10).map((o: any) => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${T.line}` }}>
                    <td style={{ padding: "7px 0", color: T.muted }}>{o.id}</td>
                    <td style={{ color: o.assetClass === "future" ? FUTURES[o.code]?.accent : T.text }}>{o.code}{o.maturity ?? ""}</td>
                    <td style={{ color: o.side === "buy" ? T.up : T.down }}>{o.side === "buy" ? t.common.buy : t.common.sell}</td>
                    <td>{o.qty}</td>
                    <td>{o.fillPx ?? "—"}</td>
                    <td style={{ color: o.status === "filled" ? T.up : T.down }}>{o.status === "filled" ? "✓" : "✗"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title={t.common.book} right={<Chip>{sel} {maturity}</Chip>}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, direction: "ltr" }}>
            <tbody>
              {book?.asks.map((a, i) => (
                <tr key={"a" + i}>
                  <td style={{ color: T.faint, padding: "2.5px 0" }}>{a.qty}</td>
                  <td style={{ textAlign: "right", color: T.down }}>{a.px.toLocaleString("en-US")}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} style={{ padding: "6px 0", textAlign: "center", color: future.accent, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, fontWeight: 600 }}>
                  {quote?.last.toLocaleString("en-US") ?? "—"}
                </td>
              </tr>
              {book?.bids.map((b, i) => (
                <tr key={"b" + i}>
                  <td style={{ color: T.faint, padding: "2.5px 0" }}>{b.qty}</td>
                  <td style={{ textAlign: "right", color: T.up }}>{b.px.toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title={t.common.maturities}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {future.maturities.map((m) => (
              <button key={m} onClick={() => setMaturity(m)} style={{ background: maturity === m ? future.accent : "transparent", color: maturity === m ? "#101408" : T.muted, border: `1px solid ${maturity === m ? future.accent : T.line}`, borderRadius: 4, padding: "6px 11px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                {m}
              </button>
            ))}
          </div>
          <div style={{ height: 150, direction: "ltr" }}>
            <ResponsiveContainer>
              <ComposedChart data={curveData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <XAxis dataKey="m" tick={{ fill: T.muted, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: T.line }} tickLine={false} />
                <YAxis hide domain={["dataMin - 60", "dataMax + 60"]} />
                <Tooltip contentStyle={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, fontSize: 12, fontFamily: "IBM Plex Mono" }} />
                <Bar dataKey="oi" fill={T.line} radius={[3, 3, 0, 0]} name={t.common.oi} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
