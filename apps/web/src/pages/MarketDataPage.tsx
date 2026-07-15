import { Chip, Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";

const ENDPOINTS: { method: string; path: string }[] = [
  { method: "GET", path: "/api/markets" },
  { method: "GET", path: "/api/markets/:code/:maturity/history?days=90" },
  { method: "GET", path: "/api/options/:code/:maturity/chain" },
  { method: "GET", path: "/api/swaps/:code/:tenor" },
  { method: "WS", path: "/ws — real-time tick stream" },
];

export default function MarketDataPage() {
  const { t } = useLang();

  return (
    <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Panel title={t.marketData.historicalTitle}>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7 }}>{t.marketData.historicalTxt}</div>
      </Panel>

      <Panel title={t.marketData.apiTitle}>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>{t.marketData.apiTxt}</div>
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.faint, marginBottom: 6 }}>{t.marketData.endpointsTitle}</div>
        {ENDPOINTS.map((e) => (
          <div key={e.path} style={{ display: "flex", gap: 10, padding: "5px 0", borderBottom: `1px dashed ${T.line}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
            <Chip color={e.method === "WS" ? T.olive : T.up}>{e.method}</Chip>
            <span style={{ color: T.text, direction: "ltr" }}>{e.path}</span>
          </div>
        ))}
      </Panel>

      <Panel title={t.marketData.tiersTitle} style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {t.marketData.tiers.map((tier) => (
            <div key={tier.name} style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{tier.name}</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, lineHeight: 1.5 }}>{tier.latency}</div>
              <div style={{ fontSize: 11.5, color: T.olive, fontFamily: "'IBM Plex Mono', monospace" }}>{tier.price}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={t.marketData.paymentTitle}>
        {t.marketData.paymentMethods.map((m) => (
          <Row key={m} label={m} value="—" />
        ))}
      </Panel>

      <Panel title={t.marketData.providersTitle}>
        <div style={{ fontSize: 12, color: T.warn, lineHeight: 1.6, marginBottom: 10 }}>{t.marketData.providersTxt}</div>
        {t.marketData.providers.map((p) => (
          <div key={p} style={{ padding: "6px 0", borderBottom: `1px dashed ${T.line}`, fontSize: 12.5, color: T.text }}>
            {p}
          </div>
        ))}
      </Panel>
    </div>
  );
}
