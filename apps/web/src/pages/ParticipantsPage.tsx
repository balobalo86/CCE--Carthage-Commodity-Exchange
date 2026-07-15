import { Panel } from "../components/Atoms";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";

export default function ParticipantsPage() {
  const { t } = useLang();

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
    </div>
  );
}
