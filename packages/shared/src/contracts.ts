import type { EtfSpec, FutureContractSpec } from "./types";

export const COLORS = {
  olive: "#aebe45",
  amber: "#d9a03f",
  up: "#46b478",
  down: "#d95d4e",
  warn: "#e0b13f",
};

export const PRICE_BAND_PCT = 0.03;

export const FUTURES: Record<string, FutureContractSpec> = {
  HOV: {
    code: "HOV",
    assetClass: "future",
    accent: COLORS.olive,
    name: {
      fr: "Huile d'olive vierge extra",
      en: "Extra Virgin Olive Oil",
      ar: "زيت الزيتون البكر الممتاز",
    },
    tonnes: 10,
    base: 27450,
    tick: 10,
    marginRate: 0.09,
    maintenanceRatio: 0.75,
    maturities: ["SEP26", "NOV26", "JAN27", "MAR27", "MAI27"],
    grade: {
      fr: "Huile d'olive vierge extra, acidité ≤ 0,8 %, indice de peroxyde ≤ 20 — normes ONH / Conseil oléicole international, origine Tunisie, certificat d'analyse par laboratoire agréé.",
      en: "Extra virgin olive oil, free acidity ≤ 0.8 %, peroxide value ≤ 20 — ONH / International Olive Council standards, Tunisian origin, certificate of analysis from an accredited laboratory.",
      ar: "زيت زيتون بكر ممتاز، حموضة ≤ 0.8٪، مؤشر البيروكسيد ≤ 20 — مواصفات الديوان الوطني للزيت والمجلس الدولي للزيتون، منشأ تونسي، شهادة تحليل من مختبر معتمد.",
    },
    delivery: {
      fr: "Entrepôts agréés ONH : Sfax, Sousse, Zarzis. Avis d'apport J−3 ; transfert par récépissé d'entrepôt (warrant).",
      en: "ONH-licensed warehouses: Sfax, Sousse, Zarzis. Tender notice T−3; transfer by warehouse receipt (warrant).",
      ar: "مستودعات مرخّصة من الديوان الوطني للزيت: صفاقس، سوسة، جرجيس. إشعار التسليم قبل 3 أيام؛ النقل بسند إيداع (وارنت).",
    },
    posLimit: {
      fr: "400 contrats nets par donneur d'ordre, 150 sur l'échéance courante (mois de livraison)",
      en: "400 net contracts per beneficial owner, 150 in the spot (delivery) month",
      ar: "400 عقد صافٍ لكل متعامل، و150 عقدًا في شهر التسليم",
    },
    posLimitNet: 400,
    posLimitFrontMonth: 150,
    rule: "Ch. 12 — Oléagineux / Olive Oil",
  },
  DGN: {
    code: "DGN",
    assetClass: "future",
    accent: COLORS.amber,
    name: {
      fr: "Dattes Deglet Nour",
      en: "Deglet Nour Dates",
      ar: "تمور دقلة النور",
    },
    tonnes: 20,
    base: 7820,
    tick: 5,
    marginRate: 0.11,
    maintenanceRatio: 0.75,
    maturities: ["OCT26", "DEC26", "FEV27"],
    grade: {
      fr: "Dattes Deglet Nour branchées, catégorie I, humidité ≤ 26 %, calibre ≥ 4 g — stations de conditionnement agréées GIFruits, régions Kébili / Tozeur.",
      en: "Deglet Nour dates on branch, Category I, moisture ≤ 26 %, unit weight ≥ 4 g — GIFruits-licensed packing stations, Kébili / Tozeur regions.",
      ar: "تمور دقلة النور بالعرجون، صنف أول، رطوبة ≤ 26٪، وزن الحبّة ≥ 4 غ — محطات تكييف مرخّصة من GIFruits، ولايتا قبلي وتوزر.",
    },
    delivery: {
      fr: "Stations agréées : Kébili, Tozeur, Douz. Avis d'apport J−3 ; contrôle qualité contradictoire à la livraison.",
      en: "Licensed stations: Kébili, Tozeur, Douz. Tender notice T−3; adversarial quality inspection at delivery.",
      ar: "محطات مرخّصة: قبلي، توزر، دوز. إشعار التسليم قبل 3 أيام؛ معاينة جودة حضورية عند التسليم.",
    },
    posLimit: {
      fr: "600 contrats nets par donneur d'ordre, 200 sur l'échéance courante",
      en: "600 net contracts per beneficial owner, 200 in the spot month",
      ar: "600 عقد صافٍ لكل متعامل، و200 عقد في شهر التسليم",
    },
    posLimitNet: 600,
    posLimitFrontMonth: 200,
    rule: "Ch. 14 — Fruits / Dates",
  },
};

export const ETFS: Record<string, EtfSpec> = {
  OLEA: {
    code: "OLEA",
    assetClass: "etf",
    accent: COLORS.olive,
    name: {
      fr: "CCE Olea TND — Fonds indiciel huile d'olive",
      en: "CCE Olea TND — Olive Oil Index Fund",
      ar: "صندوق CCE Olea TND — صندوق مؤشر زيت الزيتون",
    },
    description: {
      fr: "Fonds indiciel négocié en continu, répliquant physiquement un panier pondéré des deux échéances les plus proches du contrat à terme HOV. Souscription/rachat en nature par blocs de création auprès des participants autorisés (PA).",
      en: "Continuously-traded index fund physically replicating a weighted basket of the two nearest HOV futures maturities. In-kind creation/redemption in baskets via authorized participants (APs).",
      ar: "صندوق مؤشر يتداول باستمرار، يحاكي ماديًا سلة مرجّحة من أقرب استحقاقين لعقد HOV الآجل. اكتتاب واسترداد عيني بحصص إنشاء عبر مشاركين معتمدين.",
    },
    underlying: "HOV",
    weights: { front: 0.65, second: 0.35 },
    divisor: 100,
    managementFeeBps: 45,
    creationUnit: 50000,
    inceptionNav: 274.5,
  },
  TEMR: {
    code: "TEMR",
    assetClass: "etf",
    accent: COLORS.amber,
    name: {
      fr: "CCE Temr TND — Fonds indiciel dattes",
      en: "CCE Temr TND — Dates Index Fund",
      ar: "صندوق CCE Temr TND — صندوق مؤشر التمور",
    },
    description: {
      fr: "Fonds indiciel répliquant physiquement un panier pondéré des deux échéances les plus proches du contrat à terme DGN. Souscription/rachat en nature par blocs de création auprès des participants autorisés (PA).",
      en: "Index fund physically replicating a weighted basket of the two nearest DGN futures maturities. In-kind creation/redemption in baskets via authorized participants (APs).",
      ar: "صندوق مؤشر يحاكي ماديًا سلة مرجّحة من أقرب استحقاقين لعقد DGN الآجل. اكتتاب واسترداد عيني بحصص إنشاء عبر مشاركين معتمدين.",
    },
    underlying: "DGN",
    weights: { front: 0.65, second: 0.35 },
    divisor: 100,
    managementFeeBps: 55,
    creationUnit: 100000,
    inceptionNav: 78.2,
  },
};

export function priceBand(ref: number, pct = PRICE_BAND_PCT) {
  return { lo: +(ref * (1 - pct)).toFixed(2), hi: +(ref * (1 + pct)).toFixed(2), pct };
}
