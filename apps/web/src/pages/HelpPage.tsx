import { useState } from "react";
import { Panel } from "../components/Atoms";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";

export default function HelpPage() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Panel title={t.helpTitle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {t.faq.map(([q, a], i) => (
          <div key={q} style={{ border: `1px solid ${T.line}`, borderRadius: 4 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", textAlign: "start", background: "transparent", border: "none", color: T.text, padding: "12px 14px", fontSize: 13.5, fontFamily: "inherit", fontWeight: 600 }}
            >
              {q}
            </button>
            {open === i && <div style={{ padding: "0 14px 14px", color: T.muted, fontSize: 13, lineHeight: 1.6 }}>{a}</div>}
          </div>
        ))}
      </div>
    </Panel>
  );
}
