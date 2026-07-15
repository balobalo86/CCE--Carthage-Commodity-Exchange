import { NavLink, Outlet } from "react-router-dom";
import { FUTURES } from "@cce/shared";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";
import { useToastCtx } from "../lib/ToastContext";
import { Chip } from "./Atoms";

const NAV_ITEMS: { key: keyof ReturnType<typeof useLang>["t"]["tabs"]; to: string }[] = [
  { key: "markets", to: "/" },
  { key: "options", to: "/options" },
  { key: "swaps", to: "/swaps" },
  { key: "etf", to: "/etf" },
  { key: "portfolio", to: "/portfolio" },
  { key: "specs", to: "/specs" },
  { key: "marketData", to: "/market-data" },
  { key: "participants", to: "/participants" },
  { key: "compliance", to: "/compliance" },
  { key: "help", to: "/help" },
];

export default function Layout() {
  const { lang, setLang, t } = useLang();
  const { quotes } = useMarket();
  const { toast } = useToastCtx();
  const isAr = lang === "ar";
  const arFont = isAr ? "'IBM Plex Sans Arabic', 'Instrument Sans', sans-serif" : "'Instrument Sans', system-ui, sans-serif";

  const tapeEntries = Object.values(FUTURES).flatMap((ct) =>
    ct.maturities.slice(0, 3).map((m) => quotes[`${ct.code}:${m}`]).filter(Boolean)
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: arFont, direction: t.dir }}>
      <div style={{ background: "#2a2113", borderBottom: "1px solid #4a3a1a", padding: "6px 16px", fontSize: 11.5, color: T.warn, textAlign: "center" }}>
        {t.risk}
      </div>

      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${T.line}`, gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, lineHeight: 1, direction: "ltr" }}>
              CCE<span style={{ color: T.olive }}>.</span>
            </div>
            <div style={{ fontSize: 10.5, color: T.muted, letterSpacing: isAr ? 0 : 1.4, textTransform: "uppercase", marginTop: 3 }}>{t.exchange}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="hdr-r" style={{ display: "inline-flex", gap: 8 }}>
            <Chip color={T.up} border="#2c4a38">
              ● {t.session}
            </Chip>
            <Chip>{t.clearing}</Chip>
            <Chip>{t.ccy}</Chip>
          </span>
          <span style={{ display: "inline-flex", gap: 4, border: `1px solid ${T.line}`, borderRadius: 4, padding: 2 }}>
            {(["fr", "ar", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{ background: lang === l ? T.olive : "transparent", color: lang === l ? "#121608" : T.muted, border: "none", borderRadius: 3, padding: "4px 9px", fontSize: 11.5, fontWeight: 600, fontFamily: "inherit" }}
              >
                {l === "fr" ? "FR" : l === "en" ? "EN" : "عربي"}
              </button>
            ))}
          </span>
        </div>
      </header>

      <div style={{ overflow: "hidden", borderBottom: `1px solid ${T.line}`, background: "#0a100c", direction: "ltr" }}>
        <div className="tape" style={{ display: "inline-flex", whiteSpace: "nowrap", animation: "tape 30s linear infinite", padding: "7px 0" }}>
          {[0, 1].map((rep) => (
            <span key={rep} style={{ display: "inline-flex", gap: 32, paddingRight: 32 }}>
              {tapeEntries.map((q, i) => {
                const d = q.last - q.ref;
                const accent = FUTURES[q.code].accent;
                return (
                  <span key={q.code + q.maturity + rep + i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                    <span style={{ color: accent, fontWeight: 600 }}>
                      {q.code}
                      {q.maturity}
                    </span>{" "}
                    <span>{q.last.toLocaleString("en-US")}</span>{" "}
                    <span style={{ color: d >= 0 ? T.up : T.down }}>
                      {d >= 0 ? "▲" : "▼"}
                      {Math.abs(d).toLocaleString("en-US")}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </div>
      </div>

      <nav style={{ display: "flex", gap: 4, padding: "10px 20px 0", flexWrap: "wrap" }}>
        {NAV_ITEMS.map(({ key, to }) => (
          <NavLink
            key={key}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              background: isActive ? T.panel : "transparent",
              color: isActive ? T.text : T.muted,
              border: `1px solid ${isActive ? T.line : "transparent"}`,
              borderRadius: "6px 6px 0 0",
              padding: "9px 15px",
              fontSize: 13,
              fontFamily: "inherit",
              fontWeight: 500,
              marginBottom: -1,
              textDecoration: "none",
              display: "inline-block",
            })}
          >
            {t.tabs[key]}
          </NavLink>
        ))}
      </nav>

      <main style={{ padding: 20, borderTop: `1px solid ${T.line}` }}>
        <Outlet />
      </main>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 22,
            left: "50%",
            transform: "translateX(-50%)",
            background: toast.kind === "ok" ? "#12271b" : "#2a2113",
            border: `1px solid ${toast.kind === "ok" ? "#2c4a38" : "#4a3a1a"}`,
            color: toast.kind === "ok" ? T.up : T.warn,
            borderRadius: 6,
            padding: "11px 18px",
            fontSize: 12.5,
            maxWidth: 560,
            lineHeight: 1.5,
            zIndex: 50,
            boxShadow: "0 8px 30px rgba(0,0,0,.45)",
          }}
        >
          {toast.msg}
        </div>
      )}

      <footer style={{ padding: "16px 20px 26px", borderTop: `1px solid ${T.line}`, marginTop: 8, fontSize: 11, color: T.faint, lineHeight: 1.6 }}>
        {t.footer} © 2026.
      </footer>
    </div>
  );
}
