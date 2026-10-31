import { Link } from "@tanstack/react-router";
import { Star, Clock, GraduationCap } from "lucide-react";
import type { Curso } from "@/lib/api";
import { formatKz } from "@/lib/api";
import { getExtrasForCourse } from "@/lib/mock-data";

function categoriaLabel(c: Curso["categoria"]): string {
  if (!c) return "Curso";
  if (typeof c === "string") return c;
  return c.nome || "Curso";
}

export function CourseCard({ curso, onEnroll }: { curso: Curso; onEnroll?: (c: Curso) => void }) {
  const extras = getExtrasForCourse(curso.id);
  const cat = categoriaLabel(curso.categoria);
  const img = curso.imagemUrl || curso.imagem;
  return (
    <article className="glass-card glass-card-hover tactile overflow-hidden flex flex-col">
      <div className="aspect-video bg-navy-light relative overflow-hidden">
        {img ? (
          <img src={img} alt={curso.titulo} className="h-full w-full object-cover tactile-img" loading="lazy"/>
        ) : (
          <div className="h-full w-full flex items-center justify-center gold-gradient-text text-3xl font-bold">ASA</div>
        )}
        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-navy-deep/80 border border-gold/40 text-gold-bright">
          {cat}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-lg leading-tight">{curso.titulo}</h3>
        <p className="text-sm text-silver/80 line-clamp-2">{curso.descricao}</p>
        <div className="flex items-center gap-4 text-xs text-silver/80">
          <span className="flex items-center gap-1 text-gold-bright">
            <Star className="h-3.5 w-3.5 fill-current"/> {extras.avaliacao}
          </span>
          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {extras.duracao}</span>
          <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5"/> {extras.nivel}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xl font-bold gold-gradient-text">{formatKz(curso.preco)}</span>
          {onEnroll ? (
            <button onClick={() => onEnroll(curso)} className="btn-gold px-4 py-2 text-sm">Matricular</button>
          ) : (
            <Link to="/login" className="btn-gold px-4 py-2 text-sm">Matricular</Link>
          )}
        </div>
      </div>
    </article>
  );
}
