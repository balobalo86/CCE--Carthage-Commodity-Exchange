import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ETFS, type EtfCode } from "@cce/shared";
import { Chip, Panel, Row, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";

export default function EtfScreen() {
  const { lang, t } = useLang();
  const { etfs } = useMarket();
  const { portfolio, refresh } = useAccount();

  const [sel, setSel] = useState<EtfCode>("OLEA");
  const [side, setSide] = useState<"subscribe" | "redeem">("subscribe");
  const [units, setUnits] = useState("100");
  const [msg, setMsg] = useState<string | null>(null);

  const etf = ETFS[sel];
  const q = etfs[sel];

  async function submit() {
    if (!portfolio?.ackOnFile) return setMsg(t.trade.ackWarn);
    try {
      const order = await api.submitEtf({ code: sel, side, units: Math.max(1, +units || 1) });
      setMsg(order.status === "rejected" ? order.rejectReason ?? "Rejected" : `${order.id} @ NAV ${order.fillPx}`);
      refresh();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {Object.values(ETFS).map((e) => (
          <TouchableOpacity key={e.code} onPress={() => setSel(e.code as EtfCode)} style={[styles.pill, { flex: 1, borderColor: sel === e.code ? e.accent : T.line, backgroundColor: sel === e.code ? T.panelUp : T.panel }]}>
            <Text style={{ color: e.accent, fontFamily: monoFont, fontSize: 12 }}>{e.code}</Text>
            <Text style={{ color: T.text, fontSize: 12 }}>{etfs[e.code]?.nav.toFixed(3) ?? "—"} TND</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Panel title={etf.name[lang]} right={<Chip color={etf.accent} border={etf.accent + "55"}>{t.etf.nav}: {q?.nav.toFixed(3) ?? "—"}</Chip>}>
        <Text style={{ color: T.muted, fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>{etf.description[lang]}</Text>
        <Row label={t.etf.fee} value={`${(etf.managementFeeBps / 100).toFixed(2)} %`} />
        <Row label={t.etf.creationUnit} value={`${etf.creationUnit.toLocaleString(lang)} ${t.etf.units}`} />
      </Panel>

      <Panel title={t.trade.orderTicket}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {(["subscribe", "redeem"] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => setSide(s)} style={[styles.pill, { flex: 1, alignItems: "center", backgroundColor: side === s ? (s === "subscribe" ? T.up : T.down) : "transparent", borderColor: side === s ? "transparent" : T.line }]}>
              <Text style={{ color: side === s ? "#0c130e" : T.muted, fontWeight: "600" }}>{s === "subscribe" ? t.etf.subscribe : t.etf.redeem}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>{t.etf.units}</Text>
        <TextInput keyboardType="numeric" value={units} onChangeText={setUnits} style={styles.input} />
        <TouchableOpacity onPress={submit} style={[styles.submitBtn, { backgroundColor: side === "subscribe" ? T.up : T.down }]}>
          <Text style={{ color: "#0c130e", fontWeight: "700" }}>{side === "subscribe" ? t.etf.subscribe : t.etf.redeem}</Text>
        </TouchableOpacity>
        {msg && <Text style={{ color: T.warn, fontSize: 11.5, marginTop: 8 }}>{msg}</Text>}
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pill: { borderWidth: 1, borderRadius: 6, padding: 10 },
  label: { color: T.muted, fontSize: 11, textTransform: "uppercase", marginBottom: 5 },
  input: { backgroundColor: T.panelUp, color: T.text, borderWidth: 1, borderColor: T.line, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, fontFamily: monoFont, marginBottom: 12 },
  submitBtn: { paddingVertical: 12, borderRadius: 4, alignItems: "center" },
});
