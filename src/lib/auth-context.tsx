import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthApi, decodeJwt, toPasswordHash, type RegisterPayload } from "./api";

export type Role = "Administrador" | "Aluno" | string;

interface AuthUser {
  email?: string;
  nome?: string;
  role?: Role;
  id?: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAluno: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<Role | undefined>;
  register: (payload: Omit<RegisterPayload, "passwordHash" | "role" | "emailConfirmado" | "ativo"> & { password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "asa_token";

function readStored(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  } catch { return null; }
}

interface DemoAccount { email: string; password: string; nome: string; role: Role }

// Contas de demonstração — funcionam sem backend. Remover quando a API .NET estiver ligada.
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "admin@alactel.ao", password: "Alactel@2026", nome: "Admin ALACTEL", role: "Administrador" },
  { email: "aluno@alactel.ao", password: "Aluno@2026", nome: "Aluno Demo", role: "Aluno" },
];

function b64url(obj: Record<string, unknown>): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeDemoToken(d: DemoAccount): string {
  const header = b64url({ alg: "none", typ: "JWT" });
  const payload = b64url({
    role: d.role,
    email: d.email,
    unique_name: d.nome,
    nameid: d.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  });
  return `${header}.${payload}.demo`;
}



export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = readStored();
    if (t) {
      const claims = decodeJwt(t);
      if (claims) {
        setToken(t);
        setUser({
          role: claims.role as string | undefined,
          email: (claims.email || claims.unique_name) as string | undefined,
          nome: (claims.unique_name || claims.email) as string | undefined,
          id: claims.nameid as string | undefined,
        });
      }
    }
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    // Credenciais de demonstração (enquanto o backend .NET não está ligado)
    const demo = DEMO_ACCOUNTS.find(
      (d) => d.email.toLowerCase() === email.trim().toLowerCase() && d.password === password,
    );
    if (demo) {
      const jwt = makeDemoToken(demo);
      setToken(jwt);
      setUser({ role: demo.role, email: demo.email, nome: demo.nome, id: demo.email });
      try {
        if (remember) localStorage.setItem(STORAGE_KEY, jwt);
        else sessionStorage.setItem(STORAGE_KEY, jwt);
      } catch { /* ignore */ }
      return demo.role;
    }

    const raw = await AuthApi.login({ email, passwordHash: toPasswordHash(password) });
    const jwt = typeof raw === "string" ? raw.replace(/^"|"$/g, "") : String(raw);
    const claims = decodeJwt(jwt);
    if (!claims) throw new Error("Token inválido recebido do servidor.");
    setToken(jwt);
    const role = claims.role as string | undefined;
    setUser({
      role,
      email: (claims.email || claims.unique_name || email) as string,
      nome: (claims.unique_name || email) as string,
      id: claims.nameid as string | undefined,
    });
    try {
      if (remember) localStorage.setItem(STORAGE_KEY, jwt);
      else sessionStorage.setItem(STORAGE_KEY, jwt);
    } catch { /* ignore */ }
    return role;
  }, []);

  const register = useCallback(async (payload: Omit<RegisterPayload, "passwordHash" | "role" | "emailConfirmado" | "ativo"> & { password: string }) => {
    await AuthApi.register({
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone,
      fotoPerfil: payload.fotoPerfil,
      passwordHash: toPasswordHash(payload.password),
      role: "Aluno",
      emailConfirmado: false,
      ativo: true,
    });
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token, user, ready,
    isAuthenticated: !!token,
    isAdmin: user?.role === "Administrador",
    isAluno: user?.role === "Aluno",
    login, register, logout,
  }), [token, user, ready, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
