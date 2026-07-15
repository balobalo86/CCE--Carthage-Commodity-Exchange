import { useEffect, useState } from "react";
import { FUTURES, type FutureCode, type OptionType, type Side } from "@cce/shared";
import { Chip, Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";
import { useToastCtx } from "../lib/ToastContext";

interface ChainRow {
  strike: number;
  call: { premium: number; delta: number; gamma: number; vega: number; theta: number; iv: number } | null;
  put: { premium: number; delta: number; gamma: number; vega: number; theta: number; iv: number } | null;
}

export default function OptionsPage() {
  const { lang, t } = useLang();
  const { quotes } = useMarket();
  const { portfolio, refresh } = useAccount();
  const { showToast } = useToastCtx();

  const [sel, setSel] = useState<FutureCode>("HOV");
  const [maturity, setMaturity] = useState(FUTURES.HOV.maturities[0]);
  const [chain, setChain] = useState<ChainRow[]>([]);
  const [picked, setPicked] = useState<{ strike: number; optionType: OptionType } | null>(null);
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const future = FUTURES[sel];
  const quote = quotes[`${sel}:${maturity}`];

  useEffect(() => {
    if (!FUTURES[sel].maturities.includes(maturity)) setMaturity(FUTURES[sel].maturities[0]);
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    function poll() {
      api.optionChain(sel, maturity, 5).then((rows) => !cancelled && setChain(rows)).catch(() => {});
    }
    poll();
    const id = setInterval(poll, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sel, maturity]);

  const pickedQuote = picked ? chain.find((r) => r.strike === picked.strike)?.[picked.optionType] : null;

  async function submit() {
    if (!picked) return;
    if (!portfolio?.ackOnFile) return showToast({ kind: "warn", msg: t.trade.ackWarn });
    setSubmitting(true);
    try {
      const order = await api.submitOption({ code: sel, maturity, strike: picked.strike, optionType: picked.optionType, side, qty });
      if (order.status === "rejected") showToast({ kind: "warn", msg: order.rejectReason ?? "Order rejected." });
      else showToast({ kind: "ok", msg: `${order.id} — ${side === "buy" ? t.common.buy : t.common.sell} ${qty} × ${sel} ${picked.optionType.toUpperCase()} ${picked.strike} @ ${order.fillPx} TND/t` });
      refresh();
    } catch (e: any) {
      showToast({ kind: "warn", msg: e.message ?? "Order failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        {Object.values(FUTURES).map((ct) => (
          <button key={ct.code} onClick={() => setSel(ct.code as FutureCode)} style={{ background: sel === ct.code ? T.panelUp : T.panel, border: `1px solid ${sel === ct.code ? ct.accent : T.line}`, borderRadius: 6, padding: "8px 14px", fontFamily: "inherit", color: T.text, fontSize: 13 }}>
            {ct.name[lang]} <span style={{ color: ct.accent, fontFamily: "'IBM Plex Mono', monospace" }}>{ct.code}</span>
          </button>
        ))}
        <select value={maturity} onChange={(e) => setMaturity(e.target.value)} style={{ background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
          {future.maturities.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <Chip>{t.options.model}</Chip>
        {quote && <Chip color={future.accent} border={future.accent + "55"}>{t.options.underlyingFuture}: {quote.last.toLocaleString("en-US")} TND/t</Chip>}
      </div>

      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 }}>
        <Panel title={t.options.chain} right={<Chip>{sel} {maturity}</Chip>}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, direction: "ltr" }}>
              <thead>
                <tr style={{ color: T.faint, fontSize: 10 }}>
                  <th colSpan={3} style={{ color: T.up, paddingBottom: 6 }}>{t.options.calls}</th>
                  <th style={{ padding: "0 10px" }}>{t.common.strike}</th>
                  <th colSpan={3} style={{ color: T.down, paddingBottom: 6 }}>{t.options.puts}</th>
                </tr>
                <tr style={{ color: T.faint, fontSize: 10 }}>
                  <th>{t.common.premium}</th>
                  <th>{t.common.greeks.delta}</th>
                  <th>{t.common.iv}</th>
                  <th></th>
                  <th>{t.common.premium}</th>
                  <th>{t.common.greeks.delta}</th>
                  <th>{t.common.iv}</th>
                </tr>
              </thead>
              <tbody>
                {chain.map((row) => (
                  <tr key={row.strike} style={{ borderTop: `1px solid ${T.line}` }}>
                    <td
                      onClick={() => setPicked({ strike: row.strike, optionType: "call" })}
                      style={{ padding: "6px 4px", color: T.up, cursor: "pointer", background: picked?.strike === row.strike && picked.optionType === "call" ? T.panelUp : "transparent" }}
                    >
                      {row.call?.premium ?? "—"}
                    </td>
                    <td style={{ color: T.muted }}>{row.call?.delta ?? "—"}</td>
                    <td style={{ color: T.muted }}>{row.call ? `${(row.call.iv * 100).toFixed(0)}%` : "—"}</td>
                    <td style={{ textAlign: "center", color: T.text, fontWeight: 600 }}>{row.strike.toLocaleString("en-US")}</td>
                    <td
                      onClick={() => setPicked({ strike: row.strike, optionType: "put" })}
                      style={{ padding: "6px 4px", color: T.down, cursor: "pointer", background: picked?.strike === row.strike && picked.optionType === "put" ? T.panelUp : "transparent" }}
                    >
                      {row.put?.premium ?? "—"}
                    </td>
                    <td style={{ color: T.muted }}>{row.put?.delta ?? "—"}</td>
                    <td style={{ color: T.muted }}>{row.put ? `${(row.put.iv * 100).toFixed(0)}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title={t.trade.orderTicket} right={picked && <Chip color={picked.optionType === "call" ? T.up : T.down}>{picked.optionType.toUpperCase()} {picked.strike}</Chip>}>
          {!picked ? (
            <div style={{ color: T.faint, fontSize: 13, padding: "20px 0", textAlign: "center" }}>
              {lang === "ar" ? "اختر خيارًا من السلسلة" : lang === "en" ? "Pick an option from the chain" : "Sélectionnez une option dans la chaîne"}
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {(["buy", "sell"] as const).map((s) => (
                  <button key={s} onClick={() => setSide(s)} style={{ flex: 1, padding: "10px 0", borderRadius: 4, fontWeight: 600, fontSize: 13, fontFamily: "inherit", background: side === s ? (s === "buy" ? T.up : T.down) : "transparent", color: side === s ? "#0c130e" : T.muted, border: `1px solid ${side === s ? "transparent" : T.line}` }}>
                    {s === "buy" ? t.common.buy : t.common.sell}
                  </button>
                ))}
              </div>
              <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.common.qty}</label>
              <input type="number" min={1} max={50} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} style={{ width: "100%", margin: "5px 0 12px", background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }} />
              {pickedQuote && (
                <div style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 12, marginBottom: 12 }}>
                  <Row label={t.common.premium} value={`${pickedQuote.premium} TND/t`} strong />
                  <Row label={t.common.greeks.delta} value={pickedQuote.delta} />
                  <Row label={t.common.greeks.gamma} value={pickedQuote.gamma} />
                  <Row label={t.common.greeks.vega} value={pickedQuote.vega} />
                  <Row label={t.common.greeks.theta} value={pickedQuote.theta} />
                  <Row label={t.trade.scanningRisk} value={side === "sell" ? "computed at submission" : "n/a (long premium)"} />
                </div>
              )}
              <label style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 12, fontSize: 11.5, color: T.muted, lineHeight: 1.5 }}>
                <input type="checkbox" checked={Boolean(portfolio?.ackOnFile)} readOnly style={{ marginTop: 2 }} />
                <span>{t.trade.ackTxt} ({lang === "ar" ? "يُضبط من صفحة الأسواق" : lang === "en" ? "set from the Markets page" : "réglé depuis la page Marchés"})</span>
              </label>
              <button onClick={submit} disabled={submitting} style={{ width: "100%", padding: "12px 0", borderRadius: 4, border: "none", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: side === "buy" ? T.up : T.down, color: "#0c130e", opacity: submitting ? 0.6 : 1 }}>
                {t.common.submit}
              </button>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}
