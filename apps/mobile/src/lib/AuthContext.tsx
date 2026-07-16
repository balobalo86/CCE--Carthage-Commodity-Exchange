import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { api, setSession, type AuthUser } from "./api";

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const applySession = useCallback((next: { token: string; user: AuthUser }) => {
    setSession(next.user.accountId, next.token);
    setUser(next.user);
    setToken(next.token);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await api.auth.login(email, password);
      applySession(result);
    },
    [applySession]
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const result = await api.auth.register(email, password, fullName);
      applySession(result);
    },
    [applySession]
  );

  const logout = useCallback(() => {
    api.auth.logout().catch(() => {});
    setSession(null, null);
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token, login, register, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
