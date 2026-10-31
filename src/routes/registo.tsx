import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/registo")({
  head: () => ({ meta: [{ title: "Criar conta — ALACTEL" }] }),
  component: RegistoPage,
});

function RegistoPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", password: "", confirm: "" });
  const [accept, setAccept] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function upd<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (form.password.length < 6) return setErr("A palavra-passe deve ter pelo menos 6 caracteres.");
    if (form.password !== form.confirm) return setErr("As palavras-passe não coincidem.");
    if (!accept) return setErr("Aceite os termos para continuar.");
    setLoading(true);
    try {
      await register({
        nome: form.nome, email: form.email, telefone: form.telefone, password: form.password,
      });
      toast.success("Conta criada. Já pode iniciar sessão.");
      navigate({ to: "/login" });
    } catch (e) {
      const er = e as ApiError;
      setErr(er.message || "Não foi possível criar a conta.");
    } finally { setLoading(false); }
  }

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-4 py-16">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-xl btn-gold flex items-center justify-center mb-3">
              <TrendingUp className="h-6 w-6"/>
            </div>
            <h1 className="text-2xl">Criar conta</h1>
            <p className="text-sm text-silver/80">Junte-se à ALACTEL.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm mb-1 block text-silver">Nome completo</label>
              <input value={form.nome} onChange={(e) => upd("nome", e.target.value)} required
                className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 outline-none focus:border-gold"/>
            </div>
            <div>
              <label className="text-sm mb-1 block text-silver">Email</label>
              <input type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} required
                className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 outline-none focus:border-gold"/>
            </div>
            <div>
              <label className="text-sm mb-1 block text-silver">Telefone</label>
              <input value={form.telefone} onChange={(e) => upd("telefone", e.target.value)} placeholder="+244 ..."
                className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 outline-none focus:border-gold"/>
            </div>
            <div>
              <label className="text-sm mb-1 block text-silver">Palavra-passe</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={form.password} onChange={(e) => upd("password", e.target.value)} required
                  className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 pr-10 outline-none focus:border-gold"/>
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-silver/80">
                  {show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm mb-1 block text-silver">Confirmar palavra-passe</label>
              <input type={show ? "text" : "password"} value={form.confirm} onChange={(e) => upd("confirm", e.target.value)} required
                className="w-full rounded-lg bg-white/5 border border-gold/20 px-4 py-2.5 outline-none focus:border-gold"/>
            </div>
            <label className="flex items-start gap-2 text-sm text-silver">
              <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-1"/>
              <span>Aceito os termos de utilização e política de privacidade.</span>
            </label>

            {err && <div className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">{err}</div>}

            <button type="submit" disabled={loading} className="btn-gold w-full py-2.5 disabled:opacity-60">
              {loading ? "A criar..." : "Criar conta"}
            </button>

            <p className="text-center text-sm text-silver/80">
              Já tem conta? <Link to="/login" className="text-gold-bright hover:underline">Entrar</Link>
            </p>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
