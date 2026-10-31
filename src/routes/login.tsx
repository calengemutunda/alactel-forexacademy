import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — ALACTEL" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email || !password) { setErr("Preencha email e palavra-passe."); return; }
    setLoading(true);
    try {
      const role = await login(email, password, remember);
      toast.success("Sessão iniciada.");
      navigate({ to: role === "Administrador" ? "/admin" : "/painel" });
    } catch (e) {
      const err = e as ApiError;
      setErr(err.message || "Falha ao iniciar sessão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-4 py-16">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-xl btn-gold flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6"/>
            </div>
            <h1 className="text-2xl">Entrar</h1>
            <p className="text-sm text-silver/80">Aceda à sua conta.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm mb-1 block text-silver">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 outline-none focus:border-gold" required/>
            </div>
            <div>
              <label className="text-sm mb-1 block text-silver">Palavra-passe</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 pr-10 outline-none focus:border-gold" required/>
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver/80" aria-label="Mostrar/ocultar">
                  {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-silver">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
                Lembrar-me
              </label>
              <a className="text-gold-bright hover:underline" href="#">Esqueceu a senha?</a>
            </div>

            {err && <div className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">{err}</div>}

            <button type="submit" disabled={loading} className="btn-gold w-full py-2.5 disabled:opacity-60">
              {loading ? "A entrar..." : "Entrar"}
            </button>

            <div className="rounded-lg border border-gold/20 bg-white/5 px-3 py-3 text-xs text-silver/80 space-y-2">
              <div className="text-gold-bright font-semibold">Acesso de demonstração</div>
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.password); }}
                  className="w-full text-left rounded-md px-2 py-1.5 hover:bg-gold/10 transition"
                >
                  <span className="text-silver">{d.role}:</span> {d.email} / {d.password}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-silver/80">
              Não tem conta? <Link to="/registo" className="text-gold-bright hover:underline">Criar conta</Link>
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
