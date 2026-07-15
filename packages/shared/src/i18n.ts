import type { Lang } from "./types";

export const LANGS: Lang[] = ["fr", "ar", "en"];

export function dirFor(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function localeFor(lang: Lang): string {
  return lang === "ar" ? "ar-TN" : lang === "en" ? "en-US" : "fr-TN";
}

export function fmt(v: number | null | undefined, lang: Lang, dec = 0): string {
  if (v == null || Number.isNaN(v)) return "—";
  return v.toLocaleString(localeFor(lang), { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

export interface Dict {
  dir: "ltr" | "rtl";
  exchange: string;
  tagline: string;
  risk: string;
  session: string;
  clearing: string;
  ccy: string;
  tabs: {
    markets: string;
    options: string;
    etf: string;
    trade: string;
    portfolio: string;
    specs: string;
    compliance: string;
    help: string;
  };
  common: {
    last: string;
    chg: string;
    settle: string;
    vol: string;
    oi: string;
    high: string;
    low: string;
    buy: string;
    sell: string;
    qty: string;
    price: string;
    time: string;
    status: string;
    book: string;
    side: string;
    submit: string;
    cancel: string;
    filled: string;
    rejected: string;
    lots: string;
    contracts: string;
    perT: string;
    maturities: string;
    strike: string;
    call: string;
    put: string;
    premium: string;
    iv: string;
    greeks: { delta: string; gamma: string; vega: string; theta: string };
  };
  trade: {
    orderTicket: string;
    ordType: string;
    limit: string;
    market: string;
    pxLimit: string;
    notional: string;
    margin: string;
    scanningRisk: string;
    bands: string;
    posLimit: string;
    ackTxt: string;
    ackWarn: string;
    bandWarn: (lo: string, hi: string) => string;
    positionLimitWarn: string;
    execOk: (id: string, s: string, q: string, c: string, m: string, p: string) => string;
    orders: string;
    noOrders: string;
    auditTrail: string;
  };
  etf: {
    title: string;
    nav: string;
    basket: string;
    creationUnit: string;
    fee: string;
    subscribe: string;
    redeem: string;
    units: string;
    mechanism: string;
  };
  options: {
    chain: string;
    calls: string;
    puts: string;
    underlyingFuture: string;
    model: string;
  };
  portfolio: {
    cash: string;
    usedMargin: string;
    pnl: string;
    positions: string;
    entry: string;
    marginCall: string;
    noCall: string;
  };
  specTitle: string;
  specRows: {
    unit: string;
    quote: string;
    hours: string;
    tick: string;
    code: string;
    listed: string;
    settleM: string;
    lastDay: string;
    delivery: string;
    grade: string;
    limits: string;
    bands: string;
    rule: string;
    venue: string;
  };
  helpTitle: string;
  faq: [string, string][];
  compliance: {
    kyc: string;
    frame: string;
    invest: string;
    docs: string;
    investTxt: string;
    warn: string;
  };
  footer: string;
}

export const I18N: Record<Lang, Dict> = {
  fr: {
    dir: "ltr",
    exchange: "Carthage Commodity Exchange",
    tagline: "Marché à terme des matières premières tunisiennes",
    risk: "Avertissement (CMF) : les instruments à terme et les options comportent un risque de perte pouvant excéder le capital investi. Prototype de démonstration — aucun agrément du Conseil du Marché Financier n'a été délivré, aucune donnée n'est réelle.",
    session: "Séance ouverte — 09:00–14:30 (Tunis)",
    clearing: "Compensation (simulée) : CCE Clearing",
    ccy: "Cotation : TND — dinar tunisien",
    tabs: { markets: "Marchés", options: "Options", etf: "ETF", trade: "Négociation", portfolio: "Portefeuille", specs: "Spécifications", compliance: "Conformité & CMF", help: "Assistance" },
    common: {
      last: "Dernier", chg: "Var.", settle: "Liquidation", vol: "Volume (lots)", oi: "Positions ouvertes", high: "Plus haut", low: "Plus bas",
      buy: "Achat", sell: "Vente", qty: "Quantité", price: "Prix", time: "Heure", status: "Statut", book: "Carnet d'ordres", side: "Sens", submit: "Transmettre", cancel: "Annuler",
      filled: "Exécuté", rejected: "Rejeté", lots: "Contrats", contracts: "contrat(s)", perT: "TND/t", maturities: "Échéances", strike: "Prix d'exercice",
      call: "Call", put: "Put", premium: "Prime", iv: "Volatilité implicite",
      greeks: { delta: "Delta", gamma: "Gamma", vega: "Vega", theta: "Theta" },
    },
    trade: {
      orderTicket: "Ticket d'ordre", ordType: "Type d'ordre", limit: "À cours limité", market: "Au marché", pxLimit: "Prix limite (TND/t)",
      notional: "Valeur nominale", margin: "Dépôt de garantie", scanningRisk: "Risque de scanning (SPAN simplifié)", bands: "Seuils de réservation (séance)", posLimit: "Limite de position",
      ackTxt: "Je reconnais avoir reçu et compris la note d'information sur les risques et j'accepte le mécanisme d'appels de marge quotidiens.",
      ackWarn: "Cochez la reconnaissance des risques avant de transmettre l'ordre.",
      bandWarn: (lo, hi) => `Prix hors seuils de réservation (${lo} – ${hi} TND/t). Ordre rejeté par le contrôle pré-négociation.`,
      positionLimitWarn: "Cet ordre dépasserait la limite de position autorisée. Ordre rejeté par le contrôle pré-négociation.",
      execOk: (id, s, q, c, m, p) => `Ordre ${id} exécuté — ${s} ${q} ${c} ${m} à ${p} TND/t. Compensation CCE Clearing (J+1, simulée).`,
      orders: "Ordres du jour", noOrders: "Aucun ordre transmis pendant cette séance.",
      auditTrail: "Ordre horodaté et journalisé (piste d'audit) — intermédiaire en bourse agréé requis en environnement réel.",
    },
    etf: {
      title: "Fonds indiciels (ETF)", nav: "Valeur liquidative (VL)", basket: "Panier de réplication", creationUnit: "Bloc de création",
      fee: "Frais de gestion annuels", subscribe: "Souscrire", redeem: "Racheter", units: "Parts",
      mechanism: "Souscription/rachat en nature par blocs de création, réservés aux participants autorisés ; négociation continue en parts sur le marché secondaire.",
    },
    options: { chain: "Chaîne d'options", calls: "Calls", puts: "Puts", underlyingFuture: "Sous-jacent (contrat à terme)", model: "Modèle Black-76 sur prix à terme" },
    portfolio: {
      cash: "Avoirs (compte espèces TND)", usedMargin: "Dépôts de garantie mobilisés", pnl: "Résultat latent (jour)", positions: "Positions ouvertes", entry: "Prix d'entrée",
      marginCall: "Un appel de marge est émis si la couverture devient insuffisante (J+1, 10:00).", noCall: "Aucun appel de marge en cours.",
    },
    specTitle: "Fiche de spécifications — style règles de marché",
    specRows: {
      unit: "Unité de négociation", quote: "Cotation", hours: "Horaires de négociation", tick: "Échelon minimal", code: "Code produit",
      listed: "Échéances listées", settleM: "Méthode de règlement", lastDay: "Dernier jour de négociation", delivery: "Points et procédure de livraison",
      grade: "Grade et qualité", limits: "Limites de position", bands: "Limites de variation", rule: "Chapitre du Règlement de marché", venue: "Plateforme / segment",
    },
    helpTitle: "Assistance & réclamations",
    faq: [
      ["Qui peut négocier sur CCE ?", "Dans un environnement réel : toute personne ayant signé une convention avec un intermédiaire en bourse agréé, complété le questionnaire d'adéquation et le dossier KYC. Ce prototype ne négocie aucun instrument réel."],
      ["Comment fonctionnent les appels de marge ?", "Les positions sont réévaluées chaque jour au prix de liquidation. Si la couverture devient insuffisante, un appel de marge est notifié et doit être honoré avant 10:00 (J+1)."],
      ["La livraison physique est-elle obligatoire ?", "Non. Les positions peuvent être dénouées avant l'échéance. À l'échéance, la livraison s'effectuerait via les entrepôts et stations agréés (ONH / GIFruits)."],
      ["Comment déposer une réclamation ?", "Dans un environnement réel : d'abord auprès de l'intermédiaire (réponse sous 15 jours), puis auprès du Conseil du Marché Financier — cmf.tn."],
    ],
    compliance: {
      kyc: "Statut du compte — KYC / LBC-FT (simulé)", frame: "Cadre réglementaire de référence", invest: "Protection de l'investisseur", docs: "Documents contractuels (modèles)",
      investTxt: "Dans un environnement réel : fonds de garantie de marché alimenté par les adhérents compensateurs, ségrégation des avoirs clients chez le dépositaire, publication quotidienne des prix de liquidation et positions ouvertes, conservation des ordres dix ans à des fins de surveillance.",
      warn: "Point d'attention : aucun compartiment de contrats à terme sur marchandises n'est aujourd'hui opérationnel en Tunisie. Le lancement effectif suppose un agrément et un cadre dédié approuvés par le CMF, l'articulation avec la BCT et les organismes de filière (ONH, GIFruits).",
    },
    footer: "CCE — prototype de démonstration réalisé à des fins d'étude. Ne constitue ni une offre de services d'investissement, ni une plateforme agréée par le CMF, ni un conseil en investissement. Cotations simulées.",
  },
  en: {
    dir: "ltr",
    exchange: "Carthage Commodity Exchange",
    tagline: "Tunisian commodity futures market",
    risk: "Warning (CMF): futures and options involve a risk of loss that can exceed invested capital. Demonstration prototype — no authorization has been granted by the Conseil du Marché Financier, no data is real.",
    session: "Session open — 09:00–14:30 (Tunis)",
    clearing: "Clearing (simulated): CCE Clearing",
    ccy: "Quotation: TND — Tunisian dinar",
    tabs: { markets: "Markets", options: "Options", etf: "ETFs", trade: "Trading", portfolio: "Portfolio", specs: "Contract Specs", compliance: "Compliance", help: "Support" },
    common: {
      last: "Last", chg: "Chg", settle: "Settlement", vol: "Volume (lots)", oi: "Open interest", high: "High", low: "Low",
      buy: "Buy", sell: "Sell", qty: "Quantity", price: "Price", time: "Time", status: "Status", book: "Order book", side: "Side", submit: "Submit", cancel: "Cancel",
      filled: "Filled", rejected: "Rejected", lots: "Contracts", contracts: "contract(s)", perT: "TND/t", maturities: "Maturities", strike: "Strike",
      call: "Call", put: "Put", premium: "Premium", iv: "Implied volatility",
      greeks: { delta: "Delta", gamma: "Gamma", vega: "Vega", theta: "Theta" },
    },
    trade: {
      orderTicket: "Order ticket", ordType: "Order type", limit: "Limit", market: "Market", pxLimit: "Limit price (TND/t)",
      notional: "Notional value", margin: "Initial margin", scanningRisk: "Scanning risk (simplified SPAN)", bands: "Daily price bands", posLimit: "Position limit",
      ackTxt: "I acknowledge receipt and understanding of the risk disclosure statement and accept daily margin calls.",
      ackWarn: "Tick the risk acknowledgement before submitting the order.",
      bandWarn: (lo, hi) => `Price outside daily bands (${lo} – ${hi} TND/t). Order rejected by pre-trade controls.`,
      positionLimitWarn: "This order would exceed the allowed position limit. Order rejected by pre-trade controls.",
      execOk: (id, s, q, c, m, p) => `Order ${id} filled — ${s} ${q} ${c} ${m} at ${p} TND/t. Cleared by CCE Clearing (T+1, simulated).`,
      orders: "Today's orders", noOrders: "No orders submitted this session.",
      auditTrail: "Order time-stamped and journaled (audit trail) — a licensed broker would be required in a real environment.",
    },
    etf: {
      title: "Index funds (ETFs)", nav: "Net asset value (NAV)", basket: "Replication basket", creationUnit: "Creation unit",
      fee: "Annual management fee", subscribe: "Subscribe", redeem: "Redeem", units: "Units",
      mechanism: "In-kind creation/redemption in baskets, reserved to authorized participants; continuous secondary-market trading in units.",
    },
    options: { chain: "Options chain", calls: "Calls", puts: "Puts", underlyingFuture: "Underlying (futures contract)", model: "Black-76 model on the futures price" },
    portfolio: {
      cash: "Cash balance (TND account)", usedMargin: "Margin on deposit", pnl: "Unrealized P&L (day)", positions: "Open positions", entry: "Entry price",
      marginCall: "A margin call is issued if collateral becomes insufficient (T+1, 10:00).", noCall: "No margin call outstanding.",
    },
    specTitle: "Contract specifications — rulebook style",
    specRows: {
      unit: "Contract unit", quote: "Price quotation", hours: "Trading hours", tick: "Minimum price fluctuation", code: "Product code",
      listed: "Listed maturities", settleM: "Settlement method", lastDay: "Last trading day", delivery: "Delivery points & procedure",
      grade: "Grade and quality", limits: "Position limits", bands: "Price limits", rule: "Exchange rulebook chapter", venue: "Venue / segment",
    },
    helpTitle: "Support & complaints",
    faq: [
      ["Who may trade on CCE?", "In a real environment: anyone who has signed an agreement with a licensed broker, completed the suitability questionnaire and KYC file. This prototype does not trade any real instrument."],
      ["How do margin calls work?", "Positions are marked to the daily settlement price. If collateral falls short, a margin call is notified and must be met by 10:00 (T+1)."],
      ["Is physical delivery mandatory?", "No. Positions may be closed before expiry. At expiry, delivery would take place through licensed warehouses and packing stations (ONH / GIFruits)."],
      ["How do I file a complaint?", "In a real environment: first with your broker (reply within 15 days), then with the Conseil du Marché Financier — cmf.tn."],
    ],
    compliance: {
      kyc: "Account status — KYC / AML-CFT (simulated)", frame: "Regulatory framework", invest: "Investor protection", docs: "Contractual documents (templates)",
      investTxt: "In a real environment: market guarantee fund funded by clearing members, client asset segregation at the depository, daily publication of settlement prices and open interest, orders kept ten years for market surveillance.",
      warn: "Attention: no commodity futures segment is currently operational in Tunisia. A live launch requires CMF authorization and a dedicated framework, coordination with the BCT, and agreements with sector bodies (ONH, GIFruits).",
    },
    footer: "CCE — demonstration prototype built for study purposes. Not an offer of investment services, not a CMF-licensed venue, not investment advice. Simulated quotes.",
  },
  ar: {
    dir: "rtl",
    exchange: "بورصة قرطاج للسلع",
    tagline: "سوق العقود الآجلة للسلع التونسية",
    risk: "تحذير (هيئة السوق المالية): تنطوي العقود الآجلة والخيارات على مخاطر خسارة قد تفوق رأس المال المستثمر. نموذج تجريبي — لم يُمنح أي ترخيص من هيئة السوق المالية، ولا توجد أي بيانات حقيقية.",
    session: "الحصّة مفتوحة — 09:00–14:30 (تونس)",
    clearing: "المقاصة (محاكاة): CCE Clearing",
    ccy: "التسعير: دينار تونسي (TND)",
    tabs: { markets: "الأسواق", options: "الخيارات", etf: "صناديق المؤشرات", trade: "التداول", portfolio: "المحفظة", specs: "مواصفات العقود", compliance: "الامتثال وهيئة السوق المالية", help: "المساعدة" },
    common: {
      last: "آخر سعر", chg: "التغيّر", settle: "سعر التسوية", vol: "الحجم (عقود)", oi: "المراكز المفتوحة", high: "الأعلى", low: "الأدنى",
      buy: "شراء", sell: "بيع", qty: "الكمية", price: "السعر", time: "الوقت", status: "الحالة", book: "دفتر الأوامر", side: "الاتجاه", submit: "إرسال", cancel: "إلغاء",
      filled: "منفّذ", rejected: "مرفوض", lots: "عقود", contracts: "عقد", perT: "د/طن", maturities: "الاستحقاقات", strike: "سعر التنفيذ",
      call: "خيار شراء", put: "خيار بيع", premium: "العلاوة", iv: "التقلب الضمني",
      greeks: { delta: "دلتا", gamma: "غاما", vega: "فيغا", theta: "ثيتا" },
    },
    trade: {
      orderTicket: "أمر التداول", ordType: "نوع الأمر", limit: "بسعر محدد", market: "بسعر السوق", pxLimit: "السعر المحدد (دينار/طن)",
      notional: "القيمة الاسمية", margin: "هامش الضمان", scanningRisk: "مخاطر المسح (SPAN مبسّط)", bands: "حدود التذبذب اليومية", posLimit: "حد المراكز",
      ackTxt: "أقرّ باستلامي وفهمي لنشرة المخاطر وأقبل نداءات الهامش اليومية.",
      ackWarn: "يرجى تأكيد الإقرار بالمخاطر قبل إرسال الأمر.",
      bandWarn: (lo, hi) => `السعر خارج حدود التذبذب (${lo} – ${hi} دينار/طن). رُفض الأمر من الرقابة القبلية.`,
      positionLimitWarn: "سيتجاوز هذا الأمر حد المراكز المسموح به. رُفض الأمر من الرقابة القبلية.",
      execOk: (id, s, q, c, m, p) => `نُفّذ الأمر ${id} — ${s} ${q} ${c} ${m} بسعر ${p} دينار/طن. مقاصة عبر CCE Clearing (محاكاة).`,
      orders: "أوامر اليوم", noOrders: "لم تُرسل أي أوامر خلال هذه الحصّة.",
      auditTrail: "أمر مختوم زمنيًا ومسجّل — يشترط وسيط بورصة مرخّص في بيئة حقيقية.",
    },
    etf: {
      title: "صناديق المؤشرات (ETF)", nav: "صافي قيمة الأصول", basket: "سلة المحاكاة", creationUnit: "وحدة الإنشاء",
      fee: "رسوم التصرف السنوية", subscribe: "اكتتاب", redeem: "استرداد", units: "حصص",
      mechanism: "اكتتاب واسترداد عيني بحصص إنشاء، مخصص للمشاركين المعتمدين؛ تداول مستمر للحصص في السوق الثانوية.",
    },
    options: { chain: "سلسلة الخيارات", calls: "خيارات الشراء", puts: "خيارات البيع", underlyingFuture: "الأصل الأساسي (عقد آجل)", model: "نموذج Black-76 على السعر الآجل" },
    portfolio: {
      cash: "الرصيد النقدي (حساب بالدينار)", usedMargin: "الهوامش المودعة", pnl: "الأرباح/الخسائر غير المحققة (اليوم)", positions: "المراكز المفتوحة", entry: "سعر الدخول",
      marginCall: "يُصدر نداء هامش إذا أصبحت الضمانات غير كافية (ت+1، 10:00).", noCall: "لا يوجد نداء هامش حاليًا.",
    },
    specTitle: "بطاقة مواصفات العقد",
    specRows: {
      unit: "وحدة التعاقد", quote: "طريقة التسعير", hours: "أوقات التداول", tick: "الحد الأدنى لتغير السعر", code: "رمز المنتج",
      listed: "الاستحقاقات المدرجة", settleM: "طريقة التسوية", lastDay: "آخر يوم تداول", delivery: "نقاط وإجراءات التسليم",
      grade: "الدرجة والجودة", limits: "حدود المراكز", bands: "حدود تغير الأسعار", rule: "الباب في نظام السوق", venue: "المنصة / القسم",
    },
    helpTitle: "المساعدة والشكايات",
    faq: [
      ["من يمكنه التداول في CCE؟", "في بيئة حقيقية: كل شخص أبرم اتفاقية مع وسيط بورصة مرخّص وأكمل استبيان الملاءمة وملف اعرف عميلك. هذا النموذج لا يتداول أي أداة حقيقية."],
      ["كيف تعمل نداءات الهامش؟", "تُقيَّم المراكز يوميًا بسعر التسوية. إذا نقصت الضمانات يُبلَّغ نداء هامش يجب تلبيته قبل الساعة 10:00 (ت+1)."],
      ["هل التسليم المادي إجباري؟", "لا. يمكن إغلاق المراكز قبل الاستحقاق. عند الاستحقاق يتم التسليم عبر المستودعات ومحطات التكييف المرخّصة في بيئة حقيقية."],
      ["كيف أقدّم شكاية؟", "في بيئة حقيقية: أولًا لدى الوسيط، ثم لدى هيئة السوق المالية — cmf.tn."],
    ],
    compliance: {
      kyc: "حالة الحساب — اعرف عميلك (محاكاة)", frame: "الإطار الترتيبي المرجعي", invest: "حماية المستثمر", docs: "الوثائق التعاقدية (نماذج)",
      investTxt: "في بيئة حقيقية: صندوق ضمان يموّله أعضاء المقاصة، فصل أصول الحرفاء لدى المودع، نشر يومي لأسعار التسوية والمراكز المفتوحة، حفظ الأوامر عشر سنوات.",
      warn: "تنبيه: لا يوجد اليوم قسم عملي للعقود الآجلة على السلع في تونس. يستوجب الإطلاق الفعلي ترخيصًا وإطارًا خاصًا من هيئة السوق المالية، والتنسيق مع البنك المركزي وهياكل القطاع.",
    },
    footer: "CCE — نموذج تجريبي أُنجز لأغراض الدراسة. لا يشكّل عرض خدمات استثمارية ولا منصة مرخّصة من هيئة السوق المالية ولا نصيحة استثمارية. أسعار محاكاة.",
  },
};
