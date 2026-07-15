import { useState } from "react";
import { ETFS, FUTURES, rejectionMessage, type EtfCode } from "@cce/shared";
import { Chip, Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";
import { useToastCtx } from "../lib/ToastContext";

export default function EtfPage() {
  const { lang, t } = useLang();
  const { etfs } = useMarket();
  const { portfolio, refresh } = useAccount();
  const { showToast } = useToastCtx();

  const [sel, setSel] = useState<EtfCode>("OLEA");
  const [side, setSide] = useState<"subscribe" | "redeem">("subscribe");
  const [units, setUnits] = useState(100);
  const [submitting, setSubmitting] = useState(false);

  const etf = ETFS[sel];
  const q = etfs[sel];
  const owned = portfolio?.positions.filter((p: any) => p.assetClass === "etf" && p.code === sel).reduce((s: number, p: any) => s + p.units, 0) ?? 0;
  const cost = q ? q.nav * units : 0;

  async function submit() {
    if (!portfolio?.ackOnFile) return showToast({ kind: "warn", msg: t.trade.ackWarn });
    setSubmitting(true);
    try {
      const order = await api.submitEtf({ code: sel, side, units });
      if (order.status === "rejected") showToast({ kind: "warn", msg: rejectionMessage(t, order) });
      else showToast({ kind: "ok", msg: `${order.id} — ${side === "subscribe" ? t.etf.subscribe : t.etf.redeem} ${units} ${t.etf.units} ${sel} @ ${order.fillPx} TND (NAV)` });
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
        {Object.values(ETFS).map((e) => {
          const eq = etfs[e.code];
          const active = sel === e.code;
          return (
            <button key={e.code} onClick={() => setSel(e.code as EtfCode)} style={{ background: active ? T.panelUp : T.panel, border: `1px solid ${active ? e.accent : T.line}`, borderRadius: 6, padding: "10px 14px", textAlign: "start", minWidth: 260, fontFamily: "inherit", color: T.text }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{e.name[lang]}</span>
                <span style={{ color: e.accent, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>{e.code}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, alignItems: "baseline" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18 }}>{eq ? eq.nav.toFixed(3) : "—"} <span style={{ fontSize: 11, color: T.muted }}>TND</span></span>
                {eq && (
                  <span style={{ color: eq.chgPct >= 0 ? T.up : T.down, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                    {eq.chgPct >= 0 ? "+" : ""}
                    {eq.chgPct.toFixed(2)} %
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="g2" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Panel title={etf.name[lang]} right={<Chip color={etf.accent} border={etf.accent + "55"}>{t.etf.nav}: {q ? q.nav.toFixed(3) : "—"} TND</Chip>}>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 12 }}>{etf.description[lang]}</div>
          <Row label={t.etf.basket} value={`${FUTURES[etf.underlying].name[lang]} — ${(etf.weights.front * 100).toFixed(0)}% / ${((etf.weights.second ?? 0) * 100).toFixed(0)}%`} />
          <Row label={t.etf.creationUnit} value={`${etf.creationUnit.toLocaleString(lang)} ${t.etf.units}`} />
          <Row label={t.etf.fee} value={`${(etf.managementFeeBps / 100).toFixed(2)} %`} />
          <Row label={lang === "ar" ? "قيمة الإصدار" : lang === "en" ? "Inception NAV" : "VL d'origine"} value={`${etf.inceptionNav.toFixed(3)} TND`} />
          <div style={{ marginTop: 12, fontSize: 12, color: T.faint, lineHeight: 1.6 }}>{t.etf.mechanism}</div>
        </Panel>

        <Panel title={t.trade.orderTicket}>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {(["subscribe", "redeem"] as const).map((s) => (
              <button key={s} onClick={() => setSide(s)} style={{ flex: 1, padding: "10px 0", borderRadius: 4, fontWeight: 600, fontSize: 13, fontFamily: "inherit", background: side === s ? (s === "subscribe" ? T.up : T.down) : "transparent", color: side === s ? "#0c130e" : T.muted, border: `1px solid ${side === s ? "transparent" : T.line}`, textTransform: "capitalize" }}>
                {s === "subscribe" ? t.etf.subscribe : t.etf.redeem}
              </button>
            ))}
          </div>
          <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.etf.units}</label>
          <input type="number" min={1} value={units} onChange={(e) => setUnits(Math.max(1, +e.target.value || 1))} style={{ width: "100%", margin: "5px 0 12px", background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }} />
          <div style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 12, marginBottom: 12 }}>
            <Row label={t.trade.notional} value={`${cost.toLocaleString(lang, { maximumFractionDigits: 2 })} TND`} strong color={etf.accent} />
            <Row label={lang === "ar" ? "الحصص المملوكة" : lang === "en" ? "Units held" : "Parts détenues"} value={owned.toLocaleString(lang)} />
          </div>
          <label style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 12, fontSize: 11.5, color: T.muted, lineHeight: 1.5 }}>
            <input type="checkbox" checked={Boolean(portfolio?.ackOnFile)} readOnly style={{ marginTop: 2 }} />
            <span>{t.trade.ackTxt} ({lang === "ar" ? "يُضبط من صفحة الأسواق" : lang === "en" ? "set from the Markets page" : "réglé depuis la page Marchés"})</span>
          </label>
          <button onClick={submit} disabled={submitting} style={{ width: "100%", padding: "12px 0", borderRadius: 4, border: "none", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: side === "subscribe" ? T.up : T.down, color: "#0c130e", opacity: submitting ? 0.6 : 1 }}>
            {side === "subscribe" ? t.etf.subscribe : t.etf.redeem} — {units} × {sel}
          </button>
        </Panel>
      </div>
    </div>
  );
}
