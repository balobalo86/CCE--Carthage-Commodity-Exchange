# Architecture

CCE is a monorepo (`pnpm` workspaces) with four packages:

```
packages/shared   contract specs, Black-76 pricer, margin math, i18n (fr/ar/en), shared types
apps/api          simulated exchange backend — Express (REST) + ws (WebSocket)
apps/web          trading terminal — Vite + React + TypeScript
apps/mobile       iOS/Android app — Expo + React Native + TypeScript
```

Both clients talk to the same backend, so opening the web terminal and the mobile app side by
side shows the same order book, prices, and account state converging in real time — the point is
to demonstrate a coherent multi-client trading system, not just a static UI mock.

## What's genuinely implemented (not hand-waved)

- **Price-time priority matching** (`apps/api/src/orderBook.ts`): resting liquidity is synthetic
  (reseeded around the last trade price on each tick), but every incoming order — market or limit
  — walks the book level by level, best price and oldest-first at a given price, exactly like a
  real limit order book. This is a genuine (if small-scale) matching engine, not a random-number
  generator dressed up as one.
- **Pre-trade risk controls** (`apps/api/src/riskEngine.ts`): risk-acknowledgement gate, fat-finger
  size cap, static ±3% daily price bands, and per-account net / front-month position limits, all
  enforced server-side before an order can match.
- **Black-76 options pricing** (`packages/shared/src/pricing.ts`): a real closed-form
  option-on-a-future pricer with delta/gamma/vega/theta, driven by the live simulated futures
  price, a flat per-contract volatility assumption, and a flat discount rate — not a lookup table.
- **Simplified SPAN-style margining** (`spanScenarioMargin`): reprices short option positions
  across a 9×3 grid of price and volatility shocks and takes the worst-case loss as the margin
  requirement — a real (if much smaller) scenario-based scanning-risk calculation, in the spirit
  of CME's SPAN methodology, not the full certified array.
- **ETF creation/redemption at NAV**: NAV is computed each tick from a weighted basket of the two
  nearest futures maturities; subscriptions/redemptions move real cash and real unit positions in
  the simulated ledger.

## What's simulated / assumed

- All prices are a random walk clamped to a daily band around a synthetic reference price — there
  is no real underlying market for Tunisian olive oil or dates futures.
- Implied volatility is a flat, hand-picked constant per contract (HOV 22%, DGN 26%), not derived
  from any real market.
- There is a single demo account (`demo`) per client install; there is no real authentication,
  KYC, or multi-user account system.
- "Clearing" is an in-memory ledger inside the API process — it is not connected to Tunisie
  Clearing, a bank, or any custodian. Restarting the API resets all state.

## What a real, CMF-authorized venue would additionally need

This prototype intentionally does **not** attempt to build (and no amount of further coding alone
could produce, absent the underlying legal/institutional steps):

1. **Regulatory authorization** — a CMF license for the venue itself, approved rulebook, and a
   visa on the investor information notice; none of which can be obtained by writing software.
2. **A real central counterparty** — a clearing agreement with Tunisie Clearing (or a newly
   authorized CCP), a default fund, real segregated custody of client margin, and real daily
   cash settlement across the banking system.
3. **A production-grade matching engine** — for genuine institutional throughput and latency
   guarantees, a single-threaded, in-memory core (e.g. an LMAX Disruptor-style ring buffer in
   Rust/C++/Java) rather than a Node.js event loop; this prototype's matching engine is correct
   in its logic but not built for HFT-grade throughput or co-location.
4. **Institutional connectivity** — FIX 4.4/5.0 order routing and a binary market-data feed
   (comparable to ITCH/OUCH or SBE) for direct market access, in addition to the REST/WebSocket
   API used here.
5. **Regulatory-grade audit infrastructure** — PTP-synchronized clocks, an immutable 10-year audit
   trail, and market-surveillance tooling for manipulation/insider-dealing detection.
6. **Real KYC/AML, custody, and banking rails** — actual identity verification, CTAF-compliant
   suspicious-activity monitoring, segregated client cash accounts at a licensed bank, and BCT
   coordination for any non-resident / foreign-currency flows.
7. **Physical delivery logistics** — binding agreements with ONH (olive oil) and GIFruits (dates)
   for licensed warehouses/packing stations, quality inspection, and warehouse-receipt (warrant)
   transfer.

See `docs/COMPLIANCE.md` for how each of these maps to specific Tunisian legal texts, and
`DISCLAIMER.md` for the plain-language summary.
