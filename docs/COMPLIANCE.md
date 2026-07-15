# Regulatory mapping (reference only — not legal advice)

This prototype's compliance-themed screens (account status, contract specs, risk disclosures)
are modeled on the Tunisian financial-market framework below, purely to illustrate what a real
platform would need to integrate with. **None of this constitutes a license, an approval, or
legal advice**, and CCE itself holds none of the authorizations listed here.

| Area | Reference text / body | How it would apply to a real venue |
|---|---|---|
| Market supervision | Conseil du Marché Financier (CMF) | Any commodity-futures exchange, its rulebook, and its offering documents would need CMF authorization before operating. |
| Market organization | Loi n° 94-117 du 14 novembre 1994, portant réorganisation du marché financier | The foundational law establishing the CMF and the legal structure of Tunisian regulated markets — the reference framework a new derivatives segment would be built under. |
| Trading rules | Règlement général de la Bourse (BVMT) | Defines trading sessions, price bands, halts, and disciplinary rules; a commodities segment would need an equivalent, CMF-approved rulebook chapter. |
| Clearing & settlement | Tunisie Clearing | Tunisia's central securities depository and clearing house; a real futures market would need a dedicated clearing agreement (and likely CCP-style default-fund arrangements) with them or an equivalent authorized body. |
| Anti-money-laundering / CFT | Loi organique n° 2015-26 du 7 août 2015, relative à la lutte contre le terrorisme et la répression du blanchiment d'argent; Commission Tunisienne des Analyses Financières (CTAF) | Governs KYC due diligence, beneficial-ownership checks, and suspicious-transaction reporting for account opening and ongoing monitoring. |
| Personal data | Loi n° 2004-63 du 27 juillet 2004, relative à la protection des données à caractère personnel; INPDP | Governs how client identity and trading data may be collected, stored, and processed. |
| Electronic transactions | Loi n° 2000-83 du 9 août 2000, relative aux échanges et au commerce électroniques | Governs electronic order submission, e-signatures, and the legal validity of electronic contractual documents. |
| Exchange control | Code des changes; Banque Centrale de Tunisie (BCT) | The Tunisian dinar is not freely convertible; any non-resident participation or foreign-currency-linked settlement would require BCT authorization. |
| Underlying quality / delivery | Office National de l'Huile (ONH); Groupement Interprofessionnel des Fruits (GIFruits) | Real physical delivery of olive oil or dates would depend on these bodies' licensed warehouses/packing stations and grading standards. |

## Gap between this prototype and a licensed venue

- **Account status shown in the app is simulated.** The "KYC / AML-CFT" panel reflects a
  hard-coded demo state, not a real identity-verification or beneficial-ownership check.
- **The risk-acknowledgement checkbox is a UI gate only.** In a real venue, risk disclosure would
  be a CMF-visa'd information notice delivered and acknowledged as part of a binding brokerage
  agreement, not a checkbox in a demo app.
- **No real money movement.** Cash balances, margin calls, and settlement are in-memory numbers;
  no bank, custodian, or clearing house is involved.
- **No real product approval.** The contract specifications (grade, delivery points, tick size,
  position limits) are illustrative, modeled loosely on ONH/GIFruits quality standards, but have
  not been reviewed or approved by anyone.

## Indicative path to a real launch

1. Feasibility and market-structure study with the CMF, including whether a new regulated market
   segment or a separate authorized venue is the right vehicle.
2. Draft rulebook, contract specifications, and risk-disclosure documents; CMF review and visa.
3. Clearing and settlement agreement with Tunisie Clearing (or a newly authorized CCP), including
   default-fund sizing and margining methodology sign-off.
4. Agreements with ONH and GIFruits for licensed delivery warehouses/packing stations and quality
   arbitration procedures.
5. BCT coordination on currency/settlement treatment, particularly for any non-resident access.
6. Licensed-broker onboarding, KYC/AML program aligned with CTAF requirements, and investor
   compensation/guarantee-fund arrangements.
7. Independent technology and security audit (including the market-surveillance and audit-trail
   capabilities described in `docs/ARCHITECTURE.md`) before go-live.
