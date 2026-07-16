import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Panel, Row, monoFont } from "../components/Atoms";
import { T } from "../theme";
import { useAccount } from "../lib/AccountContext";
import { useAuth } from "../lib/AuthContext";
import { useLang } from "../lib/LangContext";

function ProfilePanel() {
  const { t } = useLang();
  const { user, logout } = useAuth();
  const { portfolio } = useAccount();
  if (!user) return null;

  return (
    <Panel title={t.auth.loggedInAs}>
      <Text style={{ color: T.text, fontSize: 15, fontWeight: "700", marginBottom: 4 }}>{user.fullName}</Text>
      <Text style={{ color: T.muted, fontSize: 12.5, marginBottom: 14 }}>{user.email}</Text>
      <Row label={t.portfolio.cash} value={portfolio ? `${portfolio.cashTnd.toLocaleString()} TND` : "…"} />
      <Row label={t.portfolio.usedMargin} value={portfolio ? `${portfolio.usedMargin.toLocaleString()} TND` : "…"} />
      <TouchableOpacity onPress={logout} style={styles.submitBtn}>
        <Text style={{ color: "#0c130e", fontWeight: "700" }}>{t.auth.logOutBtn}</Text>
      </TouchableOpacity>
    </Panel>
  );
}

function AuthForm() {
  const { t } = useLang();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signIn") await login(email, password);
      else await register(email, password, fullName);
    } catch (e: any) {
      setError(e.message ?? "Failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Panel title={mode === "signIn" ? t.auth.signIn : t.auth.signUp}>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
        {(["signIn", "signUp"] as const).map((m) => (
          <TouchableOpacity key={m} onPress={() => setMode(m)} style={[styles.pill, { flex: 1, alignItems: "center", backgroundColor: mode === m ? T.panelUp : "transparent", borderColor: mode === m ? T.olive : T.line }]}>
            <Text style={{ color: mode === m ? T.text : T.muted, fontWeight: "600" }}>{m === "signIn" ? t.auth.signIn : t.auth.signUp}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {mode === "signUp" && (
        <>
          <Text style={styles.label}>{t.auth.fullName}</Text>
          <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />
        </>
      )}
      <Text style={styles.label}>{t.auth.email}</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <Text style={styles.label}>{t.auth.password}</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error && <Text style={{ color: T.warn, fontSize: 12, marginBottom: 10 }}>{error}</Text>}
      <TouchableOpacity onPress={submit} disabled={submitting} style={[styles.submitBtn, { opacity: submitting ? 0.6 : 1 }]}>
        <Text style={{ color: "#0c130e", fontWeight: "700" }}>{mode === "signIn" ? t.auth.signInBtn : t.auth.signUpBtn}</Text>
      </TouchableOpacity>
      <Text style={{ color: T.faint, fontSize: 11, marginTop: 10, lineHeight: 16 }}>{t.auth.guestNote}</Text>
    </Panel>
  );
}

export default function AccountScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: T.bg }} contentContainerStyle={{ padding: 14, gap: 12 }}>
      {user ? <ProfilePanel /> : <AuthForm />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pill: { borderWidth: 1, borderRadius: 6, padding: 10 },
  label: { color: T.muted, fontSize: 11, textTransform: "uppercase", marginBottom: 5 },
  input: { backgroundColor: T.panelUp, color: T.text, borderWidth: 1, borderColor: T.line, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 8, fontFamily: monoFont, marginBottom: 12 },
  submitBtn: { paddingVertical: 12, borderRadius: 4, alignItems: "center", backgroundColor: T.olive, marginTop: 4 },
});
