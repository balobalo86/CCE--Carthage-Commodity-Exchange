import { useEffect, useState } from "react";

export interface Toast {
  kind: "ok" | "warn";
  msg: string;
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 5200);
    return () => clearTimeout(id);
  }, [toast]);
  return { toast, setToast };
}
