import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ETFS, FUTURES, SWAPS } from "@cce/shared";
import { Chip, Panel } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";

function ProductCard({ to, accent, title, code, children }: { to: string; accent: string; title: string; code: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        background: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: 8,
        padding: 16,
        textDecoration: "none",
        color: T.text,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 14.5 }}>{title}</span>
        <span style={{ color: accent, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{code}</span>
      </div>
      {children}
    </Link>
  );
}

export default function MarketsPage() {
  const { lang, t } = useLang();
  const { quotes, etfs } = useMarket();
  const [swapQuotes, setSwapQuotes] = useState<Record<string, { fixedRate: number } | null>>({});

  useEffect(() => {
    let cancelled = false;
    function poll() {
      Promise.all(Object.values(SWAPS).map((s) => api.swap(s.code, s.tenorsMonths[0]).catch(() => null))).then((results) => {
        if (cancelled) return;
        const byCode: Record<string, { fixedRate: number } | null> = {};
        Object.values(SWAPS).forEach((s, i) => (byCode[s.code] = results[i]));
        setSwapQuotes(byCode);
      });
    }
    poll();
    const id = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ padding: "8px 0 4px" }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, marginBottom: 6 }}>{t.exchange}</div>
        <div style={{ color: T.muted, fontSize: 14, maxWidth: 640, lineHeight: 1.6 }}>{t.tagline}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Chip color={T.up} border="#2c4a38">● {t.session}</Chip>
          <Chip>{t.clearing}</Chip>
          <Chip>{t.ccy}</Chip>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: T.faint, marginBottom: 10 }}>{t.home.productsTitle}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <ProductCard to="/futures" accent={T.olive} title={t.tabs.futures} code={Object.values(FUTURES).map((f) => f.code).join(" · ")}>
            {Object.values(FUTURES).map((ct) => {
              const front = quotes[`${ct.code}:${ct.maturities[0]}`];
              const d = front ? front.last - front.ref : 0;
              return (
                <div key={ct.code} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12.5 }}>
                  <span style={{ color: T.muted }}>{ct.name[lang]}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {front ? front.last.toLocaleString("en-US") : "—"}{" "}
                    <span style={{ color: d >= 0 ? T.up : T.down }}>{front ? (d >= 0 ? "▲" : "▼") : ""}</span>
                  </span>
                </div>
              );
            })}
            <div style={{ marginTop: 10, fontSize: 11, color: T.faint }}>{t.home.explore} →</div>
          </ProductCard>

          <ProductCard to="/options" accent="#c98a3c" title={t.tabs.options} code={t.options.model}>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.6 }}>{t.home.optionsTeaser}</div>
            <div style={{ marginTop: 10, fontSize: 11, color: T.faint }}>{t.home.explore} →</div>
          </ProductCard>

          <ProductCard to="/swaps" accent="#aebe45" title={t.tabs.swaps} code={Object.values(SWAPS).map((s) => s.code).join(" · ")}>
            {Object.values(SWAPS).map((s) => {
              const q = swapQuotes[s.code];
              return (
                <div key={s.code} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12.5 }}>
                  <span style={{ color: T.muted }}>{s.name[lang]}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{q ? q.fixedRate.toLocaleString("en-US") : "—"}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 10, fontSize: 11, color: T.faint }}>{t.home.explore} →</div>
          </ProductCard>

          <ProductCard to="/etf" accent="#4b9fd6" title={t.tabs.etf} code={Object.values(ETFS).map((e) => e.code).join(" · ")}>
            {Object.values(ETFS).map((e) => (
              <div key={e.code} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12.5 }}>
                <span style={{ color: T.muted }}>{e.name[lang]}</span>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{etfs[e.code]?.nav.toFixed(3) ?? "—"}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, fontSize: 11, color: T.faint }}>{t.home.explore} →</div>
          </ProductCard>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: T.faint, marginBottom: 10 }}>{t.home.resourcesTitle}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          {(
            [
              ["/specs", t.tabs.specs],
              ["/market-data", t.tabs.marketData],
              ["/participants", t.tabs.participants],
              ["/compliance", t.tabs.compliance],
              ["/help", t.tabs.help],
            ] as const
          ).map(([to, label]) => (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <Panel style={{ height: "100%" }}>
                <div style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{label}</div>
              </Panel>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
