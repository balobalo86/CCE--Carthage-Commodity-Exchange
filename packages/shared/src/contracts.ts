import { generateMaturities } from "./maturity";
import type { EtfSpec, FutureContractSpec, SwapSpec } from "./types";

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
    // Full monthly curve, 12 months out — olive oil is stored and traded
    // year-round, so unlike dates there's continuous demand for a contract
    // in every month rather than just around harvest.
    maturities: generateMaturities(12, 1),
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
    calendarNote: {
      fr: "Courbe mensuelle complète (12 échéances consécutives). La récolte tunisienne (nov.–janv.) pèse sur les échéances de livraison rapprochées ; le report (contango) reflète le coût de stockage jusqu'à la campagne suivante.",
      en: "Full monthly curve (12 consecutive maturities). The Tunisian harvest (Nov–Jan) weighs on the nearer delivery months; the contango further out reflects storage cost carried to the next crop year.",
      ar: "منحنى شهري كامل (12 استحقاقًا متتاليًا). يؤثر موسم الحصاد التونسي (نوفمبر–جانفي) على الآجال القريبة للتسليم؛ يعكس تفاوت الأسعار (كونتانغو) في الآجال الأبعد تكلفة التخزين إلى الموسم المقبل.",
    },
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
    // Bi-monthly, 12 months out — dates are a shorter, sharply seasonal
    // harvest (Sept–Nov) so the market doesn't need a full monthly curve;
    // real seasonal-ag futures (cotton, coffee) list active months this way.
    maturities: generateMaturities(6, 2),
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
    calendarNote: {
      fr: "Échéances bimestrielles (6 sur 12 mois). La récolte (sept.–nov.) concentre l'essentiel des volumes physiques ; le calendrier bimestriel suffit à couvrir la campagne sans échéances excédentaires peu liquides.",
      en: "Bi-monthly maturities (6 across 12 months). The harvest (Sept–Nov) concentrates most physical volume; a bi-monthly calendar covers the marketing season without excess, thinly-traded maturities.",
      ar: "آجال كل شهرين (6 استحقاقات على مدى 12 شهرًا). يتركز معظم الحجم الفعلي خلال موسم الحصاد (سبتمبر–نوفمبر)؛ يكفي تقويم كل شهرين لتغطية الموسم التجاري دون آجال زائدة قليلة السيولة.",
    },
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

export const SWAP_TENORS_MONTHS = [1, 3, 6, 12];

export const SWAPS: Record<string, SwapSpec> = {
  "HOV-SWAP": {
    code: "HOV-SWAP",
    assetClass: "swap",
    accent: COLORS.olive,
    name: {
      fr: "Swap huile d'olive TND",
      en: "Olive Oil TND Swap",
      ar: "مبادلة زيت الزيتون بالدينار",
    },
    description: {
      fr: "Swap de matières premières compensé central : une jambe fixe échangée contre le prix de règlement flottant du contrat à terme HOV à l'échéance la plus proche de la durée choisie. Utilisé pour figer un prix sans livraison physique ni roulement de positions à terme.",
      en: "Centrally-cleared commodity swap: a fixed leg exchanged against the floating settlement price of the HOV future nearest the chosen tenor. Used to lock in a price without physical delivery or rolling futures positions.",
      ar: "مبادلة سلعية مقاصتها مركزية: جزء ثابت مقابل سعر التسوية المتغير لعقد HOV الآجل الأقرب لمدة المبادلة المختارة. تُستعمل لتثبيت سعر دون تسليم مادي أو ترحيل مراكز آجلة.",
    },
    underlying: "HOV",
    tenorsMonths: SWAP_TENORS_MONTHS,
    rule: "Ch. 20 — Swaps de matières premières / Commodity Swaps",
  },
  "DGN-SWAP": {
    code: "DGN-SWAP",
    assetClass: "swap",
    accent: COLORS.amber,
    name: {
      fr: "Swap dattes TND",
      en: "Dates TND Swap",
      ar: "مبادلة التمور بالدينار",
    },
    description: {
      fr: "Swap de matières premières compensé central : une jambe fixe échangée contre le prix de règlement flottant du contrat à terme DGN à l'échéance la plus proche de la durée choisie.",
      en: "Centrally-cleared commodity swap: a fixed leg exchanged against the floating settlement price of the DGN future nearest the chosen tenor.",
      ar: "مبادلة سلعية مقاصتها مركزية: جزء ثابت مقابل سعر التسوية المتغير لعقد DGN الآجل الأقرب لمدة المبادلة المختارة.",
    },
    underlying: "DGN",
    tenorsMonths: SWAP_TENORS_MONTHS,
    rule: "Ch. 20 — Swaps de matières premières / Commodity Swaps",
  },
};

export function priceBand(ref: number, pct = PRICE_BAND_PCT) {
  return { lo: +(ref * (1 - pct)).toFixed(2), hi: +(ref * (1 + pct)).toFixed(2), pct };
}
