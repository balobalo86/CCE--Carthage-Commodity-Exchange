import { Link } from "react-router-dom";
import { Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { useAuth } from "../lib/AuthContext";
import { useLang } from "../lib/LangContext";

export default function ParticipantsPage() {
  const { lang, t } = useLang();
  const { user } = useAuth();
  const colCategory = lang === "ar" ? "الفئة" : lang === "en" ? "Category" : "Catégorie";
  const colRequirements = lang === "ar" ? "المتطلبات" : lang === "en" ? "Requirements" : "Exigences";
  const colPrivileges = lang === "ar" ? "الامتيازات" : lang === "en" ? "Privileges" : "Prérogatives";

  return (
    <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Panel title={t.participants.usersTitle}>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>{t.participants.usersTxt}</div>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
          {t.participants.usersSteps.map((s, i) => (
            <li key={s} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px dashed ${T.line}`, fontSize: 12.5, color: T.text }}>
              <span style={{ color: T.olive, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, minWidth: 18 }}>{i + 1}.</span>
              <span style={{ lineHeight: 1.5 }}>{s}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title={t.participants.regulatorsTitle}>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>{t.participants.regulatorsTxt}</div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
          {t.participants.regulatorsPoints.map((p) => (
            <li key={p} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px dashed ${T.line}`, fontSize: 12.5, color: T.text }}>
              <span style={{ color: T.warn }}>▸</span>
              <span style={{ lineHeight: 1.5 }}>{p}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={t.participants.membershipTitle} style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>{t.participants.membershipIntro}</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ color: T.faint, fontSize: 10.5, textAlign: "start" }}>
                <th style={{ paddingBottom: 8, textAlign: "start" }}>{colCategory}</th>
                <th style={{ paddingBottom: 8, textAlign: "start" }}>{colRequirements}</th>
                <th style={{ paddingBottom: 8, textAlign: "start" }}>{colPrivileges}</th>
              </tr>
            </thead>
            <tbody>
              {t.participants.membershipTypes.map((m) => (
                <tr key={m.name} style={{ borderTop: `1px solid ${T.line}` }}>
                  <td style={{ padding: "10px 8px 10px 0", fontWeight: 600, color: T.text, width: "22%" }}>{m.name}</td>
                  <td style={{ padding: "10px 8px", color: T.muted, lineHeight: 1.5 }}>{m.requirements}</td>
                  <td style={{ padding: "10px 0 10px 8px", color: T.olive, lineHeight: 1.5 }}>{m.privileges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, background: T.panelUp, border: `1px solid ${T.line}`, borderRadius: 4, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 12.5, color: T.muted, maxWidth: 480, lineHeight: 1.6 }}>{t.participants.becomeMemberTxt}</div>
          {!user && (
            <Link
              to="/sign-up"
              style={{ background: T.olive, color: "#121608", borderRadius: 4, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              {t.participants.becomeMemberBtn}
            </Link>
          )}
        </div>
      </Panel>

      <Panel title={t.participants.regulatorsListTitle} style={{ gridColumn: "1 / -1" }}>
        {t.participants.regulators.map((r) => (
          <Row key={r.name} label={r.name} value={r.role} />
        ))}
      </Panel>
    </div>
  );
}
