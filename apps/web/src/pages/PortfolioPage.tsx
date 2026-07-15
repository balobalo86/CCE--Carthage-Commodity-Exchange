import { FUTURES, ETFS } from "@cce/shared";
import { Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";

export default function PortfolioPage() {
  const { lang, t } = useLang();
  const { portfolio } = useAccount();

  if (!portfolio) return <div style={{ color: T.faint, padding: 20 }}>…</div>;

  const label = (p: any) => {
    if (p.assetClass === "future") return `${p.code} — ${FUTURES[p.code].name[lang]} (${p.maturity})`;
    if (p.assetClass === "option") return `${p.code} ${p.optionType.toUpperCase()} ${p.strike} (${p.maturity})`;
    return `${p.code} — ${ETFS[p.code].name[lang]}`;
  };
  const entryLabel = (p: any) => (p.assetClass === "etf" ? p.entryNav : p.assetClass === "option" ? p.entryPremium : p.entryPx);
  const qtyLabel = (p: any) => (p.assetClass === "etf" ? p.units : p.lots);
  const sideLabel = (p: any) => (p.assetClass === "etf" ? "—" : p.side === "buy" ? t.common.buy : t.common.sell);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Panel title={t.portfolio.cash}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24 }}>
            {portfolio.cashTnd.toLocaleString(lang, { maximumFractionDigits: 0 })} <span style={{ fontSize: 12, color: T.muted }}>TND</span>
          </div>
        </Panel>
        <Panel title={t.portfolio.usedMargin}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, color: T.amber }}>
            {portfolio.usedMargin.toLocaleString(lang, { maximumFractionDigits: 0 })} <span style={{ fontSize: 12, color: T.muted }}>TND</span>
          </div>
        </Panel>
        <Panel title={t.portfolio.pnl}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, color: portfolio.pnl >= 0 ? T.up : T.down }}>
            {portfolio.pnl >= 0 ? "+" : ""}
            {portfolio.pnl.toLocaleString(lang, { maximumFractionDigits: 0 })} <span style={{ fontSize: 12, color: T.muted }}>TND</span>
          </div>
          <div style={{ fontSize: 11.5, color: T.faint, marginTop: 6 }}>{portfolio.pnl < 0 ? t.portfolio.marginCall : t.portfolio.noCall}</div>
        </Panel>
      </div>

      <Panel title={t.portfolio.positions}>
        {portfolio.positions.length === 0 ? (
          <div style={{ color: T.faint, fontSize: 13, padding: "20px 0", textAlign: "center" }}>—</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, fontFamily: "'IBM Plex Mono', monospace" }}>
              <thead>
                <tr style={{ color: T.faint, fontSize: 10.5, textAlign: "start" }}>
                  {[t.tabs.markets, t.common.side, t.common.qty, t.portfolio.entry, t.common.last, t.portfolio.pnl].map((h) => (
                    <th key={h} style={{ paddingBottom: 8, textAlign: "start" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.positions.map((p: any) => (
                  <tr key={p.idx} style={{ borderTop: `1px solid ${T.line}` }}>
                    <td style={{ padding: "8px 0" }}>{label(p)}</td>
                    <td style={{ color: p.side === "buy" ? T.up : T.down }}>{sideLabel(p)}</td>
                    <td>{qtyLabel(p)}</td>
                    <td>{entryLabel(p)}</td>
                    <td>{p.markPx}</td>
                    <td style={{ color: p.unrealizedPnl >= 0 ? T.up : T.down }}>
                      {p.unrealizedPnl >= 0 ? "+" : ""}
                      {p.unrealizedPnl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title={t.trade.orders}>
        {portfolio.orders.length === 0 ? (
          <div style={{ color: T.faint, fontSize: 13, padding: "20px 0", textAlign: "center" }}>{t.trade.noOrders}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
              <thead>
                <tr style={{ color: T.faint, fontSize: 10.5, textAlign: "start" }}>
                  {["N°", t.common.side, t.common.qty, t.common.price, t.common.status].map((h) => (
                    <th key={h} style={{ paddingBottom: 8, textAlign: "start" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.orders.map((o: any) => (
                  <tr key={o.id} style={{ borderTop: `1px solid ${T.line}` }}>
                    <td style={{ padding: "7px 0", color: T.muted }}>
                      {o.id} — {o.code}
                      {o.maturity ?? ""}
                    </td>
                    <td style={{ color: o.side === "buy" ? T.up : T.down }}>{o.side === "buy" ? t.common.buy : t.common.sell}</td>
                    <td>{o.qty}</td>
                    <td>{o.fillPx ?? "—"}</td>
                    <td style={{ color: o.status === "filled" ? T.up : T.down }}>{o.status === "filled" ? t.common.filled : t.common.rejected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
