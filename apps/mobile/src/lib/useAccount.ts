import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

export function useAccount() {
  const [portfolio, setPortfolio] = useState<any | null>(null);

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
