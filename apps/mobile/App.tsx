import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LangProvider, useLang } from "./src/lib/LangContext";
import { MarketProvider } from "./src/lib/MarketContext";
import { ToastProvider } from "./src/lib/ToastContext";
import MarketsScreen from "./src/screens/MarketsScreen";
import OptionsScreen from "./src/screens/OptionsScreen";
import EtfScreen from "./src/screens/EtfScreen";
import PortfolioScreen from "./src/screens/PortfolioScreen";
import { T } from "./src/theme";

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: T.bg, card: T.panel, border: T.line, text: T.text, primary: T.olive },
};

function TopBar() {
  const { lang, setLang, t } = useLang();
  return (
    <View style={styles.topBar}>
      <View style={styles.riskBar}>
        <Text style={styles.riskText} numberOfLines={2}>
          {t.risk}
        </Text>
      </View>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            CCE<Text style={{ color: T.olive }}>.</Text>
          </Text>
          <Text style={styles.tagline}>{t.exchange}</Text>
        </View>
        <View style={styles.langRow}>
          {(["fr", "ar", "en"] as const).map((l) => (
            <TouchableOpacity key={l} onPress={() => setLang(l)} style={[styles.langBtn, { backgroundColor: lang === l ? T.olive : "transparent" }]}>
              <Text style={{ color: lang === l ? "#121608" : T.muted, fontSize: 11, fontWeight: "600" }}>{l === "fr" ? "FR" : l === "en" ? "EN" : "AR"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

function Tabs() {
  const { t } = useLang();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: T.panel, borderTopColor: T.line },
        tabBarActiveTintColor: T.olive,
        tabBarInactiveTintColor: T.muted,
      }}
    >
      <Tab.Screen name="markets" component={MarketsScreen} options={{ title: t.tabs.markets }} />
      <Tab.Screen name="options" component={OptionsScreen} options={{ title: t.tabs.options }} />
      <Tab.Screen name="etf" component={EtfScreen} options={{ title: t.tabs.etf }} />
      <Tab.Screen name="portfolio" component={PortfolioScreen} options={{ title: t.tabs.portfolio }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <MarketProvider>
          <ToastProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={["top"]}>
              <StatusBar style="light" />
              <TopBar />
              <NavigationContainer theme={navTheme}>
                <Tabs />
              </NavigationContainer>
            </SafeAreaView>
          </ToastProvider>
        </MarketProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  topBar: { backgroundColor: T.bg },
  riskBar: { backgroundColor: "#2a2113", borderBottomWidth: 1, borderBottomColor: "#4a3a1a", paddingHorizontal: 12, paddingVertical: 6 },
  riskText: { color: T.warn, fontSize: 10.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.line },
  logo: { color: T.text, fontSize: 22, fontWeight: "700" },
  tagline: { color: T.muted, fontSize: 9.5, textTransform: "uppercase", letterSpacing: 1 },
  langRow: { flexDirection: "row", gap: 4, borderWidth: 1, borderColor: T.line, borderRadius: 4, padding: 2 },
  langBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 3 },
});
