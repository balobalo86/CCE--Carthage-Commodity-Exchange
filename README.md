# CCE — Carthage Commodity Exchange

A demonstration prototype of a Tunisian-dinar (TND) commodity derivatives platform: futures on
**olive oil (HOV)** and **Deglet Nour dates (DGN)**, plus **ETFs** tracking those futures curves
and **options** on the futures (Black-76 pricing). Built to illustrate what such a platform could
look like, and how it would map onto Tunisian financial regulation (CMF, Tunisie Clearing, CTAF,
INPDP) — **not** a licensed exchange. Read [`DISCLAIMER.md`](./DISCLAIMER.md) first.

## Structure

```
apps/
  api/      Simulated matching engine + market-data service (Node, TypeScript, Express, ws)
  web/      Trading terminal web app (Vite, React, TypeScript, Tailwind) — FR/AR/EN
  mobile/   Mobile app (Expo / React Native, TypeScript) — iOS & Android
packages/
  shared/   Contract specs, options/margin math, i18n strings, shared types
docs/
  ARCHITECTURE.md   What's simulated, what's real engineering, what a production build needs
  COMPLIANCE.md     Mapping to Tunisian legislation and the CMF regulatory framework
  DEPLOY.md         Deploying apps/api + apps/web to Render
render.yaml         Render Blueprint for the above
```

## Quick start

Requires Node ≥ 20 and pnpm.

```bash
pnpm install

# Terminal 1 — simulated exchange backend (REST + WebSocket) on :4000
pnpm dev:api

# Terminal 2 — web terminal on :5173
pnpm dev:web

# Mobile (Expo) — from apps/mobile
cd apps/mobile && pnpm start
```

The web app and mobile app both talk to the same simulated backend
(`apps/api`), so open two browser tabs / a tab + the Expo app to see the
order book, prices, and fills update live and stay consistent across
clients.

### Testing the mobile app in Expo Go

1. Make sure your phone and your computer are on the **same Wi-Fi network**.
2. Find your computer's LAN IP — not this repo's, *yours*, since the phone needs to
   reach the machine actually running the dev server:
   - macOS: `ipconfig getifaddr en0` (or `en1` if Wi-Fi isn't `en0`)
   - Windows: `ipconfig` → "IPv4 Address" under your Wi-Fi adapter
   - Linux: `hostname -I`
3. Copy `apps/mobile/.env.example` to `apps/mobile/.env` and put that IP in both
   URLs (`localhost` won't work here — on the phone, `localhost` means the phone
   itself):
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.42:4000
   EXPO_PUBLIC_WS_URL=ws://192.168.1.42:4000/ws
   ```
   Expo CLI loads `.env` automatically — no need to edit `app.json`.
4. Run `pnpm dev:api` in one terminal, `cd apps/mobile && pnpm start` in another.
5. Scan the QR code Expo CLI prints with the Expo Go app (Android: in-app scanner;
   iOS: Camera app). No tunnel/ngrok needed as long as you're on the same network.
6. Not on the same network? Run `pnpm start -- --tunnel` instead (uses `@expo/ngrok`,
   already a dev dependency) and point `.env`'s `EXPO_PUBLIC_API_URL`/`EXPO_PUBLIC_WS_URL`
   at a similarly tunneled copy of `apps/api` (e.g. via `ngrok http 4000`).

You can also preview the app in a browser without a phone at all via
`cd apps/mobile && pnpm web`, which runs the same code through `react-native-web`.

## What this is / is not

This repository builds a **realistic simulation** of a commodity derivatives venue: an in-memory
price-time-priority matching engine, pre-trade risk controls (price bands, position limits,
margin checks), a Black-76 options pricer, and simulated ETF creation/redemption — all exposed
over a real REST + WebSocket API and consumed by a real web app and a real mobile app.

It is **not** connected to any real market, clearing house, bank, or regulator. No CMF license
exists or is implied. See `docs/ARCHITECTURE.md` for the honest list of what a production-grade,
CMF-authorized venue would additionally require.
