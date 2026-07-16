import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FUTURES, type FutureCode } from "@cce/shared";
import { Chip, Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { useLang } from "../lib/LangContext";

const ENDPOINTS: { method: string; path: string }[] = [
  { method: "GET", path: "/api/markets" },
  { method: "GET", path: "/api/markets/:code/:maturity/history?days=90" },
  { method: "GET", path: "/api/options/:code/:maturity/chain" },
  { method: "GET", path: "/api/swaps/:code/:tenor" },
  { method: "WS", path: "/ws — real-time tick stream" },
];

function randomHex(bytes: number) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function HistoricalChart() {
  const { lang, t } = useLang();
  const [sel, setSel] = useState<FutureCode>("HOV");
  const [maturity, setMaturity] = useState(FUTURES.HOV.maturities[0]);
  const [history, setHistory] = useState<{ date: string; settle: number }[]>([]);
  const future = FUTURES[sel];

  useEffect(() => {
    if (!FUTURES[sel].maturities.includes(maturity)) setMaturity(FUTURES[sel].maturities[0]);
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    api.history(sel, maturity, 90).then(setHistory).catch(() => setHistory([]));
  }, [sel, maturity]);

  function downloadCsv() {
    const rows = ["date,settle", ...history.map((h) => `${h.date},${h.settle}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sel}-${maturity}-settlement.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Panel
      title={t.marketData.chartTitle}
      right={
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.values(FUTURES).map((ct) => (
              <button
                key={ct.code}
                onClick={() => setSel(ct.code as FutureCode)}
                style={{ background: sel === ct.code ? T.panelUp : "transparent", border: `1px solid ${sel === ct.code ? ct.accent : T.line}`, borderRadius: 4, padding: "4px 10px", fontSize: 11.5, color: T.text, fontFamily: "inherit" }}
              >
                {ct.code}
              </button>
            ))}
          </div>
          <select value={maturity} onChange={(e) => setMaturity(e.target.value)} style={{ background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "5px 8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5 }}>
            {future.maturities.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <button onClick={downloadCsv} disabled={!history.length} style={{ background: "transparent", border: `1px solid ${T.line}`, borderRadius: 4, padding: "5px 10px", fontSize: 11.5, color: T.olive, fontFamily: "inherit" }}>
            {t.marketData.downloadCsv}
          </button>
        </div>
      }
    >
      <div style={{ height: 220, direction: "ltr" }}>
        <ResponsiveContainer>
          <LineChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="date" tick={{ fill: T.muted, fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={{ stroke: T.line }} tickLine={false} minTickGap={40} />
            <YAxis width={62} tick={{ fill: T.muted, fontSize: 11, fontFamily: "IBM Plex Mono" }} tickFormatter={(v) => v.toLocaleString("en-US")} axisLine={{ stroke: T.line }} tickLine={false} domain={["dataMin - 200", "dataMax + 200"]} />
            <Tooltip
              contentStyle={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, fontSize: 12, fontFamily: "IBM Plex Mono" }}
              formatter={(v: number) => [`${v.toLocaleString("en-US")} TND/t`, t.common.settle]}
            />
            <Line type="monotone" dataKey="settle" stroke={future.accent} strokeWidth={1.8} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 8, fontSize: 11.5, color: T.faint }}>{sel}{maturity} · {history.length} {lang === "ar" ? "يوم" : lang === "en" ? "days" : "jours"}</div>
    </Panel>
  );
}

function ApiKeyPanel() {
  const { t } = useLang();
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);

  return (
    <Panel title={t.marketData.apiKeyTitle}>
      <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>{t.marketData.apiKeyTxt}</div>
      {!user ? (
        <div style={{ fontSize: 12.5, color: T.warn }}>
          {t.marketData.apiKeyLoginPrompt} <Link to="/sign-in" style={{ color: T.olive }}>{t.auth.signIn}</Link>
        </div>
      ) : apiKey ? (
        <div style={{ background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: T.olive, direction: "ltr", wordBreak: "break-all" }}>
          {apiKey}
        </div>
      ) : (
        <button
          onClick={() => setApiKey(`cce_demo_${randomHex(20)}`)}
          style={{ background: T.olive, border: "none", borderRadius: 4, padding: "9px 14px", fontSize: 12.5, fontWeight: 600, color: "#121608", fontFamily: "inherit" }}
        >
          {t.marketData.apiKeyBtn}
        </button>
      )}
    </Panel>
  );
}

export default function MarketDataPage() {
  const { t } = useLang();

  return (
    <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <HistoricalChart />

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

      <ApiKeyPanel />

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
