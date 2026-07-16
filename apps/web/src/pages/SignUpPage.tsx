import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Panel } from "../components/Atoms";
import { T } from "../theme";
import { useAuth } from "../lib/AuthContext";
import { useLang } from "../lib/LangContext";

export default function SignUpPage() {
  const { t } = useLang();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, fullName);
      navigate("/");
    } catch (err: any) {
      setError(err.message ?? "Sign-up failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <Panel title={t.auth.signUp}>
        <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 14, lineHeight: 1.6 }}>{t.auth.signUpSubtitle}</div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.auth.fullName}</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: "100%", marginTop: 5, background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.auth.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", marginTop: 5, background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, direction: "ltr" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: T.muted, textTransform: "uppercase" }}>{t.auth.password}</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", marginTop: 5, background: T.panelUp, color: T.text, border: `1px solid ${T.line}`, borderRadius: 4, padding: "9px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, direction: "ltr" }}
            />
            <div style={{ fontSize: 11, color: T.faint, marginTop: 4 }}>{t.auth.passwordHint}</div>
          </div>
          {error && <div style={{ color: T.warn, fontSize: 12.5 }}>{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            style={{ width: "100%", padding: "12px 0", borderRadius: 4, border: "none", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: T.olive, color: "#121608", opacity: submitting ? 0.6 : 1 }}
          >
            {t.auth.signUpBtn}
          </button>
          <div style={{ fontSize: 12.5, color: T.muted, textAlign: "center" }}>
            {t.auth.haveAccount} <Link to="/sign-in" style={{ color: T.olive }}>{t.auth.signIn}</Link>
          </div>
        </form>
      </Panel>
    </div>
  );
}
