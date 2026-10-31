import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatKz, EbookApi, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Download, BookOpen, Lock } from "lucide-react";
import { toast } from "sonner";

// Mock e-books - backend has POST/Download but no listing endpoint.
const mockEbooks = [
  { id: "eb1", titulo: "Guia Prático do Trader Angolano", descricao: "Manual completo para iniciar em Forex a partir de Angola.", preco: 8500, categoria: "financeiro" },
  { id: "eb2", titulo: "Análise Técnica Descomplicada", descricao: "Padrões gráficos, indicadores e estratégias práticas.", preco: 12000, categoria: "ciencias-sociais" },
  { id: "eb3", titulo: "Blockchain e Criptomoedas", descricao: "Dos fundamentos à custódia segura de ativos digitais.", preco: 9500, categoria: "ti" },
];

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "financeiro", label: "Mercado Financeiro" },
  { key: "ti", label: "TI" },
  { key: "ciencias-sociais", label: "Ciências Sociais e Gestão" },
];

export const Route = createFileRoute("/ebooks")({
  head: () => ({
    meta: [
      { title: "E-books — ALACTEL" },
      { name: "description", content: "E-books sobre Mercado Financeiro, TI e Ciências Sociais e Gestão em Angola." },
    ],
  }),
  component: EbooksPage,
});

function EbooksPage() {
  const [filtro, setFiltro] = useState("todos");
  const { token, isAluno } = useAuth();
  const lista = mockEbooks.filter((e) => filtro === "todos" || e.categoria === filtro);

  async function baixar(id: string, titulo: string) {
    if (!token || !isAluno) {
      toast.error("Faça login como Aluno para descarregar o e-book.");
      return;
    }
    try {
      const blob = await EbookApi.download(id, token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${titulo}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const err = e as ApiError;
      toast.error(err.message || "Falha ao descarregar o e-book.");
    }
  }

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl mb-3">E-books</h1>
        <p className="text-silver/80 mb-8">Leitura essencial para acelerar a sua evolução.</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filtros.map((f) => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              className={`px-4 py-2 rounded-lg text-sm transition ${filtro === f.key ? "btn-gold" : "border border-gold/30 text-silver hover:text-gold-bright"}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {lista.map((e) => (
            <article key={e.id} className="glass-card glass-card-hover tactile overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-gradient-to-br from-navy-light to-navy-deep flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-gold-bright/80"/>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="text-lg">{e.titulo}</h3>
                <p className="text-sm text-silver/80 line-clamp-2">{e.descricao}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-xl font-bold gold-gradient-text">{formatKz(e.preco)}</span>
                  {isAluno ? (
                    <button onClick={() => baixar(e.id, e.titulo)} className="btn-gold px-4 py-2 text-sm inline-flex items-center gap-2">
                      <Download className="h-4 w-4"/> Descarregar
                    </button>
                  ) : (
                    <button onClick={() => toast.info("Faça login como Aluno para descarregar.")} className="btn-outline-gold px-4 py-2 text-sm inline-flex items-center gap-2">
                      <Lock className="h-4 w-4"/> Comprar
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
