import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/site/DashboardShell";
import { LayoutDashboard, ShoppingBag, Users, FileText, Download, TrendingUp, DollarSign, GraduationCap, UserCheck } from "lucide-react";
import {
  mockAdminStats, mockSalesByDay, mockTopProducts, mockRecentSales, mockUsers, mockAdminReports,
} from "@/lib/mock-data";
import { formatKz } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  Bar, BarChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — ALACTEL" }, { name: "robots", content: "noindex" }] }),
  component: PainelAdmin,
});

type Section = "visao" | "vendas" | "usuarios" | "relatorios";

function PainelAdmin() {
  const [section, setSection] = useState<Section>("visao");
  const { ready, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      toast.error("Inicie sessão para aceder ao painel.");
      navigate({ to: "/login" });
    } else if (!isAdmin) {
      toast.error("Acesso restrito a administradores.");
      navigate({ to: "/painel" });
    }
  }, [ready, isAuthenticated, isAdmin, navigate]);

  const items = [
    { label: "Visão Geral", icon: LayoutDashboard, key: "visao" as const },
    { label: "Vendas", icon: ShoppingBag, key: "vendas" as const },
    { label: "Usuários", icon: Users, key: "usuarios" as const },
    { label: "Relatórios", icon: FileText, key: "relatorios" as const },
  ];

  if (!ready) return null;
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <DashboardShell
      role="Administrador"
      items={items.map((i) => ({
        to: "/admin",
        label: i.label,
        icon: i.icon,
        active: section === i.key,
        onClick: () => setSection(i.key),
      }))}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {items.map((i) => (
          <button key={i.key} onClick={() => setSection(i.key)}
            className={`px-4 py-2 rounded-lg text-sm transition inline-flex items-center gap-2 ${section === i.key ? "btn-gold" : "border border-gold/30 text-silver hover:text-gold-bright"}`}>
            <i.icon className="h-4 w-4"/>{i.label}
          </button>
        ))}
      </div>

      {section === "visao" && <VisaoGeral onOpenReports={() => setSection("relatorios")}/>}
      {section === "vendas" && <VendasSection/>}
      {section === "usuarios" && <UsuariosSection/>}
      {section === "relatorios" && <RelatoriosSection/>}
    </DashboardShell>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs text-silver/80 uppercase tracking-wide">{label}</div>
        <div className="h-9 w-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
          <Icon className="h-4 w-4 text-gold-bright"/>
        </div>
      </div>
      <div className="text-2xl xl:text-3xl font-bold gold-gradient-text break-words leading-tight">{value}</div>
      {sub && <div className="text-xs text-silver/60 mt-1">{sub}</div>}
    </div>
  );
}

function VisaoGeral({ onOpenReports }: { onOpenReports: () => void }) {
  const totalReceita7d = mockSalesByDay.reduce((s, d) => s + d.receita, 0);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl">Visão Geral</h1>
        <button onClick={onOpenReports} className="btn-gold px-4 py-2 text-sm inline-flex items-center gap-2">
          <FileText className="h-4 w-4"/> Relatórios
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Receitas" value={formatKz(mockAdminStats.receitaTotal)} sub="Acumulado" icon={DollarSign}/>
        <StatCard label="Vendas do Dia" value={String(mockAdminStats.vendasDia)} sub={formatKz(mockSalesByDay[mockSalesByDay.length - 1].receita)} icon={ShoppingBag}/>
        <StatCard label="Matrículas Ativas" value={String(mockAdminStats.matriculasAtivas)} sub="Alunos em curso" icon={GraduationCap}/>
        <StatCard label="Total de Usuários" value={String(mockAdminStats.totalUsuarios)} sub="Registados" icon={UserCheck}/>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-lg">Desempenho — últimos 7 dias</h3>
            <p className="text-xs text-silver/70">Receita total no período: <span className="gold-gradient-text font-semibold">{formatKz(totalReceita7d)}</span></p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-success bg-success/10 border border-success/30 px-2 py-1 rounded-full">
            <TrendingUp className="h-3 w-3"/> +18% vs. semana anterior
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockSalesByDay}>
              <defs>
                <linearGradient id="gRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity={0.5}/>
                  <stop offset="100%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)"/>
              <XAxis dataKey="dia" stroke="#d9d9d9" fontSize={12}/>
              <YAxis stroke="#d9d9d9" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}/>
              <Tooltip
                contentStyle={{ background: "#0f2a4a", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8 }}
                formatter={(v: number, name) => [name === "receita" ? formatKz(v) : v, name === "receita" ? "Receita" : "Vendas"]}
              />
              <Area type="monotone" dataKey="receita" stroke="#d4af37" strokeWidth={2} fill="url(#gRec)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-lg mb-4">Vendas por dia</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)"/>
                <XAxis dataKey="dia" stroke="#d9d9d9" fontSize={12}/>
                <YAxis stroke="#d9d9d9" fontSize={12}/>
                <Tooltip contentStyle={{ background: "#0f2a4a", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8 }}/>
                <Bar dataKey="vendas" fill="#d4af37" radius={[6, 6, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg mb-4">Produtos mais vendidos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTopProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)"/>
                <XAxis type="number" stroke="#d9d9d9" fontSize={12}/>
                <YAxis dataKey="produto" type="category" stroke="#d9d9d9" fontSize={11} width={90}/>
                <Tooltip contentStyle={{ background: "#0f2a4a", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 8 }}/>
                <Bar dataKey="vendas" fill="#f2c94c" radius={[0, 6, 6, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function VendasSection() {
  return (
    <div>
      <h1 className="text-2xl mb-6">Vendas Recentes</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-white/5">
            <tr className="text-left text-silver/80">
              <th className="p-4">Produto</th><th className="p-4">Cliente</th><th className="p-4">Valor</th><th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody>
            {mockRecentSales.map((s) => (
              <tr key={s.id} className="border-t border-gold/10">
                <td className="p-4">{s.produto}</td>
                <td className="p-4 text-silver/80">{s.cliente}</td>
                <td className="p-4 gold-gradient-text font-semibold">{formatKz(s.valor)}</td>
                <td className="p-4 text-silver/80">{new Date(s.data).toLocaleDateString("pt-AO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsuariosSection() {
  return (
    <div>
      <h1 className="text-2xl mb-6">Usuários</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-white/5">
            <tr className="text-left text-silver/80">
              <th className="p-4">Nome</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Estado</th><th className="p-4">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id} className="border-t border-gold/10">
                <td className="p-4">{u.nome}</td>
                <td className="p-4 text-silver/80">{u.email}</td>
                <td className="p-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold-bright">{u.role}</span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.ativo ? "bg-success/15 text-success border border-success/30" : "bg-danger/15 text-danger border border-danger/30"}`}>
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-4 text-silver/80">{new Date(u.criadoEm).toLocaleDateString("pt-AO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RelatoriosSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Relatórios</h1>
        <p className="text-sm text-silver/70">Descarregue os relatórios operacionais e financeiros da plataforma.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {mockAdminReports.map((r) => (
          <div key={r.id} className="glass-card p-5 flex items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-gold-bright"/>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base leading-tight">{r.titulo}</h3>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-gold/20 text-silver">{r.tipo}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-gold/20 text-silver">{r.periodo}</span>
                <span className="text-silver/60">Gerado {new Date(r.gerado).toLocaleDateString("pt-AO")}</span>
              </div>
            </div>
            <button
              onClick={() => toast.info("Geração de PDF disponível quando o backend estiver ligado.")}
              className="btn-gold px-3 py-2 text-xs inline-flex items-center gap-1.5 shrink-0"
            >
              <Download className="h-3.5 w-3.5"/> PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
