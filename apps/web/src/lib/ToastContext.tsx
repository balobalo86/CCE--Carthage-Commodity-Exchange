import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Toast {
  kind: "ok" | "warn";
  msg: string;
}

const Ctx = createContext<{ toast: Toast | null; showToast: (t: Toast) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 5200);
    return () => clearTimeout(id);
  }, [toast]);
  return <Ctx.Provider value={{ toast, showToast: setToast }}>{children}</Ctx.Provider>;
}

export function useToastCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToastCtx must be used within ToastProvider");
  return ctx;
}
