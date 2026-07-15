import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export interface PortfolioState {
  cashTnd: number;
  usedMargin: number;
  pnl: number;
  ackOnFile: boolean;
  positions: any[];
  orders: any[];
}

export function useAccount() {
  const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);

  const refresh = useCallback(() => {
    api.portfolio().then(setPortfolio).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [refresh]);

  return { portfolio, refresh };
}
