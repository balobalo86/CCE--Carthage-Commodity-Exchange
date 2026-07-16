# Deploying to Render

This deploys the **simulated** backend (`apps/api`), the web terminal (`apps/web`),
and a browser build of the mobile app (`apps/mobile`, exported via
`expo export --platform web`) as three public Render services. Native iOS/Android
builds are a separate concern — see the main README for Expo Go / EAS Build — this
only puts a browsable version of the mobile UI on the web.

Read `DISCLAIMER.md` before sharing the resulting URL: this makes the demo publicly
reachable, so its simulated-data framing matters even more once it's not just on your
laptop.

## What you're deploying

- **`cce-api`** — a Node web service running `apps/api` (Express + WebSocket). Free tier.
- **`cce-web`** — a static site: the Vite build of `apps/web`, configured to talk to
  `cce-api`'s public URL. Free tier.
- **`cce-mobile-web`** — a static site: the Expo web export of `apps/mobile`,
  configured to talk to `cce-api`'s public URL. Free tier. This is the same
  React Native code as the native app, rendered via `react-native-web` — it's a
  convenient way to preview the mobile UI in a browser, not a substitute for
  testing the real native build.

All three are defined in `render.yaml` at the repo root as a Render **Blueprint**, so
they deploy together from one flow.

## Steps

1. **Push this repo to GitHub** if you haven't (it already is, at
   `balobalo86/CCE--Carthage-Commodity-Exchange`).

2. **Sign up / log in at [render.com](https://render.com)** — GitHub OAuth is the
   fastest path and immediately gives Render read access to your repos.

3. **Dashboard → "New +" → "Blueprint".**

4. **Connect the repo** — pick `balobalo86/CCE--Carthage-Commodity-Exchange` from the
   list (authorize Render's GitHub App for it if prompted).

5. Render reads `render.yaml` and shows three services: `cce-api`, `cce-web`, and
   `cce-mobile-web`. Before you can apply, it'll ask you to fill in `VITE_API_URL` /
   `VITE_WS_URL` for `cce-web` and `EXPO_PUBLIC_API_URL` / `EXPO_PUBLIC_WS_URL` for
   `cce-mobile-web` — these are marked `sync: false` in the blueprint specifically so
   Render prompts for them instead of guessing.

   You don't know `cce-api`'s exact URL yet (it isn't deployed), but Render's URL
   pattern is deterministic — `https://<service-name>.onrender.com` — as long as
   `cce-api` isn't already taken by someone else's Render service (very unlikely for
   this name). Enter:
   ```
   VITE_API_URL         = https://cce-api.onrender.com
   VITE_WS_URL          = wss://cce-api.onrender.com/ws
   EXPO_PUBLIC_API_URL  = https://cce-api.onrender.com
   EXPO_PUBLIC_WS_URL   = wss://cce-api.onrender.com/ws
   ```

6. **Click "Apply".** Render provisions and deploys all three services — a few minutes.

7. **Verify the guess was right**: open the `cce-api` service page and confirm its
   URL under the service name matches what you entered in step 5.
   - **If it matches**: you're done — open `cce-web`'s and `cce-mobile-web`'s URLs
     and both should load with live data.
   - **If Render appended a suffix** (e.g. `cce-api-a1b2.onrender.com`, which happens
     if the plain name was taken): go to `cce-web` and `cce-mobile-web` →
     **Environment**, fix the API/WS URL vars to the real URL, then **Manual Deploy →
     Deploy latest commit** on each to rebuild with the corrected values (both Vite
     and Expo bake these in at build time — changing the env var alone doesn't update
     an already-built static site).

8. **If a service was created via the Render API directly rather than a Blueprint
   apply** (as happened once in this project's history — see git log around
   "Fix Render deploy"), the `routes` rewrite rule in `render.yaml` does **not**
   automatically apply to it. Check `GET /v1/services/:id/routes` on that service;
   if it's empty, `POST` a `{"type":"rewrite","source":"/*","destination":"/index.html"}`
   rule to it directly, or any deep link (e.g. `/futures`, `/sign-in`) will 404.

## Things to expect (not bugs)

- **Free-tier cold start**: `cce-api` spins down after 15 minutes idle and takes
  ~30–50s to wake on the next request. The web app's WebSocket client already retries
  every 2s on a failed connection, so it'll just connect once the server's awake —
  no action needed, but the first load after idle will look "stuck" briefly.
- **In-memory state resets on redeploy/restart**: the simulated exchange (prices,
  positions, orders, registered accounts) lives in the API process's memory (see
  `docs/ARCHITECTURE.md`). Any redeploy or free-tier spin-down/wake cycle resets it
  to the initial seed state — including any accounts created via sign-up.
- **CORS**: already wide open (`apps/api/src/server.ts` uses `cors()` with no
  restrictions) since this is a public demo with no real accounts — no config needed.

## Updating the deployment

Render auto-deploys on push to `main` for all three services by default. Push a
commit, all three redeploy.
