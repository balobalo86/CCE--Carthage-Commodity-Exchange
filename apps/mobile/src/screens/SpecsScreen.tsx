import { ScrollView, Text, View } from "react-native";
import { FUTURES, type FutureContractSpec } from "@cce/shared";
import { Chip, Panel, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";

export default function SpecsScreen() {
  const { lang, t } = useLang();
  const isAr = lang === "ar";
  const r = t.specRows;

  function rowsFor(ct: FutureContractSpec): [string, string][] {
    return [
      [r.venue, "CCE — Segment « Agri-Futures » (électronique, appariement prix/temps)"],
      [r.code, ct.code],
      [r.unit, `${ct.tonnes} ${isAr ? "طن متري" : lang === "en" ? "metric tonnes" : "tonnes métriques"} (${(ct.tonnes * 1000).toLocaleString(lang)} kg)`],
      [r.quote, `${isAr ? "دينار تونسي لكل طن متري" : lang === "en" ? "Tunisian dinars per metric tonne" : "Dinars tunisiens par tonne métrique"} (TND/t)`],
      [r.tick, `${ct.tick.toLocaleString(lang)} TND/t = ${(ct.tick * ct.tonnes).toLocaleString(lang)} TND / ${isAr ? "عقد" : "contrat"}`],
      [r.hours, "09:00–14:30 (Tunis, GMT+1) · pré-ouverture 08:30–09:00 (fixing)"],
      [r.listed, ct.maturities.join(" · ")],
      [
        r.settleM,
        isAr
          ? "تسليم مادي (مع إمكانية التسوية النقدية بالتراضي قبل الاستحقاق)"
          : lang === "en"
          ? "Physical delivery (positions may be cash-closed before expiry)"
          : "Livraison physique (dénouement en espèces possible avant l'échéance)",
      ],
      [
        r.lastDay,
        isAr
          ? "خامس يوم بورصة قبل نهاية شهر الاستحقاق، 12:00"
          : lang === "en"
          ? "5th business day preceding the end of the contract month, 12:00"
          : "5ᵉ jour de bourse précédant la fin du mois d'échéance, 12:00",
      ],
      [r.grade, ct.grade[lang]],
      [r.delivery, ct.delivery[lang]],
      [
        r.bands,
        `± 3 % ${
          isAr
            ? "من سعر تسوية اليوم السابق (حدود ثابتة، إيقاف مؤقت عند البلوغ)"
            : lang === "en"
            ? "of prior settlement (static bands, reservation halt when hit)"
            : "du cours de liquidation de la veille (seuils statiques, réservation en cas d'atteinte)"
        }`,
      ],
      [r.limits, ct.posLimit[lang]],
      [r.rule, ct.rule],
    ];
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      {Object.values(FUTURES).map((ct) => (
        <Panel key={ct.code} title={`${t.specTitle} — ${ct.name[lang]}`} right={<Chip color={ct.accent} border={ct.accent + "55"}>{ct.code}</Chip>}>
          {rowsFor(ct).map(([label, value]) => (
            <View key={label} style={{ paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: T.line, borderStyle: "dashed" }}>
              <Text style={{ color: T.muted, fontSize: 11, marginBottom: 3 }}>{label}</Text>
              <Text style={{ color: T.text, fontSize: 12.5, fontFamily: monoFont }}>{value}</Text>
            </View>
          ))}
          <Text style={{ color: T.muted, fontSize: 12, lineHeight: 17, marginTop: 10 }}>{ct.calendarNote[lang]}</Text>
        </Panel>
      ))}
    </ScrollView>
  );
}
