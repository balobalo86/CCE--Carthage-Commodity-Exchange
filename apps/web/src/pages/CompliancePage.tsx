import { Panel, Row } from "../components/Atoms";
import { T } from "../theme";
import { useLang } from "../lib/LangContext";
import { useAccount } from "../lib/AccountContext";

export default function CompliancePage() {
  const { lang, t } = useLang();
  const { portfolio } = useAccount();

  const regRows: [string, string][] =
    lang === "ar"
      ? [
          ["السلطة الإشرافية", "هيئة السوق المالية (CMF)"],
          ["القانون عدد 94-117", "إعادة تنظيم السوق المالي"],
          ["النظام العام للبورصة", "التداول، الحدود، الإيقاف"],
          ["المقاصة والمودع", "Tunisie Clearing — تسوية ت+1 (في بيئة حقيقية)"],
          ["مكافحة غسل الأموال", "القانون الأساسي عدد 2015-26 — CTAF"],
          ["البيانات الشخصية", "القانون عدد 2004-63 — INPDP"],
          ["المبادلات الإلكترونية", "القانون عدد 2000-83 — الإمضاء الإلكتروني"],
          ["الصرف وقابلية التحويل", "مجلة الصرف — تأشيرة البنك المركزي (غير المقيمين)"],
        ]
      : lang === "en"
      ? [
          ["Supervisory authority", "Conseil du Marché Financier (CMF)"],
          ["Law No. 94-117", "Reorganization of the financial market"],
          ["Exchange General Regulation", "Trading, bands, suspension"],
          ["Clearing & depository", "Tunisie Clearing — T+1 settlement (in a real environment)"],
          ["AML / CFT", "Organic Law No. 2015-26 — CTAF"],
          ["Personal data", "Law No. 2004-63 — INPDP"],
          ["Electronic exchanges", "Law No. 2000-83 — electronic signature"],
          ["Exchange control", "Foreign exchange code — BCT visa (non-residents)"],
        ]
      : [
          ["Autorité de tutelle", "Conseil du Marché Financier (CMF)"],
          ["Loi n° 94-117", "Réorganisation du marché financier"],
          ["Règlement général de la Bourse", "Négociation, seuils, suspension"],
          ["Compensation & dépositaire", "Tunisie Clearing — règlement J+1 (en environnement réel)"],
          ["LBC / FT", "Loi organique n° 2015-26 — CTAF"],
          ["Données personnelles", "Loi n° 2004-63 — INPDP"],
          ["Échanges électroniques", "Loi n° 2000-83 — signature électronique"],
          ["Change & convertibilité", "Code des changes — visa BCT (non-résidents)"],
        ];

  const docs =
    lang === "ar"
      ? ["نشرة معلومات (نموذج)", "اتفاقية وساطة وملحق «العقود الآجلة»", "جدول هوامش الضمان ونداءات الهامش", "مواصفات عقود HOV وDGN", "سياسة تنفيذ الأوامر", "إشعار INPDP"]
      : lang === "en"
      ? ["Information notice (template)", "Brokerage agreement + 'futures' annex", "Margin & margin-call schedule", "HOV & DGN contract specifications", "Order execution policy", "INPDP data-protection notice"]
      : ["Note d'information (modèle)", "Convention d'intermédiation et annexe « instruments à terme »", "Barème des dépôts de garantie et des appels de marge", "Spécifications des contrats HOV et DGN", "Politique d'exécution des ordres", "Notice INPDP — données personnelles"];

  return (
    <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Panel title={t.compliance.kyc}>
        <Row label={lang === "ar" ? "الهوية" : lang === "en" ? "Identity" : "Identité"} value={portfolio ? "✓" : "…"} color={T.up} />
        <Row label={lang === "ar" ? "اعرف عميلك" : lang === "en" ? "KYC file" : "Dossier KYC"} value={lang === "ar" ? "محاكاة" : lang === "en" ? "Simulated" : "Simulé"} />
        <Row label={lang === "ar" ? "إقرار المخاطر" : lang === "en" ? "Risk acknowledgement" : "Reconnaissance des risques"} value={portfolio?.ackOnFile ? "✓" : "—"} color={portfolio?.ackOnFile ? T.up : T.warn} />
        <div style={{ marginTop: 12, fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{t.compliance.investTxt}</div>
      </Panel>

      <Panel title={t.compliance.frame}>
        {regRows.map(([label, value]) => (
          <Row key={label} label={label} value={value} />
        ))}
        <div style={{ marginTop: 12, fontSize: 12, color: T.warn, lineHeight: 1.6, background: "#241d10", border: "1px solid #4a3a1a", borderRadius: 4, padding: 10 }}>
          {t.compliance.warn}
        </div>
      </Panel>

      <Panel title={t.compliance.invest}>
        <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7 }}>{t.compliance.investTxt}</div>
      </Panel>

      <Panel title={t.compliance.docs}>
        {docs.map((d) => (
          <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px dashed ${T.line}`, fontSize: 12.5 }}>
            <span style={{ color: T.text }}>{d}</span>
            <span style={{ color: T.faint, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
              {lang === "ar" ? "نموذج" : lang === "en" ? "template" : "modèle"}
            </span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
