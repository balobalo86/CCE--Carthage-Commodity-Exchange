import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FUTURES, priceBand, rejectionMessage, type FutureCode, type OrderKind, type Side } from "@cce/shared";
import { Chip, Panel, Row, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { api } from "../lib/api";
import { useAccount } from "../lib/useAccount";
import { useLang } from "../lib/LangContext";
import { useMarket } from "../lib/MarketContext";
import { useToastCtx } from "../lib/ToastContext";
import { sparkline } from "../lib/sparkline";

export default function MarketsScreen() {
  const { lang, t } = useLang();
  const { quotes } = useMarket();
  const { portfolio, refresh } = useAccount();
  const { showToast } = useToastCtx();

  const [sel, setSel] = useState<FutureCode>("HOV");
  const [maturity, setMaturity] = useState(FUTURES.HOV.maturities[0]);
  const [side, setSide] = useState<Side>("buy");
  const [qty, setQty] = useState("1");
  const [ordType, setOrdType] = useState<OrderKind>("market");
  const [limitPx, setLimitPx] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const future = FUTURES[sel];
  const quote = quotes[`${sel}:${maturity}`];
  const band = quote ? priceBand(quote.ref) : { lo: 0, hi: 0, pct: 0.03 };

  useEffect(() => {
    if (!FUTURES[sel].maturities.includes(maturity)) setMaturity(FUTURES[sel].maturities[0]);
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleAck() {
    await api.setAck(!portfolio?.ackOnFile).catch(() => {});
    refresh();
  }

  async function submit() {
    if (!portfolio?.ackOnFile) return showToast({ kind: "warn", msg: t.trade.ackWarn });
    setSubmitting(true);
    try {
      const order = await api.submitFuture({ code: sel, maturity, side, kind: ordType, qty: Math.max(1, +qty || 1), limitPx: ordType === "limit" ? +limitPx || undefined : undefined });
      if (order.status === "rejected") showToast({ kind: "warn", msg: rejectionMessage(t, order, { lo: String(band.lo), hi: String(band.hi) }) });
      else showToast({ kind: "ok", msg: `${order.id} — ${side === "buy" ? t.common.buy : t.common.sell} ${qty} × ${sel} @ ${order.fillPx}` });
      refresh();
    } catch (e: any) {
      showToast({ kind: "warn", msg: e.message ?? "Order failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {Object.values(FUTURES).map((ct) => {
          const active = sel === ct.code;
          return (
            <TouchableOpacity key={ct.code} onPress={() => setSel(ct.code as FutureCode)} style={[styles.contractBtn, { borderColor: active ? ct.accent : T.line, backgroundColor: active ? T.panelUp : T.panel }]}>
              <Text style={{ color: ct.accent, fontFamily: monoFont, fontSize: 11 }}>{ct.code}</Text>
              <Text style={{ color: T.text, fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                {ct.name[lang]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Panel
        title={`${future.name[lang]} — ${maturity}`}
        right={quote ? <Chip color={quote.last - quote.ref >= 0 ? T.up : T.down}>{quote.last.toLocaleString("en-US")}</Chip> : undefined}
      >
        {quote && (
          <>
            <Text style={{ color: future.accent, fontFamily: monoFont, fontSize: 20, letterSpacing: 1 }}>{sparkline(quote.history.map((h) => h.p))}</Text>
            <View style={{ marginTop: 8 }}>
              <Row label={t.common.settle} value={quote.ref.toLocaleString("en-US")} />
              <Row label={`${t.common.high} / ${t.common.low}`} value={`${quote.hi.toLocaleString("en-US")} / ${quote.lo.toLocaleString("en-US")}`} />
              <Row label={t.common.vol} value={quote.vol} />
              <Row label={t.common.oi} value={quote.oi} />
              <Row label={t.trade.bands} value={`${band.lo.toLocaleString("en-US")} – ${band.hi.toLocaleString("en-US")}`} />
            </View>
          </>
        )}
        <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {future.maturities.map((m) => (
            <TouchableOpacity key={m} onPress={() => setMaturity(m)} style={[styles.matBtn, { borderColor: maturity === m ? future.accent : T.line, backgroundColor: maturity === m ? future.accent : "transparent" }]}>
              <Text style={{ color: maturity === m ? "#101408" : T.muted, fontFamily: monoFont, fontSize: 11 }}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Panel>

      <Panel title={t.trade.orderTicket}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {(["buy", "sell"] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => setSide(s)} style={[styles.sideBtn, { backgroundColor: side === s ? (s === "buy" ? T.up : T.down) : "transparent", borderColor: side === s ? "transparent" : T.line }]}>
              <Text style={{ color: side === s ? "#0c130e" : T.muted, fontWeight: "600" }}>{s === "buy" ? t.common.buy : t.common.sell}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {([["market", t.trade.market], ["limit", t.trade.limit]] as const).map(([k, lbl]) => (
            <TouchableOpacity key={k} onPress={() => setOrdType(k)} style={[styles.matBtn, { flex: 1, alignItems: "center", borderColor: ordType === k ? T.faint : T.line, backgroundColor: ordType === k ? T.panelUp : "transparent" }]}>
              <Text style={{ color: T.text, fontSize: 12 }}>{lbl}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t.common.qty}</Text>
            <TextInput keyboardType="numeric" value={qty} onChangeText={setQty} style={styles.input} />
          </View>
          {ordType === "limit" && (
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t.trade.pxLimit}</Text>
              <TextInput keyboardType="numeric" value={limitPx} onChangeText={setLimitPx} placeholder={quote ? String(quote.last) : ""} placeholderTextColor={T.faint} style={styles.input} />
            </View>
          )}
        </View>
        <TouchableOpacity onPress={toggleAck} style={styles.ackRow}>
          <View style={[styles.checkbox, { backgroundColor: portfolio?.ackOnFile ? future.accent : "transparent" }]} />
          <Text style={{ color: T.muted, fontSize: 11.5, flex: 1 }}>{t.trade.ackTxt}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={submit} disabled={submitting} style={[styles.submitBtn, { backgroundColor: side === "buy" ? T.up : T.down, opacity: submitting ? 0.6 : 1 }]}>
          <Text style={{ color: "#0c130e", fontWeight: "700" }}>
            {t.common.submit} — {side === "buy" ? t.common.buy : t.common.sell} {qty} × {sel}
          </Text>
        </TouchableOpacity>
      </Panel>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contractBtn: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 10 },
  matBtn: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 6 },
  sideBtn: { flex: 1, borderWidth: 1, borderRadius: 4, paddingVertical: 10, alignItems: "center" },
  label: { color: T.muted, fontSize: 11, textTransform: "uppercase", marginBottom: 5 },
  input: { backgroundColor: T.panelUp, color: T.text, borderWidth: 1, borderColor: T.line, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, fontFamily: monoFont },
  ackRow: { flexDirection: "row", gap: 9, alignItems: "flex-start", marginBottom: 12 },
  checkbox: { width: 16, height: 16, borderWidth: 1, borderColor: T.line, borderRadius: 3, marginTop: 2 },
  submitBtn: { paddingVertical: 12, borderRadius: 4, alignItems: "center" },
});
