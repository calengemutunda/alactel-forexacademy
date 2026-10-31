import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import {
  BookOpen, GraduationCap, Award, Clock, LayoutDashboard, User, Flame, PlayCircle, Bell, Download,
} from "lucide-react";
import {
  mockEnrollments, mockEbooksPurchased, mockCertificates, mockAlunoStats, mockStudyByDay,
  mockNextLessons, mockAlunoAvisos,
} from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel do Aluno — ALACTEL" },
      { name: "description", content: "Acompanhe os seus cursos, progresso, e-books e certificados na ALACTEL." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PainelAluno,
});

type Section = "visao" | "cursos" | "ebooks" | "certificados" | "perfil";

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="glass-card p-5 tactile">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-silver/70">{label}</div>
          <div className="text-2xl xl:text-3xl font-bold gold-gradient-text break-words mt-1">{value}</div>
          {sub && <div className="text-xs text-silver/60 mt-1">{sub}</div>}
        </div>
        <div className="h-10 w-10 shrink-0 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
          <Icon className="h-5 w-5 text-gold-bright" />
        </div>
      </div>
    </div>
  );
}

function PainelAluno() {
  const [section, setSection] = useState<Section>("visao");
  const { ready, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      toast.error("Inicie sessão para aceder ao painel.");
      navigate({ to: "/login" });
    }
  }, [ready, isAuthenticated, navigate]);

  const items = [
    { label: "Visão Geral", icon: LayoutDashboard, key: "visao" as const },
    { label: "Meus Cursos", icon: BookOpen, key: "cursos" as const },
    { label: "Meus E-books", icon: GraduationCap, key: "ebooks" as const },
    { label: "Certificados", icon: Award, key: "certificados" as const },
    { label: "Perfil", icon: User, key: "perfil" as const },
  ];

  if (!ready || !isAuthenticated) return null;

  return (
    <DashboardShell
      role="Aluno"
      items={items.map((i) => ({
        to: "/painel",
        label: i.label,
        icon: i.icon,
        active: section === i.key,
        onClick: () => setSection(i.key),
      }))}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {items.map((i) => (
          <button key={i.key} onClick={() => setSection(i.key)}
            className={`px-4 py-2 rounded-lg text-sm transition tactile ${section === i.key ? "btn-gold" : "border border-gold/30 text-silver hover:text-gold-bright"}`}>
            {i.label}
          </button>
        ))}
      </div>

      {section === "visao" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl">Olá, {user?.nome?.split(" ")[0] || "aluno"} 👋</h1>
            <p className="text-sm text-silver/70 mt-1">Continue de onde parou e mantenha a sua sequência de estudo.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Cursos ativos" value={String(mockAlunoStats.cursosAtivos)} sub="Matrículas em curso" icon={BookOpen} />
            <StatCard label="Horas de estudo" value={`${mockAlunoStats.horasEstudo}h`} sub="Acumulado" icon={Clock} />
            <StatCard label="Progresso médio" value={`${mockAlunoStats.progressoMedio}%`} sub="Todos os cursos" icon={GraduationCap} />
            <StatCard label="Certificados" value={String(mockAlunoStats.certificados)} sub="Emitidos" icon={Award} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="glass-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg">Estudo dos últimos 7 dias</h2>
                <span className="flex items-center gap-1 text-xs text-gold-bright">
                  <Flame className="h-4 w-4" /> {mockAlunoStats.sequenciaDias} dias seguidos
                </span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockStudyByDay} margin={{ left: -20, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="studyGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="dia" stroke="rgba(217,217,217,0.6)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(217,217,217,0.6)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: "rgba(15,42,74,0.95)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 12, color: "#D9D9D9" }}
                      formatter={(v: number) => [`${v}h`, "Estudo"]}
                    />
                    <Area type="monotone" dataKey="horas" stroke="#D4AF37" strokeWidth={2} fill="url(#studyGold)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-5">
              <h2 className="text-lg mb-4">Continuar a aprender</h2>
              <div className="space-y-3">
                {mockNextLessons.map((l) => (
                  <div key={l.id} className="rounded-lg border border-gold/20 p-3 tactile">
                    <div className="text-xs text-gold-bright">{l.curso}</div>
                    <div className="text-sm mt-1">{l.aula}</div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-silver/60 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {l.duracao}</span>
                      <button onClick={() => toast.info("Reprodução disponível em breve.")}
                        className="btn-gold px-3 py-1.5 text-xs flex items-center gap-1">
                        <PlayCircle className="h-3.5 w-3.5" /> Retomar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-lg mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-gold-bright" /> Avisos</h2>
            <div className="space-y-3">
              {mockAlunoAvisos.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="text-sm">{a.titulo}</div>
                    <div className="text-xs text-silver/70">{a.texto}</div>
                  </div>
                  <div className="text-xs text-silver/50 shrink-0">{new Date(a.data).toLocaleDateString("pt-AO")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "cursos" && (
        <div>
          <h1 className="text-2xl mb-6">Meus Cursos</h1>
          {mockEnrollments.length === 0 ? (
            <div className="glass-card p-10 text-center text-silver/80">Ainda não está matriculado em nenhum curso.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mockEnrollments.map((e) => (
                <div key={e.id} className="glass-card p-5 tactile">
                  <div className="flex items-center gap-2 text-xs text-gold-bright mb-1">{e.categoria}</div>
                  <h3 className="text-lg mb-2">{e.cursoTitulo}</h3>
                  <div className="flex items-center gap-2 text-xs text-silver/80 mb-3">
                    <Clock className="h-3.5 w-3.5"/> Matriculado em {new Date(e.matriculadoEm).toLocaleDateString("pt-AO")}
                  </div>
                  <Progress value={e.progresso} className="h-2 mb-2"/>
                  <div className="text-xs text-silver/80">{e.progresso}% concluído</div>
                  <button onClick={() => toast.info("Aulas disponíveis em breve.")} className="btn-gold px-4 py-2 text-sm mt-4">Continuar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === "ebooks" && (
        <div>
          <h1 className="text-2xl mb-6">Meus E-books</h1>
          {mockEbooksPurchased.length === 0 ? (
            <div className="glass-card p-10 text-center text-silver/80">Ainda não comprou nenhum e-book.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mockEbooksPurchased.map((e) => (
                <div key={e.id} className="glass-card p-5 flex items-center justify-between gap-4 tactile">
                  <div>
                    <h3 className="text-lg">{e.titulo}</h3>
                    <div className="text-xs text-silver/80">Comprado em {new Date(e.compradoEm).toLocaleDateString("pt-AO")}</div>
                  </div>
                  <button onClick={() => toast.success("Descarregamento iniciado.")} className="btn-gold px-4 py-2 text-sm flex items-center gap-1 shrink-0">
                    <Download className="h-4 w-4" /> Descarregar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === "certificados" && (
        <div>
          <h1 className="text-2xl mb-6">Certificados</h1>
          {mockCertificates.length === 0 ? (
            <div className="glass-card p-10 text-center text-silver/80">Ainda não tem certificados emitidos.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mockCertificates.map((c) => (
                <div key={c.id} className="glass-card p-6 tactile">
                  <Award className="h-8 w-8 text-gold-bright mb-3"/>
                  <h3 className="text-lg">{c.cursoTitulo}</h3>
                  <div className="text-xs text-silver/80 mt-1">Emitido em {new Date(c.emitidoEm).toLocaleDateString("pt-AO")}</div>
                  <div className="text-xs text-silver/60 mt-1">Código: {c.codigo}</div>
                  <button onClick={() => toast.info("Pré-visualização em breve.")} className="btn-outline-gold px-4 py-2 text-sm mt-4">Ver certificado</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === "perfil" && (
        <div className="max-w-xl">
          <h1 className="text-2xl mb-6">Perfil</h1>
          <div className="glass-card p-6 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-silver/60">Nome</div>
              <div className="text-sm">{user?.nome || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-silver/60">E-mail</div>
              <div className="text-sm">{user?.email || "—"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-silver/60">Perfil</div>
              <div className="text-sm">{user?.role || "Aluno"}</div>
            </div>
            <button onClick={() => toast.info("Edição de perfil disponível em breve.")} className="btn-outline-gold px-4 py-2 text-sm">
              Editar perfil
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
