import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Panel } from "../components/Atoms";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";

export default function HelpScreen() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      <Panel title={t.helpTitle}>
        {t.faq.map(([q, a], i) => (
          <View key={q} style={{ borderWidth: 1, borderColor: T.line, borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
            <TouchableOpacity onPress={() => setOpen(open === i ? null : i)} style={{ padding: 12 }}>
              <Text style={{ color: T.text, fontSize: 13.5, fontWeight: "700" }}>{q}</Text>
            </TouchableOpacity>
            {open === i && (
              <Text style={{ color: T.muted, fontSize: 13, lineHeight: 19, paddingHorizontal: 12, paddingBottom: 12 }}>{a}</Text>
            )}
          </View>
        ))}
      </Panel>
    </ScrollView>
  );
}
