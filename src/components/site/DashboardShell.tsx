import { Navigate, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, TrendingUp } from "lucide-react";
import { WhatsAppFab } from "./WhatsAppFab";

interface Item {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  active?: boolean;
}

export function DashboardShell({
  role,
  items,
  children,
}: {
  role: "Administrador" | "Aluno";
  items: Item[];
  children: ReactNode;
}) {
  const { user, logout, ready, isAuthenticated, isAdmin, isAluno } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-silver/70 text-sm">
        A carregar o painel…
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login"/>;
  if (role === "Administrador" && !isAdmin) return <Navigate to="/painel"/>;
  if (role === "Aluno" && !isAluno && !isAdmin) return <Navigate to="/login"/>;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-navy-deep/80 border-r border-gold/20 flex flex-col">
        <div className="p-5 border-b border-gold/20">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-lg btn-gold flex items-center justify-center">
              <TrendingUp className="h-5 w-5"/>
            </div>
            <span className="font-bold gold-gradient-text text-sm">ALACTEL</span>
          </Link>
          <div className="text-sm text-silver truncate">{user?.nome || user?.email}</div>
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-gold-bright">
            {role}
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => {
            const cls = `w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              (it.active ?? pathname === it.to) ? "bg-gold/15 text-gold-bright" : "text-silver hover:bg-white/5"
            }`;
            return it.onClick ? (
              <button key={it.label} onClick={it.onClick} className={cls}>
                <it.icon className="h-4 w-4"/> {it.label}
              </button>
            ) : (
              <Link key={it.label} to={it.to} className={cls}>
                <it.icon className="h-4 w-4"/> {it.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => { logout(); navigate({ to: "/" }); }}
          className="m-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-silver hover:bg-danger/20 hover:text-danger transition">
          <LogOut className="h-4 w-4"/> Sair
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
      <WhatsAppFab/>
    </div>
  );
}
