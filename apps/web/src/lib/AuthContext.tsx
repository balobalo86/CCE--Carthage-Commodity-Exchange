import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setSession, type AuthUser } from "./api";

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "cce.auth";

function loadStored(): { token: string; user: AuthUser } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setSession(stored.user.accountId, stored.token);
      setUser(stored.user);
      setToken(stored.token);
      api.auth
        .me()
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null, null);
          setUser(null);
          setToken(null);
        })
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  const applySession = useCallback((next: { token: string; user: AuthUser }) => {
    setSession(next.user.accountId, next.token);
    setUser(next.user);
    setToken(next.token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ user, token, ready, login, register, logout }), [user, token, ready, login, register, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
