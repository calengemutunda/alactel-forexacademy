import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CursoApi } from "@/lib/api";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CourseCard } from "@/components/site/CourseCard";
import { toast } from "sonner";
import { z } from "zod";

const search = z.object({ cat: z.string().optional() });

export const Route = createFileRoute("/cursos")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Cursos — ALACTEL" },
      { name: "description", content: "Cursos de Mercado Financeiro, TI e Ciências Sociais e Gestão em Angola." },
    ],
  }),
  component: CursosPage,
});

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "financeiro", label: "Mercado Financeiro" },
  { key: "ti", label: "TI" },
  { key: "ciencias-sociais", label: "Ciências Sociais e Gestão" },
];

function matchCat(cursoCatName: string, key: string) {
  if (key === "todos") return true;
  const n = cursoCatName.toLowerCase();
  if (key === "financeiro") return n.includes("financ") || n.includes("mercado") || n.includes("forex");
  if (key === "ti") return n.includes("ti") || n.includes("tecno") || n.includes("inform");
  if (key === "ciencias-sociais") return n.includes("social") || n.includes("gest") || n.includes("ciencia");
  return true;
}

function CursosPage() {
  const { cat } = Route.useSearch();
  const [filtro, setFiltro] = useState(cat ?? "todos");
  const { data, isLoading, error } = useQuery({
    queryKey: ["cursos"],
    queryFn: () => CursoApi.list(),
  });

  const filtrados = useMemo(() => {
    return (data ?? []).filter((c) => {
      const catName = typeof c.categoria === "string" ? c.categoria : c.categoria?.nome ?? "";
      return matchCat(catName, filtro);
    });
  }, [data, filtro]);

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl mb-3">Cursos</h1>
        <p className="text-silver/80 mb-8">Escolha o seu próximo passo na formação em mercados.</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                filtro === f.key
                  ? "btn-gold"
                  : "border border-gold/30 text-silver hover:text-gold-bright"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0,1,2,3,4,5].map((i) => (
              <div key={i} className="glass-card h-80 animate-pulse"/>
            ))}
          </div>
        ) : error ? (
          <div className="glass-card p-10 text-center">
            <p className="text-danger mb-2">Não foi possível carregar os cursos.</p>
            <p className="text-sm text-silver/70">{(error as Error).message}</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="glass-card p-10 text-center text-silver/80">Nenhum curso encontrado para este filtro.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filtrados.map((c) => (
              <CourseCard key={c.id} curso={c} onEnroll={() => toast.info("Matrículas em breve. Entre em contacto via WhatsApp.")}/>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
