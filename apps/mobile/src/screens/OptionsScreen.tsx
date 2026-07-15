import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FUTURES, type FutureCode, type OptionType, type Side } from "@cce/shared";
import { Chip, Panel, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";

export default function OptionsScreen() {
  const { lang, t } = useLang();
  const { portfolio, refresh } = useAccount();

  const [sel, setSel] = useState<FutureCode>("HOV");
  const [maturity, setMaturity] = useState(FUTURES.HOV.maturities[0]);
  const [chain, setChain] = useState<any[]>([]);
  const [picked, setPicked] = useState<{ strike: number; optionType: OptionType } | null>(null);
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);

  const future = FUTURES[sel];

  useEffect(() => {
    if (!FUTURES[sel].maturities.includes(maturity)) setMaturity(FUTURES[sel].maturities[0]);
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    const poll = () => api.optionChain(sel, maturity, 4).then((r) => !cancelled && setChain(r)).catch(() => {});
    poll();
    const id = setInterval(poll, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [sel, maturity]);

  async function submit() {
    if (!picked) return;
    if (!portfolio?.ackOnFile) return setMsg(t.trade.ackWarn);
    try {
      const order = await api.submitOption({ code: sel, maturity, strike: picked.strike, optionType: picked.optionType, side, qty: Math.max(1, +qty || 1) });
      setMsg(order.status === "rejected" ? order.rejectReason ?? "Rejected" : `${order.id} @ ${order.fillPx} TND/t`);
      refresh();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {Object.values(FUTURES).map((ct) => (
          <TouchableOpacity key={ct.code} onPress={() => setSel(ct.code as FutureCode)} style={[styles.pill, { borderColor: sel === ct.code ? ct.accent : T.line, backgroundColor: sel === ct.code ? T.panelUp : T.panel }]}>
            <Text style={{ color: ct.accent, fontFamily: monoFont, fontSize: 12 }}>{ct.code}</Text>
          </TouchableOpacity>
        ))}
        <Chip>{maturity}</Chip>
      </View>

      <Panel title={t.options.chain}>
        {chain.map((row) => (
          <View key={row.strike} style={styles.chainRow}>
            <TouchableOpacity onPress={() => setPicked({ strike: row.strike, optionType: "call" })} style={{ flex: 1, backgroundColor: picked !== null && picked.strike === row.strike && picked.optionType === "call" ? T.panelUp : "transparent", padding: 6, borderRadius: 4 }}>
              <Text style={{ color: T.up, fontFamily: monoFont }}>{row.call?.premium ?? "—"}</Text>
            </TouchableOpacity>
            <Text style={{ color: T.text, fontFamily: monoFont, width: 70, textAlign: "center" }}>{row.strike.toLocaleString("en-US")}</Text>
            <TouchableOpacity onPress={() => setPicked({ strike: row.strike, optionType: "put" })} style={{ flex: 1, backgroundColor: picked !== null && picked.strike === row.strike && picked.optionType === "put" ? T.panelUp : "transparent", padding: 6, borderRadius: 4, alignItems: "flex-end" }}>
              <Text style={{ color: T.down, fontFamily: monoFont }}>{row.put?.premium ?? "—"}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Panel>

      {picked && (
        <Panel title={t.trade.orderTicket} right={<Chip color={picked.optionType === "call" ? T.up : T.down}>{picked.optionType.toUpperCase()} {picked.strike}</Chip>}>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {(["buy", "sell"] as const).map((s) => (
              <TouchableOpacity key={s} onPress={() => setSide(s)} style={[styles.pill, { flex: 1, alignItems: "center", backgroundColor: side === s ? (s === "buy" ? T.up : T.down) : "transparent", borderColor: side === s ? "transparent" : T.line }]}>
                <Text style={{ color: side === s ? "#0c130e" : T.muted, fontWeight: "600" }}>{s === "buy" ? t.common.buy : t.common.sell}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>{t.common.qty}</Text>
          <TextInput keyboardType="numeric" value={qty} onChangeText={setQty} style={styles.input} />
          <TouchableOpacity onPress={submit} style={[styles.submitBtn, { backgroundColor: side === "buy" ? T.up : T.down }]}>
            <Text style={{ color: "#0c130e", fontWeight: "700" }}>{t.common.submit}</Text>
          </TouchableOpacity>
          {msg && <Text style={{ color: T.warn, fontSize: 11.5, marginTop: 8 }}>{msg}</Text>}
        </Panel>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pill: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 },
  chainRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: T.line },
  label: { color: T.muted, fontSize: 11, textTransform: "uppercase", marginBottom: 5, marginTop: 4 },
  input: { backgroundColor: T.panelUp, color: T.text, borderWidth: 1, borderColor: T.line, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, fontFamily: monoFont, marginBottom: 12 },
  submitBtn: { paddingVertical: 12, borderRadius: 4, alignItems: "center" },
});
