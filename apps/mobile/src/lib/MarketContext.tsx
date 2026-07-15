import { createContext, useContext, type ReactNode } from "react";
import { useMarketSocket } from "./useMarketSocket";

const Ctx = createContext<ReturnType<typeof useMarketSocket> | null>(null);

export function MarketProvider({ children }: { children: ReactNode }) {
  const value = useMarketSocket();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMarket must be used within MarketProvider");
  return ctx;
}
