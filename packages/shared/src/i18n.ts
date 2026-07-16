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
    futures: string;
    options: string;
    swaps: string;
    etf: string;
    trade: string;
    portfolio: string;
    specs: string;
    marketData: string;
    participants: string;
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
    insufficientMarginWarn: string;
    fatFingerWarn: string;
    genericRejectWarn: string;
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
    pricingTitle: string;
    pricingIntro: string;
    pricingInputs: string;
    pricingAssumption: string;
  };
  swap: {
    title: string;
    payFixed: string;
    receiveFixed: string;
    tenor: string;
    months: string;
    notional: string;
    fixedRate: string;
    floatingRate: string;
    referenceMaturity: string;
    mechanism: string;
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
  marketData: {
    title: string;
    historicalTitle: string;
    historicalTxt: string;
    apiTitle: string;
    apiTxt: string;
    tiersTitle: string;
    tiers: { name: string; latency: string; price: string }[];
    endpointsTitle: string;
    paymentTitle: string;
    paymentMethods: string[];
    providersTitle: string;
    providersTxt: string;
    providers: string[];
    chartTitle: string;
    downloadCsv: string;
    apiKeyTitle: string;
    apiKeyTxt: string;
    apiKeyBtn: string;
    apiKeyLoginPrompt: string;
  };
  participants: {
    title: string;
    usersTitle: string;
    usersTxt: string;
    usersSteps: string[];
    membershipTitle: string;
    membershipIntro: string;
    membershipTypes: { name: string; requirements: string; privileges: string }[];
    becomeMemberTxt: string;
    becomeMemberBtn: string;
    regulatorsTitle: string;
    regulatorsTxt: string;
    regulatorsPoints: string[];
    regulatorsListTitle: string;
    regulators: { name: string; role: string }[];
  };
  home: {
    productsTitle: string;
    resourcesTitle: string;
    explore: string;
    optionsTeaser: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    email: string;
    password: string;
    fullName: string;
    signInBtn: string;
    signUpBtn: string;
    logOutBtn: string;
    noAccount: string;
    haveAccount: string;
    guestNote: string;
    welcomeBack: string;
    signUpSubtitle: string;
    passwordHint: string;
    loggedInAs: string;
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
    tabs: { markets: "Marchés", futures: "Contrats à terme", options: "Options", swaps: "Swaps", etf: "ETF", trade: "Négociation", portfolio: "Portefeuille", specs: "Spécifications", marketData: "Données & API", participants: "Participants", compliance: "Conformité & CMF", help: "Assistance" },
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
      insufficientMarginWarn: "Dépôt de garantie disponible insuffisant pour couvrir cet ordre.",
      fatFingerWarn: "Quantité invalide (contrôle anti-erreur de saisie). Ordre rejeté par le contrôle pré-négociation.",
      genericRejectWarn: "Ordre rejeté par le contrôle pré-négociation.",
      execOk: (id, s, q, c, m, p) => `Ordre ${id} exécuté — ${s} ${q} ${c} ${m} à ${p} TND/t. Compensation CCE Clearing (J+1, simulée).`,
      orders: "Ordres du jour", noOrders: "Aucun ordre transmis pendant cette séance.",
      auditTrail: "Ordre horodaté et journalisé (piste d'audit) — intermédiaire en bourse agréé requis en environnement réel.",
    },
    etf: {
      title: "Fonds indiciels (ETF)", nav: "Valeur liquidative (VL)", basket: "Panier de réplication", creationUnit: "Bloc de création",
      fee: "Frais de gestion annuels", subscribe: "Souscrire", redeem: "Racheter", units: "Parts",
      mechanism: "Souscription/rachat en nature par blocs de création, réservés aux participants autorisés ; négociation continue en parts sur le marché secondaire.",
    },
    options: {
      chain: "Chaîne d'options", calls: "Calls", puts: "Puts", underlyingFuture: "Sous-jacent (contrat à terme)", model: "Modèle Black-76 sur prix à terme",
      pricingTitle: "Méthodologie de valorisation",
      pricingIntro: "Les options cotées sont des options européennes sur contrat à terme, valorisées par le modèle Black-76 (Black, 1976), l'extension du modèle Black-Scholes aux options sur prix à terme plutôt que sur un actif au comptant.",
      pricingInputs: "Variables : prix à terme courant (F), prix d'exercice (K), échéance résiduelle (T), taux d'actualisation (r) et volatilité implicite (σ). Les grecques (delta, gamma, vega, theta) sont dérivées analytiquement du même modèle.",
      pricingAssumption: "Simplification du prototype : volatilité constante par sous-jacent (non dérivée d'un marché d'options réel, car aucun n'existe aujourd'hui) et taux d'actualisation plat. Un marché réel utiliserait une surface de volatilité calibrée sur les prix cotés.",
    },
    swap: {
      title: "Swaps de matières premières",
      payFixed: "Payeur du fixe",
      receiveFixed: "Receveur du fixe",
      tenor: "Durée",
      months: "mois",
      notional: "Notionnel",
      fixedRate: "Taux fixe",
      floatingRate: "Taux flottant (référence)",
      referenceMaturity: "Échéance de référence",
      mechanism: "Swap compensé central à jambe unique : une partie paie un prix fixe et reçoit le prix de règlement flottant du contrat à terme sous-jacent à l'échéance la plus proche de la durée choisie (et inversement). Aucune livraison physique ; réévaluation quotidienne comme un contrat à terme.",
    },
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
    marketData: {
      title: "Données de marché & API",
      historicalTitle: "Données historiques",
      historicalTxt: "Prix de règlement quotidiens simulés, disponibles à l'écran et par export. Dans un environnement réel, l'historique proviendrait du Bulletin officiel de la Bourse (archives réglementaires, dix ans de conservation).",
      apiTitle: "Portail développeurs — utilisateurs abonnés",
      apiTxt: "Accès réservé aux comptes enregistrés et validés (KYC), soumis à une convention de redistribution des données (market data agreement). Transport TLS 1.3, authentification Bearer, quotas par palier.",
      tiersTitle: "Paliers d'accès",
      tiers: [
        { name: "Différé (15 min)", latency: "Retard 15 min, REST uniquement", price: "Gratuit — compte enregistré" },
        { name: "Temps réel", latency: "REST + WebSocket temps réel", price: "Abonnement mensuel" },
        { name: "Historique en gros", latency: "Export en masse, archives complètes", price: "Sur devis — professionnels" },
      ],
      endpointsTitle: "Points d'accès REST v1 (exemples)",
      paymentTitle: "Moyens de paiement (abonnements & frais)",
      paymentMethods: [
        "Virement bancaire (compte séquestre dépositaire)",
        "Prélèvement automatique — mandat SEPA/local",
        "Carte bancaire (paiement en ligne sécurisé)",
        "Compensation directe sur compte espèces TND de l'intermédiaire",
      ],
      providersTitle: "Fournisseurs et diffuseurs de données",
      providersTxt: "Exemples illustratifs du type de partenaires de diffusion qu'une bourse réelle solliciterait — aucun accord réel n'existe avec les entités ci-dessous ; ce ne sont pas des partenaires de CCE.",
      providers: [
        "Diffuseur financier régional (agrégateur de flux boursiers)",
        "Fournisseur de terminaux de marché (type Bloomberg/Refinitiv, à titre d'exemple)",
        "Médias économiques locaux (rediffusion des prix de clôture)",
        "Fournisseur de données historiques / recherche académique",
      ],
      chartTitle: "Série de règlement quotidien",
      downloadCsv: "Télécharger en CSV",
      apiKeyTitle: "Clé API (démonstration)",
      apiKeyTxt: "Une fois connecté, générez une clé API de démonstration pour simuler l'authentification Bearer décrite ci-dessus. Aucune clé n'ouvre un accès réel à des données financières.",
      apiKeyBtn: "Générer une clé de démonstration",
      apiKeyLoginPrompt: "Connectez-vous pour générer une clé API de démonstration.",
    },
    participants: {
      title: "Participants au marché",
      usersTitle: "Pour les utilisateurs (traders & membres)",
      usersTxt: "Toute personne physique ou morale souhaitant négocier doit passer par un intermédiaire en bourse agréé.",
      usersSteps: [
        "Signature d'une convention avec un intermédiaire en bourse agréé",
        "Questionnaire d'adéquation (profil de risque, connaissance des instruments dérivés)",
        "Dossier KYC/LBC-FT — pièce d'identité, RNE pour les personnes morales, bénéficiaires effectifs",
        "Remise et accusé de réception de la note d'information visée par le CMF",
        "Dépôt initial de garantie avant toute négociation",
      ],
      membershipTitle: "Catégories d'adhésion (inspirées de CME/ICE)",
      membershipIntro: "Une bourse de dérivés réelle distingue plusieurs catégories de participants selon le niveau d'accès et de responsabilité financière. Aperçu illustratif :",
      membershipTypes: [
        { name: "Client individuel / Trader particulier", requirements: "KYC, questionnaire d'adéquation, dépôt de garantie initial", privileges: "Négociation via un intermédiaire agréé, accès temps réel différé" },
        { name: "Client institutionnel / Corporate", requirements: "KYC renforcé, RNE, bénéficiaires effectifs, convention-cadre ISDA-like", privileges: "Lignes de crédit négociées, accès API abonné, rapports dédiés" },
        { name: "Adhérent compensateur (Clearing Member)", requirements: "Agrément CMF, fonds propres minimaux, contribution au fonds de garantie", privileges: "Compensation pour compte propre et clients, accès direct à Tunisie Clearing" },
        { name: "Teneur de marché (Market Maker)", requirements: "Convention de tenue de marché, obligations de cotation continue", privileges: "Remises sur frais de transaction, accès prioritaire au carnet d'ordres" },
      ],
      becomeMemberTxt: "Dans ce prototype, la création d'un compte de démonstration simule la première étape du parcours d'adhésion — aucune vérification réelle n'est effectuée.",
      becomeMemberBtn: "Créer un compte de démonstration",
      regulatorsTitle: "Pour les régulateurs",
      regulatorsTxt: "Le Conseil du Marché Financier (CMF) exercerait la surveillance prudentielle et comportementale d'une bourse de matières premières réelle, avec accès direct aux données de marché et à la piste d'audit.",
      regulatorsPoints: [
        "Accès en lecture aux carnets d'ordres, transactions et positions ouvertes en temps réel",
        "Piste d'audit complète des ordres et communications, conservée dix ans",
        "Rapports réglementaires périodiques (positions importantes, incidents de marché)",
        "Pouvoir de suspension et d'enquête en cas de manipulation de cours ou d'opération d'initié",
        "Coordination avec la Banque Centrale de Tunisie (régime des changes) et la CTAF (LBC-FT)",
      ],
      regulatorsListTitle: "Autorités et organismes concernés",
      regulators: [
        { name: "Conseil du Marché Financier (CMF)", role: "Régulateur du marché financier — agrément, surveillance, sanctions" },
        { name: "Tunisie Clearing", role: "Dépositaire central et organe de compensation-règlement" },
        { name: "Banque Centrale de Tunisie (BCT)", role: "Régime des changes, stabilité monétaire et financière" },
        { name: "CTAF", role: "Commission tunisienne des analyses financières — lutte anti-blanchiment (LBC/FT)" },
        { name: "INPDP", role: "Instance nationale de protection des données personnelles" },
      ],
    },
    home: {
      productsTitle: "Produits cotés",
      resourcesTitle: "Ressources",
      explore: "Explorer",
      optionsTeaser: "Options européennes sur contrats à terme HOV et DGN, valorisées par le modèle Black-76, sur les 12 échéances cotées.",
    },
    auth: {
      signIn: "Connexion",
      signUp: "Créer un compte",
      email: "Adresse e-mail",
      password: "Mot de passe",
      fullName: "Nom complet",
      signInBtn: "Se connecter",
      signUpBtn: "Créer mon compte",
      logOutBtn: "Déconnexion",
      noAccount: "Pas encore de compte ?",
      haveAccount: "Déjà un compte ?",
      guestNote: "Vous naviguez en tant qu'invité sur le compte de démonstration partagé. Connectez-vous pour disposer de votre propre compte simulé.",
      welcomeBack: "Heureux de vous revoir",
      signUpSubtitle: "Créez un compte de démonstration — aucune donnée réelle, aucun agrément CMF.",
      passwordHint: "8 caractères minimum.",
      loggedInAs: "Connecté en tant que",
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
    tabs: { markets: "Markets", futures: "Futures", options: "Options", swaps: "Swaps", etf: "ETFs", trade: "Trading", portfolio: "Portfolio", specs: "Contract Specs", marketData: "Data & API", participants: "Participants", compliance: "Compliance", help: "Support" },
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
      insufficientMarginWarn: "Insufficient available margin to cover this order.",
      fatFingerWarn: "Invalid quantity (fat-finger control). Order rejected by pre-trade controls.",
      genericRejectWarn: "Order rejected by pre-trade controls.",
      execOk: (id, s, q, c, m, p) => `Order ${id} filled — ${s} ${q} ${c} ${m} at ${p} TND/t. Cleared by CCE Clearing (T+1, simulated).`,
      orders: "Today's orders", noOrders: "No orders submitted this session.",
      auditTrail: "Order time-stamped and journaled (audit trail) — a licensed broker would be required in a real environment.",
    },
    etf: {
      title: "Index funds (ETFs)", nav: "Net asset value (NAV)", basket: "Replication basket", creationUnit: "Creation unit",
      fee: "Annual management fee", subscribe: "Subscribe", redeem: "Redeem", units: "Units",
      mechanism: "In-kind creation/redemption in baskets, reserved to authorized participants; continuous secondary-market trading in units.",
    },
    options: {
      chain: "Options chain", calls: "Calls", puts: "Puts", underlyingFuture: "Underlying (futures contract)", model: "Black-76 model on the futures price",
      pricingTitle: "Pricing methodology",
      pricingIntro: "Listed options are European options on a futures contract, priced with the Black-76 model (Black, 1976) — the extension of Black-Scholes to options on a forward/futures price rather than a spot asset.",
      pricingInputs: "Inputs: current futures price (F), strike (K), time to expiry (T), discount rate (r) and implied volatility (σ). The Greeks (delta, gamma, vega, theta) are derived analytically from the same model.",
      pricingAssumption: "Prototype simplification: a flat volatility per underlying (not derived from a real options market, since none exists today) and a flat discount rate. A real market would use a volatility surface calibrated to quoted prices.",
    },
    swap: {
      title: "Commodity swaps",
      payFixed: "Pay fixed",
      receiveFixed: "Receive fixed",
      tenor: "Tenor",
      months: "months",
      notional: "Notional",
      fixedRate: "Fixed rate",
      floatingRate: "Floating rate (reference)",
      referenceMaturity: "Reference maturity",
      mechanism: "Centrally-cleared, single-leg swap: one party pays a fixed price and receives the floating settlement price of the underlying future nearest the chosen tenor (and vice versa). No physical delivery; marked to market daily like a future.",
    },
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
    marketData: {
      title: "Market Data & API",
      historicalTitle: "Historical data",
      historicalTxt: "Simulated daily settlement prices, viewable on-screen and exportable. In a real environment, the archive would come from the exchange's official bulletin (regulatory records, ten-year retention).",
      apiTitle: "Developer portal — subscribed users",
      apiTxt: "Access restricted to registered, KYC-validated accounts, subject to a market data redistribution agreement. TLS 1.3 transport, Bearer authentication, per-tier quotas.",
      tiersTitle: "Access tiers",
      tiers: [
        { name: "Delayed (15 min)", latency: "15-minute delay, REST only", price: "Free — registered account" },
        { name: "Real-time", latency: "REST + real-time WebSocket", price: "Monthly subscription" },
        { name: "Bulk historical", latency: "Bulk export, full archive", price: "Quote-based — professional" },
      ],
      endpointsTitle: "REST v1 endpoints (examples)",
      paymentTitle: "Payment methods (subscriptions & fees)",
      paymentMethods: [
        "Bank transfer (depository escrow account)",
        "Direct debit — SEPA/local mandate",
        "Card payment (secure online checkout)",
        "Direct offset against the broker's TND cash account",
      ],
      providersTitle: "Data providers & redistributors",
      providersTxt: "Illustrative examples of the kind of redistribution partners a real exchange would work with — no real agreement exists with the entities below; they are not partners of CCE.",
      providers: [
        "Regional financial data aggregator",
        "Market-data terminal vendor (e.g. Bloomberg/Refinitiv-style, illustrative only)",
        "Local financial media (closing-price rebroadcast)",
        "Historical data / academic research provider",
      ],
      chartTitle: "Daily settlement series",
      downloadCsv: "Download CSV",
      apiKeyTitle: "API key (demonstration)",
      apiKeyTxt: "Once signed in, generate a demo API key to simulate the Bearer authentication described above. No key grants real access to financial data.",
      apiKeyBtn: "Generate demo key",
      apiKeyLoginPrompt: "Sign in to generate a demo API key.",
    },
    participants: {
      title: "Market participants",
      usersTitle: "For users (traders & members)",
      usersTxt: "Any individual or legal entity wishing to trade must go through a licensed broker.",
      usersSteps: [
        "Sign an agreement with a licensed broker",
        "Suitability questionnaire (risk profile, knowledge of derivatives)",
        "KYC/AML file — ID, corporate registry for legal entities, beneficial owners",
        "Receipt and acknowledgement of the CMF-approved information notice",
        "Initial margin deposit before any trading",
      ],
      membershipTitle: "Membership categories (CME/ICE-inspired)",
      membershipIntro: "A real derivatives exchange distinguishes several participant categories by access level and financial responsibility. Illustrative overview:",
      membershipTypes: [
        { name: "Individual client / Retail trader", requirements: "KYC, suitability questionnaire, initial margin deposit", privileges: "Trading via a licensed broker, delayed real-time access" },
        { name: "Institutional / Corporate client", requirements: "Enhanced KYC, corporate registry, beneficial owners, ISDA-like master agreement", privileges: "Negotiated credit lines, subscriber API access, dedicated reporting" },
        { name: "Clearing member", requirements: "CMF license, minimum capital, guarantee-fund contribution", privileges: "Clears for own account and clients, direct access to Tunisie Clearing" },
        { name: "Market maker", requirements: "Market-making agreement, continuous quoting obligations", privileges: "Transaction-fee rebates, priority order-book access" },
      ],
      becomeMemberTxt: "In this prototype, creating a demo account simulates the first step of the membership journey — no real verification is performed.",
      becomeMemberBtn: "Create a demo account",
      regulatorsTitle: "For regulators",
      regulatorsTxt: "The Conseil du Marché Financier (CMF) would exercise prudential and conduct supervision of a real commodity exchange, with direct access to market data and the audit trail.",
      regulatorsPoints: [
        "Real-time read access to order books, trades, and open positions",
        "Complete audit trail of orders and communications, kept ten years",
        "Periodic regulatory reporting (large positions, market incidents)",
        "Power to suspend trading and investigate price manipulation or insider dealing",
        "Coordination with the Central Bank of Tunisia (exchange control) and CTAF (AML/CFT)",
      ],
      regulatorsListTitle: "Relevant authorities & bodies",
      regulators: [
        { name: "Conseil du Marché Financier (CMF)", role: "Financial market regulator — licensing, supervision, sanctions" },
        { name: "Tunisie Clearing", role: "Central depository and clearing & settlement body" },
        { name: "Central Bank of Tunisia (BCT)", role: "Exchange control, monetary and financial stability" },
        { name: "CTAF", role: "Tunisian Financial Analysis Commission — AML/CFT" },
        { name: "INPDP", role: "National Authority for the Protection of Personal Data" },
      ],
    },
    home: {
      productsTitle: "Listed products",
      resourcesTitle: "Resources",
      explore: "Explore",
      optionsTeaser: "European options on HOV and DGN futures, priced with the Black-76 model, across all 12 listed maturities.",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Create Account",
      email: "Email address",
      password: "Password",
      fullName: "Full name",
      signInBtn: "Sign in",
      signUpBtn: "Create my account",
      logOutBtn: "Log out",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      guestNote: "You are browsing as a guest on the shared demo account. Sign in to get your own simulated account.",
      welcomeBack: "Welcome back",
      signUpSubtitle: "Create a demo account — no real data, no CMF authorization.",
      passwordHint: "8 characters minimum.",
      loggedInAs: "Signed in as",
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
    tabs: { markets: "الأسواق", futures: "العقود الآجلة", options: "الخيارات", swaps: "المبادلات", etf: "صناديق المؤشرات", trade: "التداول", portfolio: "المحفظة", specs: "مواصفات العقود", marketData: "البيانات وواجهة API", participants: "المتعاملون", compliance: "الامتثال وهيئة السوق المالية", help: "المساعدة" },
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
      insufficientMarginWarn: "هامش الضمان المتاح غير كافٍ لتغطية هذا الأمر.",
      fatFingerWarn: "كمية غير صالحة (رقابة الأخطاء الجسيمة). رُفض الأمر من الرقابة القبلية.",
      genericRejectWarn: "رُفض الأمر من الرقابة القبلية.",
      execOk: (id, s, q, c, m, p) => `نُفّذ الأمر ${id} — ${s} ${q} ${c} ${m} بسعر ${p} دينار/طن. مقاصة عبر CCE Clearing (محاكاة).`,
      orders: "أوامر اليوم", noOrders: "لم تُرسل أي أوامر خلال هذه الحصّة.",
      auditTrail: "أمر مختوم زمنيًا ومسجّل — يشترط وسيط بورصة مرخّص في بيئة حقيقية.",
    },
    etf: {
      title: "صناديق المؤشرات (ETF)", nav: "صافي قيمة الأصول", basket: "سلة المحاكاة", creationUnit: "وحدة الإنشاء",
      fee: "رسوم التصرف السنوية", subscribe: "اكتتاب", redeem: "استرداد", units: "حصص",
      mechanism: "اكتتاب واسترداد عيني بحصص إنشاء، مخصص للمشاركين المعتمدين؛ تداول مستمر للحصص في السوق الثانوية.",
    },
    options: {
      chain: "سلسلة الخيارات", calls: "خيارات الشراء", puts: "خيارات البيع", underlyingFuture: "الأصل الأساسي (عقد آجل)", model: "نموذج Black-76 على السعر الآجل",
      pricingTitle: "منهجية التسعير",
      pricingIntro: "الخيارات المدرجة هي خيارات أوروبية على عقد آجل، تُسعَّر بنموذج Black-76 (بلاك، 1976)، وهو امتداد لنموذج Black-Scholes على السعر الآجل بدلاً من الأصل الفوري.",
      pricingInputs: "المتغيرات: السعر الآجل الحالي (F)، سعر التنفيذ (K)، المدة المتبقية حتى الاستحقاق (T)، معدل الخصم (r) والتقلب الضمني (σ). تُشتق اليونانيات (دلتا، غاما، فيغا، ثيتا) تحليليًا من نفس النموذج.",
      pricingAssumption: "تبسيط النموذج التجريبي: تقلب ثابت لكل أصل أساسي (غير مستمد من سوق خيارات حقيقي لعدم وجوده حاليًا) ومعدل خصم ثابت. سيستعمل السوق الحقيقي سطح تقلب مُعايرًا وفق الأسعار المتداولة.",
    },
    swap: {
      title: "مبادلات السلع",
      payFixed: "دافع السعر الثابت",
      receiveFixed: "قابض السعر الثابت",
      tenor: "المدة",
      months: "أشهر",
      notional: "القيمة الاسمية",
      fixedRate: "السعر الثابت",
      floatingRate: "السعر المتغير (مرجعي)",
      referenceMaturity: "الاستحقاق المرجعي",
      mechanism: "مبادلة أحادية الجزء ذات مقاصة مركزية: يدفع طرف سعرًا ثابتًا ويقبض سعر التسوية المتغير لعقد آجل مرجعي أقرب لمدة المبادلة المختارة (والعكس صحيح). دون تسليم مادي؛ تُقيَّم يوميًا كعقد آجل.",
    },
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
    marketData: {
      title: "بيانات السوق وواجهة API",
      historicalTitle: "البيانات التاريخية",
      historicalTxt: "أسعار تسوية يومية محاكاة، قابلة للعرض والتصدير. في بيئة حقيقية، تصدر الأرشيفات عن النشرة الرسمية للبورصة (سجلات رقابية، حفظ لعشر سنوات).",
      apiTitle: "بوابة المطورين — للمستخدمين المشتركين",
      apiTxt: "نفاذ مقتصر على الحسابات المسجّلة والمصادَق عليها (اعرف عميلك)، ويخضع لاتفاقية إعادة توزيع بيانات السوق. نقل TLS 1.3، مصادقة Bearer، وحصص حسب الفئة.",
      tiersTitle: "فئات النفاذ",
      tiers: [
        { name: "مؤجل (15 دقيقة)", latency: "تأخير 15 دقيقة، REST فقط", price: "مجاني — حساب مسجّل" },
        { name: "الوقت الفعلي", latency: "REST + بث WebSocket فوري", price: "اشتراك شهري" },
        { name: "بيانات تاريخية بالجملة", latency: "تصدير جماعي، أرشيف كامل", price: "حسب الطلب — للمهنيين" },
      ],
      endpointsTitle: "نقاط نفاذ REST v1 (أمثلة)",
      paymentTitle: "وسائل الدفع (الاشتراكات والرسوم)",
      paymentMethods: [
        "تحويل بنكي (حساب ضمان لدى المودع)",
        "اقتطاع آلي — تفويض محلي",
        "الدفع بالبطاقة البنكية (دفع إلكتروني آمن)",
        "مقاصة مباشرة على الحساب النقدي بالدينار لدى الوسيط",
      ],
      providersTitle: "مزودو وموزعو البيانات",
      providersTxt: "أمثلة توضيحية لنوعية شركاء النشر التي قد تتعامل معها بورصة حقيقية — لا يوجد أي اتفاق فعلي مع الجهات أدناه؛ وهي ليست شركاء لـCCE.",
      providers: [
        "مجمّع بيانات مالية إقليمي",
        "مزود منصات بيانات السوق (على غرار Bloomberg/Refinitiv، لأغراض توضيحية فقط)",
        "وسائل إعلام اقتصادية محلية (إعادة بث أسعار الإغلاق)",
        "مزود بيانات تاريخية / بحث أكاديمي",
      ],
      chartTitle: "سلسلة أسعار التسوية اليومية",
      downloadCsv: "تنزيل بصيغة CSV",
      apiKeyTitle: "مفتاح API (تجريبي)",
      apiKeyTxt: "بعد تسجيل الدخول، أنشئ مفتاح API تجريبيًا لمحاكاة مصادقة Bearer الموصوفة أعلاه. لا يمنح أي مفتاح نفاذًا حقيقيًا إلى بيانات مالية.",
      apiKeyBtn: "إنشاء مفتاح تجريبي",
      apiKeyLoginPrompt: "سجّل الدخول لإنشاء مفتاح API تجريبي.",
    },
    participants: {
      title: "المتعاملون في السوق",
      usersTitle: "للمستخدمين (المتداولون والأعضاء)",
      usersTxt: "على كل شخص طبيعي أو معنوي يرغب في التداول المرور عبر وسيط بورصة مرخّص.",
      usersSteps: [
        "إبرام اتفاقية مع وسيط بورصة مرخّص",
        "استبيان الملاءمة (درجة تحمل المخاطر، معرفة الأدوات المشتقة)",
        "ملف اعرف عميلك/مكافحة غسل الأموال — بطاقة تعريف، السجل الوطني للمؤسسات للأشخاص المعنويين، المستفيدون الفعليون",
        "استلام والإقرار بنشرة المعلومات المؤشرة من هيئة السوق المالية",
        "إيداع هامش ضمان أولي قبل أي تداول",
      ],
      membershipTitle: "فئات العضوية (على غرار CME/ICE)",
      membershipIntro: "تميّز بورصة مشتقات حقيقية بين عدة فئات من المتعاملين حسب مستوى النفاذ والمسؤولية المالية. لمحة توضيحية:",
      membershipTypes: [
        { name: "عميل فردي / متداول خاص", requirements: "اعرف عميلك، استبيان الملاءمة، هامش ضمان أولي", privileges: "التداول عبر وسيط مرخّص، نفاذ شبه فوري مؤجل" },
        { name: "عميل مؤسساتي / شركة", requirements: "اعرف عميلك المعزز، السجل الوطني للمؤسسات، المستفيدون الفعليون، اتفاقية إطارية", privileges: "خطوط ائتمان متفاوض عليها، نفاذ API للمشتركين، تقارير مخصصة" },
        { name: "عضو مقاصة (Clearing Member)", requirements: "ترخيص من هيئة السوق المالية، حد أدنى من رأس المال، مساهمة في صندوق الضمان", privileges: "المقاصة لحسابه الخاص وعملائه، نفاذ مباشر إلى Tunisie Clearing" },
        { name: "صانع سوق (Market Maker)", requirements: "اتفاقية صناعة سوق، التزامات تسعير مستمرة", privileges: "تخفيضات على رسوم المعاملات، نفاذ ذو أولوية لدفتر الأوامر" },
      ],
      becomeMemberTxt: "في هذا النموذج التجريبي، يحاكي إنشاء حساب تجريبي الخطوة الأولى من مسار العضوية — لا يتم إجراء أي تحقق حقيقي.",
      becomeMemberBtn: "إنشاء حساب تجريبي",
      regulatorsTitle: "للمنظمين",
      regulatorsTxt: "تمارس هيئة السوق المالية (CMF) الرقابة الاحترازية والسلوكية على بورصة سلع حقيقية، مع نفاذ مباشر إلى بيانات السوق وسجل التدقيق.",
      regulatorsPoints: [
        "نفاذ بالقراءة في الوقت الفعلي إلى دفاتر الأوامر والصفقات والمراكز المفتوحة",
        "سجل تدقيق كامل للأوامر والمراسلات، محفوظ عشر سنوات",
        "تقارير رقابية دورية (المراكز الكبرى، حوادث السوق)",
        "صلاحية إيقاف التداول والتحقيق في التلاعب بالأسعار أو استغلال المعلومات الامتيازية",
        "التنسيق مع البنك المركزي التونسي (نظام الصرف) ولجنة التحاليل المالية (مكافحة غسل الأموال)",
      ],
      regulatorsListTitle: "الجهات والهيئات المعنية",
      regulators: [
        { name: "هيئة السوق المالية (CMF)", role: "منظّم السوق المالية — الترخيص والرقابة والعقوبات" },
        { name: "Tunisie Clearing", role: "الوديع المركزي وهيئة المقاصة والتسوية" },
        { name: "البنك المركزي التونسي (BCT)", role: "نظام الصرف والاستقرار النقدي والمالي" },
        { name: "لجنة التحاليل المالية (CTAF)", role: "مكافحة غسل الأموال وتمويل الإرهاب" },
        { name: "الهيئة الوطنية لحماية المعطيات الشخصية (INPDP)", role: "حماية المعطيات الشخصية" },
      ],
    },
    home: {
      productsTitle: "المنتجات المدرجة",
      resourcesTitle: "الموارد",
      explore: "استكشاف",
      optionsTeaser: "خيارات أوروبية على العقود الآجلة HOV وDGN، مسعّرة بنموذج Black-76، على كامل الآجال الاثني عشر المدرجة.",
    },
    auth: {
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      signInBtn: "تسجيل الدخول",
      signUpBtn: "إنشاء حسابي",
      logOutBtn: "تسجيل الخروج",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب بالفعل؟",
      guestNote: "أنت تتصفح كزائر على الحساب التجريبي المشترك. سجّل الدخول للحصول على حسابك المحاكى الخاص.",
      welcomeBack: "أهلاً بعودتك",
      signUpSubtitle: "أنشئ حسابًا تجريبيًا — لا بيانات حقيقية، لا ترخيص من هيئة السوق المالية.",
      passwordHint: "8 أحرف على الأقل.",
      loggedInAs: "متصل باسم",
    },
    footer: "CCE — نموذج تجريبي أُنجز لأغراض الدراسة. لا يشكّل عرض خدمات استثمارية ولا منصة مرخّصة من هيئة السوق المالية ولا نصيحة استثمارية. أسعار محاكاة.",
  },
};

/**
 * Maps a rejected order's structured reasonCode to the localized message,
 * instead of surfacing the server's raw technical rejectReason string to
 * end users. `band` is only used for OUT_OF_BAND on futures orders, where
 * the caller knows the current session's price band.
 */
export function rejectionMessage(
  t: Dict,
  order: { reasonCode?: string; rejectReason?: string },
  band?: { lo: string; hi: string }
): string {
  switch (order.reasonCode) {
    case "NO_ACK":
      return t.trade.ackWarn;
    case "OUT_OF_BAND":
      return band ? t.trade.bandWarn(band.lo, band.hi) : t.trade.genericRejectWarn;
    case "POSITION_LIMIT":
      return t.trade.positionLimitWarn;
    case "INSUFFICIENT_MARGIN":
      return t.trade.insufficientMarginWarn;
    case "FAT_FINGER":
      return t.trade.fatFingerWarn;
    default:
      return t.trade.genericRejectWarn;
  }
}
