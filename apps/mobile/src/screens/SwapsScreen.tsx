import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FUTURES, rejectionMessage, swapInitialMargin, SWAPS, type Side, type SwapCode } from "@cce/shared";
import { Chip, Panel, Row, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/AccountContext";
import { useLang } from "../lib/LangContext";

export default function SwapsScreen() {
  const { lang, t } = useLang();
  const { portfolio, refresh } = useAccount();

  const [sel, setSel] = useState<SwapCode>("HOV-SWAP");
  const swap = SWAPS[sel];
  const [tenorMonths, setTenorMonths] = useState(swap.tenorsMonths[0]);
  const [quote, setQuote] = useState<{ fixedRate: number; referenceMaturity: string } | null>(null);
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);

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

  const qtyNum = Math.max(1, +qty || 1);
  const notionalTonnes = future.tonnes * qtyNum;
  const margin = quote ? swapInitialMargin(notionalTonnes, quote.fixedRate, future.marginRate, tenorMonths) : 0;

  async function submit() {
    if (!portfolio?.ackOnFile) return setMsg(t.trade.ackWarn);
    try {
      const order = await api.submitSwap({ code: sel, tenorMonths, side, qty: qtyNum });
      setMsg(order.status === "rejected" ? rejectionMessage(t, order) : `${order.id} — ${side === "buy" ? t.swap.payFixed : t.swap.receiveFixed} @ ${order.fillPx} TND/t`);
      refresh();
    } catch (e: any) {
      setMsg(e.message);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {Object.values(SWAPS).map((s) => (
          <TouchableOpacity key={s.code} onPress={() => setSel(s.code as SwapCode)} style={[styles.pill, { flex: 1, borderColor: sel === s.code ? s.accent : T.line, backgroundColor: sel === s.code ? T.panelUp : T.panel }]}>
            <Text style={{ color: s.accent, fontFamily: monoFont, fontSize: 12 }}>{s.code}</Text>
            <Text style={{ color: T.text, fontSize: 12 }} numberOfLines={1}>{s.name[lang]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Panel title={swap.name[lang]} right={<Chip color={swap.accent} border={swap.accent + "55"}>{t.swap.fixedRate}: {quote ? quote.fixedRate.toFixed(0) : "—"}</Chip>}>
        <Text style={{ color: T.muted, fontSize: 12.5, lineHeight: 18, marginBottom: 10 }}>{swap.description[lang]}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {swap.tenorsMonths.map((m) => (
            <TouchableOpacity key={m} onPress={() => setTenorMonths(m)} style={[styles.tenorPill, { backgroundColor: tenorMonths === m ? swap.accent : "transparent", borderColor: tenorMonths === m ? swap.accent : T.line }]}>
              <Text style={{ color: tenorMonths === m ? "#101408" : T.muted, fontSize: 12, fontFamily: monoFont }}>{m} {t.swap.months}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {quote && <Row label={t.swap.referenceMaturity} value={`${swap.underlying}${quote.referenceMaturity}`} />}
      </Panel>

      <Panel title={t.trade.orderTicket}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {(["buy", "sell"] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => setSide(s)} style={[styles.pill, { flex: 1, alignItems: "center", backgroundColor: side === s ? (s === "buy" ? T.up : T.down) : "transparent", borderColor: side === s ? "transparent" : T.line }]}>
              <Text style={{ color: side === s ? "#0c130e" : T.muted, fontWeight: "600" }}>{s === "buy" ? t.swap.payFixed : t.swap.receiveFixed}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>{t.common.qty} ({t.common.lots})</Text>
        <TextInput keyboardType="numeric" value={qty} onChangeText={setQty} style={styles.input} />
        <Row label={t.swap.notional} value={`${notionalTonnes.toLocaleString(lang)} t`} />
        <Row label={t.trade.margin} value={`${margin.toLocaleString(lang, { maximumFractionDigits: 0 })} TND`} color={swap.accent} />
        <TouchableOpacity onPress={submit} disabled={!quote} style={[styles.submitBtn, { backgroundColor: side === "buy" ? T.up : T.down, marginTop: 12 }]}>
          <Text style={{ color: "#0c130e", fontWeight: "700" }}>{t.common.submit}</Text>
        </TouchableOpacity>
        {msg && <Text style={{ color: T.warn, fontSize: 11.5, marginTop: 8 }}>{msg}</Text>}
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pill: { borderWidth: 1, borderRadius: 6, padding: 10 },
  tenorPill: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 11, paddingVertical: 6 },
  label: { color: T.muted, fontSize: 11, textTransform: "uppercase", marginBottom: 5 },
  input: { backgroundColor: T.panelUp, color: T.text, borderWidth: 1, borderColor: T.line, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, fontFamily: monoFont, marginBottom: 12 },
  submitBtn: { paddingVertical: 12, borderRadius: 4, alignItems: "center" },
});
