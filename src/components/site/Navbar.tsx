import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/alactel-logo.jpg.asset.json";
import { useAuth } from "@/lib/auth-context";

const links = [
  { to: "/", label: "Início" },
  { to: "/cursos", label: "Cursos" },
  { to: "/ebooks", label: "E-books" },
  { to: "/sobre", label: "Sobre Nós" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated, isAdmin } = useAuth();
  const dashHref = isAdmin ? "/admin" : "/painel";

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-navy-deep/70 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="ALACTEL" className="h-9 w-9 rounded-lg object-cover bg-white" />
          <span className="font-bold text-lg gold-gradient-text">ALACTEL</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              className={`text-sm transition-colors ${pathname === l.to ? "text-gold-bright font-semibold" : "text-silver hover:text-gold-bright"}`}>
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link to={dashHref} className="btn-gold px-4 py-2 text-sm">Painel</Link>
          ) : (
            <>
              <Link to="/registo" className="btn-outline-gold px-4 py-2 text-sm">Cadastrar</Link>
              <Link to="/login" className="btn-gold px-4 py-2 text-sm">Entrar</Link>
            </>
          )}
        </nav>

        <button className="md:hidden text-silver" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gold/20 bg-navy-deep/95 px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block text-silver hover:text-gold-bright">{l.label}</Link>
          ))}
          {isAuthenticated ? (
            <Link to={dashHref} onClick={() => setOpen(false)} className="btn-gold px-4 py-2 text-sm inline-block">Painel</Link>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/registo" onClick={() => setOpen(false)} className="btn-outline-gold px-4 py-2 text-sm">Cadastrar</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-gold px-4 py-2 text-sm">Entrar</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
