import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

/** Low-level poller. Use the useAccount() hook from AccountContext instead of
 * calling this directly — React Navigation keeps every visited tab screen
 * mounted, so each direct call here would run its own redundant 4s poll. */
export function useAccountPoll() {
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
