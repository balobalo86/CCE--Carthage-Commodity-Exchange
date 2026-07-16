import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { useAuth } from "./AuthContext";

export interface PortfolioState {
  cashTnd: number;
  usedMargin: number;
  pnl: number;
  ackOnFile: boolean;
  positions: any[];
  orders: any[];
}

interface AccountCtx {
  portfolio: PortfolioState | null;
  refresh: () => void;
}

const Ctx = createContext<AccountCtx | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { ready, token } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);

  const refresh = useCallback(() => {
    api.portfolio().then(setPortfolio).catch(() => {});
  }, []);

  useEffect(() => {
    if (!ready) return;
    setPortfolio(null);
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [ready, token, refresh]);

  return <Ctx.Provider value={{ portfolio, refresh }}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
