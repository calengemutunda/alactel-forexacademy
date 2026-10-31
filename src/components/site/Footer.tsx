import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-navy-deep/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 rounded-lg btn-gold flex items-center justify-center"><TrendingUp className="h-5 w-5"/></div>
            <span className="font-bold gold-gradient-text">ALACTEL</span>
          </div>
          <p className="text-sm text-silver/80">Formação premium em Mercado Financeiro, TI e Ciências Sociais e Gestão em Angola.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Navegação</h4>
          <ul className="space-y-2 text-sm text-silver/80">
            <li><Link to="/" className="hover:text-gold-bright">Início</Link></li>
            <li><Link to="/cursos" className="hover:text-gold-bright">Cursos</Link></li>
            <li><Link to="/ebooks" className="hover:text-gold-bright">E-books</Link></li>
            <li><Link to="/sobre" className="hover:text-gold-bright">Sobre Nós</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Contactos</h4>
          <ul className="space-y-2 text-sm text-silver/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-gold"/> Luanda - Talatona, Angola</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-gold"/> +244 942 976 462</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-gold"/> alactel.geral@gmail.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Pagamentos</h4>
          <ul className="space-y-2 text-sm text-silver/80">
            <li>Kwik</li>
            <li>Express</li>
            <li>Unitel Money</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10 py-4 text-center text-xs text-silver/60">
        © {new Date().getFullYear()} ALACTEL. Todos os direitos reservados.
      </div>
    </footer>
  );
}
