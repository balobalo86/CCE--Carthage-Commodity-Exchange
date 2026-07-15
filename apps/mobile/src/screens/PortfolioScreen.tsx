import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FUTURES, ETFS, SWAPS } from "@cce/shared";
import { Panel, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { useAccount } from "../lib/AccountContext";
import { useLang } from "../lib/LangContext";

export default function PortfolioScreen() {
  const { lang, t } = useLang();
  const { portfolio } = useAccount();

  if (!portfolio) return <View style={{ flex: 1, backgroundColor: T.bg }} />;

  const label = (p: any) => {
    if (p.assetClass === "future") return `${p.code} ${p.maturity}`;
    if (p.assetClass === "option") return `${p.code} ${p.optionType.toUpperCase()} ${p.strike}`;
    if (p.assetClass === "swap") return `${p.code} — ${SWAPS[p.code].name[lang]} (${p.tenorMonths}${t.swap.months})`;
    return `${p.code} — ${ETFS[p.code].name[lang]}`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Panel title={t.portfolio.cash} style={{ flex: 1 }}>
          <Text style={{ color: T.text, fontFamily: monoFont, fontSize: 18 }}>{portfolio.cashTnd.toLocaleString(lang, { maximumFractionDigits: 0 })}</Text>
        </Panel>
        <Panel title={t.portfolio.pnl} style={{ flex: 1 }}>
          <Text style={{ color: portfolio.pnl >= 0 ? T.up : T.down, fontFamily: monoFont, fontSize: 18 }}>
            {portfolio.pnl >= 0 ? "+" : ""}
            {portfolio.pnl.toLocaleString(lang, { maximumFractionDigits: 0 })}
          </Text>
        </Panel>
      </View>

      <Panel title={t.portfolio.usedMargin}>
        <Text style={{ color: T.amber, fontFamily: monoFont, fontSize: 18 }}>{portfolio.usedMargin.toLocaleString(lang, { maximumFractionDigits: 0 })} TND</Text>
      </Panel>

      <Panel title={t.portfolio.positions}>
        {portfolio.positions.length === 0 ? (
          <Text style={{ color: T.faint, textAlign: "center", paddingVertical: 10 }}>—</Text>
        ) : (
          portfolio.positions.map((p: any) => (
            <View key={p.idx} style={styles.posRow}>
              <Text style={{ color: T.text, flex: 1, fontSize: 12.5 }}>{label(p)}</Text>
              <Text style={{ color: p.unrealizedPnl >= 0 ? T.up : T.down, fontFamily: monoFont, fontSize: 12.5 }}>
                {p.unrealizedPnl >= 0 ? "+" : ""}
                {p.unrealizedPnl}
              </Text>
            </View>
          ))
        )}
      </Panel>

      <Panel title={t.trade.orders}>
        {portfolio.orders.length === 0 ? (
          <Text style={{ color: T.faint, textAlign: "center", paddingVertical: 10 }}>{t.trade.noOrders}</Text>
        ) : (
          portfolio.orders.slice(0, 15).map((o: any) => (
            <View key={o.id} style={styles.posRow}>
              <Text style={{ color: T.muted, flex: 1, fontSize: 12 }}>
                {o.id} — {o.code}
                {o.maturity ?? ""}
              </Text>
              <Text style={{ color: o.status === "filled" ? T.up : T.down, fontSize: 12 }}>{o.status === "filled" ? t.common.filled : t.common.rejected}</Text>
            </View>
          ))
        )}
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  posRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: T.line },
});
