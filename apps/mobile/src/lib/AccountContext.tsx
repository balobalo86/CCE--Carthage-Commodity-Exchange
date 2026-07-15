import { createContext, useContext, type ReactNode } from "react";
import { useAccountPoll } from "./useAccount";

const Ctx = createContext<ReturnType<typeof useAccountPoll> | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const value = useAccountPoll();
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}
