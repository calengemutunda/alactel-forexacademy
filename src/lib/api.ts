const DEFAULT_BASE = "http://localhost:5253";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  DEFAULT_BASE;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function messageForStatus(status: number, fallback?: string) {
  switch (status) {
    case 400: return fallback || "Pedido inválido. Verifique os dados.";
    case 401: return "Sessão inválida ou expirada. Inicie sessão novamente.";
    case 403: return "Não tem permissão para aceder a este recurso.";
    case 404: return "Recurso não encontrado.";
    case 429: return "Demasiadas tentativas. Aguarde 1 minuto e tente novamente.";
    case 500: return "Erro no servidor. Tente novamente mais tarde.";
    default: return fallback || `Erro (${status}).`;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  formData?: FormData;
  headers?: Record<string, string>;
  raw?: boolean;
}

export async function apiRequest<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = { ...(opts.headers || {}) };
  let body: BodyInit | undefined;

  if (opts.formData) {
    body = opts.formData;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }
  if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;

  let res: Response;
  try {
    res = await fetch(url, { method: opts.method || "GET", headers, body });
  } catch {
    throw new ApiError(0, "Não foi possível ligar ao servidor. Verifique a sua ligação.");
  }

  if (!res.ok) {
    let msg: string | undefined;
    try {
      const text = await res.text();
      try { msg = JSON.parse(text)?.message || text; } catch { msg = text; }
    } catch { /* ignore */ }
    throw new ApiError(res.status, messageForStatus(res.status, msg));
  }

  if (opts.raw) return res as unknown as T;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

// ------- Domain types -------
export interface Categoria { id: string; nome: string; descricao?: string; }
export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  categoriaId?: string;
  categoria?: Categoria | string;
  imagemUrl?: string;
  imagem?: string;
}
export interface Ebook {
  id: string;
  titulo: string;
  descricao?: string;
  preco: number;
  autor?: string;
  categoriaId?: string;
}

// ------- Auth -------
export interface LoginPayload { email: string; passwordHash: string; }
export interface RegisterPayload {
  nome: string; email: string; passwordHash: string;
  telefone?: string; fotoPerfil?: string;
  role: string; emailConfirmado: boolean; ativo: boolean;
}

export const AuthApi = {
  login: (payload: LoginPayload) =>
    apiRequest<string>("/Auth/login", { method: "POST", body: payload }),
  register: (payload: RegisterPayload) =>
    apiRequest("/api/User/cadastrarUtilizador", { method: "POST", body: payload }),
};

export const CategoriaApi = {
  list: (token: string) => apiRequest<Categoria[]>("/api/Categoria", { token }),
  get: (id: string, token: string) => apiRequest<Categoria>(`/api/Categoria/${id}`, { token }),
  create: (data: Partial<Categoria>, token: string) =>
    apiRequest<Categoria>("/api/Categoria", { method: "POST", body: data, token }),
  update: (id: string, data: Partial<Categoria>, token: string) =>
    apiRequest(`/api/Categoria/${id}`, { method: "PUT", body: data, token }),
  remove: (id: string, token: string) =>
    apiRequest(`/api/Categoria/${id}`, { method: "DELETE", token }),
};

export const CursoApi = {
  list: () => apiRequest<Curso[]>("/api/Curso"),
  get: (id: string) => apiRequest<Curso>(`/api/Curso/${id}`),
  create: (formData: FormData, token: string) =>
    apiRequest<Curso>("/api/Curso", { method: "POST", formData, token }),
  update: (id: string, data: Partial<Curso>) =>
    apiRequest(`/api/Curso/${id}`, { method: "PUT", body: data }),
  remove: (id: string) => apiRequest(`/api/Curso/${id}`, { method: "DELETE" }),
};

export const EbookApi = {
  create: (formData: FormData, token: string) =>
    apiRequest<Ebook>("/api/Ebook", { method: "POST", formData, token }),
  download: async (id: string, token: string): Promise<Blob> => {
    const url = `${API_BASE_URL}/api/Ebook/${id}/BaixarEbook`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new ApiError(res.status, messageForStatus(res.status));
    return res.blob();
  },
};

// ------- JWT helpers -------
export interface JwtClaims {
  role?: string;
  nameid?: string;
  email?: string;
  unique_name?: string;
  [k: string]: unknown;
}

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(decodeURIComponent(escape(json)));
    // Normalize .NET ClaimTypes.Role
    const roleKey = Object.keys(parsed).find((k) =>
      k === "role" ||
      k.endsWith("/role") ||
      k === "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
    );
    if (roleKey && !parsed.role) parsed.role = parsed[roleKey];
    return parsed as JwtClaims;
  } catch {
    return null;
  }
}

// Simple password "hash" transport. Backend expects passwordHash field.
// We forward the raw password — the backend is responsible for hashing.
export function toPasswordHash(pw: string): string {
  return pw;
}

export function formatKz(value: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    maximumFractionDigits: 0,
  }).format(value).replace("AOA", "Kz");
}
