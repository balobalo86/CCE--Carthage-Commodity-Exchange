import { Platform, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { T } from "../theme";

export const monoFont = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });

export function Chip({ children, color = T.muted, border = T.line }: { children: React.ReactNode; color?: string; border?: string }) {
  return (
    <View style={[styles.chip, { borderColor: border }]}>
      <Text style={{ color, fontSize: 11, fontFamily: monoFont }}>{children}</Text>
    </View>
  );
}

export function Panel({ title, right, children, style }: { title?: string; right?: React.ReactNode; children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.panel, style]}>
      {title && (
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>{title}</Text>
          {right}
        </View>
      )}
      <View style={{ padding: 14 }}>{children}</View>
    </View>
  );
}

export function Row({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <View style={styles.row}>
      <Text style={{ color: T.muted, fontSize: 12.5 }}>{label}</Text>
      <Text style={{ color: color ?? T.text, fontSize: 12.5, fontFamily: monoFont }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 2, alignSelf: "flex-start" },
  panel: { backgroundColor: T.panel, borderWidth: 1, borderColor: T.line, borderRadius: 6, overflow: "hidden" },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: T.line },
  panelTitle: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: T.muted },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: T.line, borderStyle: "dashed" },
});
