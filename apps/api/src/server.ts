import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { ETFS, FUTURES, SWAPS } from "@cce/shared";
import { engine } from "./engine.js";
import { authStore } from "./auth.js";

const PORT = Number(process.env.PORT ?? 4000);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "cce-api", note: "Simulated exchange — no real financial instruments.", ts: Date.now() });
});

app.get("/api/contracts", (_req, res) => {
  res.json({ futures: FUTURES, etfs: ETFS, swaps: SWAPS });
});

app.get("/api/markets", (_req, res) => {
  res.json(engine.getAllQuotes());
});

app.get("/api/markets/:code/:maturity", (req, res) => {
  const quote = engine.getQuote(req.params.code, req.params.maturity);
  if (!quote) return res.status(404).json({ error: "Unknown contract or maturity." });
  res.json(quote);
});

app.get("/api/markets/:code/:maturity/book", (req, res) => {
  const book = engine.getBook(req.params.code, req.params.maturity);
  if (!book) return res.status(404).json({ error: "Unknown contract or maturity." });
  res.json(book);
});

app.get("/api/markets/:code/:maturity/history", (req, res) => {
  const days = req.query.days ? Math.min(365, Math.max(1, Number(req.query.days))) : 90;
  const history = engine.getDailyHistory(req.params.code, req.params.maturity, days);
  if (!history) return res.status(404).json({ error: "Unknown contract or maturity." });
  res.json(history);
});

app.get("/api/options/:code/:maturity/chain", (req, res) => {
  const width = req.query.width ? Number(req.query.width) : 5;
  const chain = engine.getOptionChain(req.params.code, req.params.maturity, width);
  if (!chain) return res.status(404).json({ error: "Unknown contract or maturity." });
  res.json(chain);
});

app.get("/api/etf", (_req, res) => {
  res.json(Object.keys(ETFS).map((code) => ({ spec: ETFS[code], quote: engine.getEtfQuote(code) })));
});

app.get("/api/etf/:code", (req, res) => {
  const quote = engine.getEtfQuote(req.params.code);
  if (!quote) return res.status(404).json({ error: "Unknown ETF." });
  res.json({ spec: ETFS[req.params.code], quote });
});

app.get("/api/swaps", (_req, res) => {
  res.json(
    Object.keys(SWAPS).map((code) => ({
      spec: SWAPS[code],
      quotes: SWAPS[code].tenorsMonths.map((tenorMonths) => engine.getSwapQuote(code, tenorMonths)),
    }))
  );
});

app.get("/api/swaps/:code/:tenor", (req, res) => {
  const quote = engine.getSwapQuote(req.params.code, Number(req.params.tenor));
  if (!quote) return res.status(404).json({ error: "Unknown swap or tenor." });
  res.json(quote);
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, fullName } = req.body ?? {};
  if (!email || !password || !fullName) return res.status(400).json({ error: "Missing required fields." });
  const result = authStore.register(String(email), String(password), String(fullName));
  if ("error" in result) return res.status(409).json({ error: result.error });
  engine.getOrCreateAccount(result.user.accountId);
  res.json(result);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Missing required fields." });
  const result = authStore.login(String(email), String(password));
  if ("error" in result) return res.status(401).json({ error: result.error });
  res.json(result);
});

app.get("/api/auth/me", (req, res) => {
  const authz = req.headers.authorization ?? "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  const user = token ? authStore.me(token) : null;
  if (!user) return res.status(401).json({ error: "Not authenticated." });
  res.json({ user });
});

app.post("/api/auth/logout", (req, res) => {
  const authz = req.headers.authorization ?? "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  if (token) authStore.logout(token);
  res.json({ ok: true });
});

app.post("/api/accounts/:id/ack", (req, res) => {
  const acc = engine.setAck(req.params.id, Boolean(req.body?.ack));
  res.json({ id: acc.id, ackOnFile: acc.ackOnFile });
});

app.get("/api/accounts/:id/portfolio", (req, res) => {
  res.json(engine.getPortfolio(req.params.id));
});

app.post("/api/orders/future", (req, res) => {
  const { accountId = "demo", code, maturity, side, kind, qty, limitPx } = req.body ?? {};
  if (!code || !maturity || !side || !kind || !qty) return res.status(400).json({ error: "Missing required fields." });
  const order = engine.submitFutureOrder(accountId, code, maturity, side, kind, Number(qty), limitPx != null ? Number(limitPx) : undefined);
  res.json(order);
});

app.post("/api/orders/option", (req, res) => {
  const { accountId = "demo", code, maturity, strike, optionType, side, qty } = req.body ?? {};
  if (!code || !maturity || strike == null || !optionType || !side || !qty) return res.status(400).json({ error: "Missing required fields." });
  const order = engine.submitOptionOrder(accountId, code, maturity, Number(strike), optionType, side, Number(qty));
  res.json(order);
});

app.post("/api/orders/etf", (req, res) => {
  const { accountId = "demo", code, side, units } = req.body ?? {};
  if (!code || !side || !units) return res.status(400).json({ error: "Missing required fields." });
  const order = engine.submitEtfOrder(accountId, code, side, Number(units));
  res.json(order);
});

app.post("/api/orders/swap", (req, res) => {
  const { accountId = "demo", code, tenorMonths, side, qty } = req.body ?? {};
  if (!code || !tenorMonths || !side || !qty) return res.status(400).json({ error: "Missing required fields." });
  const order = engine.submitSwapOrder(accountId, code, Number(tenorMonths), side, Number(qty));
  res.json(order);
});

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

function broadcastTick() {
  const payload = JSON.stringify({
    type: "tick",
    quotes: engine.getAllQuotes(),
    etfs: Object.keys(ETFS).map((code) => ({ code, quote: engine.getEtfQuote(code) })),
  });
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) client.send(payload);
  });
}

engine.onUpdate(broadcastTick);

wss.on("connection", (socket) => {
  socket.send(
    JSON.stringify({
      type: "snapshot",
      quotes: engine.getAllQuotes(),
      etfs: Object.keys(ETFS).map((code) => ({ code, quote: engine.getEtfQuote(code) })),
    })
  );
});

httpServer.listen(PORT, () => {
  console.log(`[cce-api] simulated exchange backend listening on :${PORT} (REST + WS /ws)`);
});
