import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { T } from "../theme";

export interface Toast {
  kind: "ok" | "warn";
  msg: string;
}

const Ctx = createContext<{ showToast: (t: Toast) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <Ctx.Provider value={{ showToast: setToast }}>
      {children}
      {toast && (
        <View style={[styles.toast, { borderColor: toast.kind === "ok" ? "#2c4a38" : "#4a3a1a", backgroundColor: toast.kind === "ok" ? "#12271b" : "#2a2113" }]}>
          <Text style={{ color: toast.kind === "ok" ? T.up : T.warn, fontSize: 12.5 }}>{toast.msg}</Text>
        </View>
      )}
    </Ctx.Provider>
  );
}

export function useToastCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToastCtx must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  toast: { position: "absolute", bottom: 24, left: 16, right: 16, borderWidth: 1, borderRadius: 8, padding: 12 },
});
