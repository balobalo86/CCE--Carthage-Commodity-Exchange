import { useEffect, useRef, useState } from "react";
import type { MarketQuote } from "@cce/shared";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000/ws";

interface EtfTick {
  code: string;
  quote: { code: string; nav: number; basket: number; chgPct: number; ts: number } | null;
}

export function useMarketSocket() {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [etfs, setEtfs] = useState<Record<string, EtfTick["quote"]>>({});
  const [connected, setConnected] = useState(false);
  const retryRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    let closedByEffect = false;
    let socket: WebSocket;

    function connect() {
      socket = new WebSocket(WS_URL);
      socket.onopen = () => setConnected(true);
      socket.onclose = () => {
        setConnected(false);
        if (!closedByEffect) retryRef.current = setTimeout(connect, 2000);
      };
      socket.onerror = () => socket.close();
      socket.onmessage = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.type === "snapshot" || msg.type === "tick") {
          const byKey: Record<string, MarketQuote> = {};
          for (const q of msg.quotes as MarketQuote[]) byKey[`${q.code}:${q.maturity}`] = q;
          setQuotes((prev) => ({ ...prev, ...byKey }));
          const byEtf: Record<string, EtfTick["quote"]> = {};
          for (const e of msg.etfs as EtfTick[]) byEtf[e.code] = e.quote;
          setEtfs((prev) => ({ ...prev, ...byEtf }));
        }
      };
    }
    connect();

    return () => {
      closedByEffect = true;
      if (retryRef.current) clearTimeout(retryRef.current);
      socket?.close();
    };
  }, []);

  return { quotes, etfs, connected };
}
