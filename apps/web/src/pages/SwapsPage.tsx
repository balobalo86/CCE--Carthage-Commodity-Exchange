import { useEffect, useState } from "react";
import { FUTURES, rejectionMessage, swapInitialMargin, SWAPS, type Side, type SwapCode } from "@cce/shared";
import { Chip, Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";
import { useToastCtx } from "../lib/ToastContext";

export default function SwapsPage() {
  const { lang, t } = useLang();
  const { portfolio, refresh } = useAccount();
  const { showToast } = useToastCtx();

  const [sel, setSel] = useState<SwapCode>("HOV-SWAP");
  const swap = SWAPS[sel];
  const [tenorMonths, setTenorMonths] = useState(swap.tenorsMonths[0]);
  const [quote, setQuote] = useState<{ fixedRate: number; referenceMaturity: string } | null>(null);
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const future = FUTURES[swap.underlying];

  useEffect(() => {
    if (!swap.tenorsMonths.includes(tenorMonths)) setTenorMonths(swap.tenorsMonths[0]);
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    function poll() {
      api.swap(sel, tenorMonths).then((q) => !cancelled && setQuote(q)).catch(() => {});
    }
    poll();
    const id = setInterval(poll, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sel, tenorMonths]);

  const notionalTonnes = future.tonnes * qty;
  const margin = quote ? swapInitialMargin(notionalTonnes, quote.fixedRate, future.marginRate, tenorMonths) : 0;

  async function submit() {
    if (!portfolio?.ackOnFile) return showToast({ kind: "warn", msg: t.trade.ackWarn });
    setSubmitting(true);
    try {
      const order = await api.submitSwap({ code: sel, tenorMonths, side, qty });
      if (order.status === "rejected") showToast({ kind: "warn", msg: rejectionMessage(t, order) });
      else
        showToast({
          kind: "ok",
          msg: `${order.id} — ${side === "buy" ? t.swap.payFixed : t.swap.receiveFixed} ${sel} ${tenorMonths}${t.swap.months} @ ${order.fillPx} TND/t`,
        });
      refresh();
    } catch (e: any) {
      showToast({ kind: "warn", msg: e.message ?? "Order failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {Object.values(SWAPS).map((s) => (
          <button
            key={s.code}
            onClick={() => setSel(s.code as SwapCode)}
            style={{ background: sel === s.code ? T.panelUp : T.panel, border: `1px solid ${sel === s.code ? s.accent : T.line}`, borderRadius: 6, padding: "10px 14px", textAlign: "start", minWidth: 220, fontFamily: "inherit", color: T.text }}
          >
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.name[lang]}</div>
            <div style={{ color: s.accent, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, marginTop: 4 }}>{s.code}</div>
          </button>
        ))}
      </div>

      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Panel title={swap.name[lang]} right={<Chip color={swap.accent} border={swap.accent + "55"}>{t.swap.fixedRate}: {quote ? quote.fixedRate.toLocaleString("en-US") : "—"} TND/t</Chip>}>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 12 }}>{swap.description[lang]}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {swap.tenorsMonths.map((m) => (
              <button
                key={m}
                onClick={() => setTenorMonths(m)}
                style={{ background: tenorMonths === m ? swap.accent : "transparent", color: tenorMonths === m ? "#101408" : T.muted, border: `1px solid ${tenorMonths === m ? swap.accent : T.line}`, borderRadius: 4, padding: "6px 11px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {m} {t.swap.months}
              </button>
            ))}
          </div>
          {quote && (
            <>
              <Row label={t.swap.referenceMaturity} value={`${swap.underlying}${quote.referenceMaturity}`} />
              <Row label={t.swap.floatingRate} value={`${quote.fixedRate.toLocaleString("en-US")} TND/t`} />
            </>
          )}
          <div style={{ marginTop: 12, fontSize: 12, color: T.faint, lineHeight: 1.6 }}>{t.swap.mechanism}</div>
        </Panel>

        <Panel title={t.trade.orderTicket}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {(["buy", "sell"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                style={{ flex: 1, padding: "10px 0", borderRadius: 4, fontWeight: 600, fontSize: 13, fontFamily: "inherit", background: side === s ? (s === "buy" ? T.up : T.down) : "transparent", color: side === s ? "#0c130e" : T.muted, border: `1px solid ${side === s ? "transparent" : T.line}` }}
              >
                {s === "buy" ? t.swap.payFixed : t.swap.receiveFixed}
              </button>
            ))}
          </div>
          <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.common.qty} ({t.common.lots})</label>
          <input
            type="number"
            min={1}
            max={50}
            value={qty}
            onChange={(e) => setQty(Math.max(1, +e.target.value || 1))}
            style={{ width: "100%", margin: "5px 0 12px", background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
          />
          <div style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 12, marginBottom: 12 }}>
            <Row label={t.swap.notional} value={`${notionalTonnes.toLocaleString(lang)} t`} />
            <Row label={t.trade.margin} value={`${margin.toLocaleString(lang, { maximumFractionDigits: 0 })} TND`} strong color={swap.accent} />
          </div>
          <label style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 12, fontSize: 11.5, color: T.muted, lineHeight: 1.5 }}>
            <input type="checkbox" checked={Boolean(portfolio?.ackOnFile)} readOnly style={{ marginTop: 2 }} />
            <span>
              {t.trade.ackTxt} ({lang === "ar" ? "يُضبط من صفحة الأسواق" : lang === "en" ? "set from the Markets page" : "réglé depuis la page Marchés"})
            </span>
          </label>
          <button
            onClick={submit}
            disabled={submitting || !quote}
            style={{ width: "100%", padding: "12px 0", borderRadius: 4, border: "none", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: side === "buy" ? T.up : T.down, color: "#0c130e", opacity: submitting ? 0.6 : 1 }}
          >
            {t.common.submit} — {side === "buy" ? t.swap.payFixed : t.swap.receiveFixed} {qty} × {sel}
          </button>
        </Panel>
      </div>
    </div>
  );
}
