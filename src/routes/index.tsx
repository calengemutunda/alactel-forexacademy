import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CursoApi } from "@/lib/api";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CourseCard } from "@/components/site/CourseCard";
import {
  TrendingUp, Cpu, Landmark, ShieldCheck, Award, Users, Zap, ArrowRight, Sparkles, Quote,
} from "lucide-react";
import heroTrader from "@/assets/hero-trader.jpg";
import bgForex from "@/assets/bg-forex.jpg";
import community from "@/assets/community.jpg";
import techHands from "@/assets/tech-hands.jpg";
import ebookStill from "@/assets/ebook-still.jpg";
import { Reveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALACTEL — Mercado Financeiro, TI e Ciências Sociais e Gestão" },
      { name: "description", content: "Formação premium online em Mercado Financeiro, TI e Ciências Sociais e Gestão em Angola. Cursos e e-books com certificação." },
      { property: "og:title", content: "ALACTEL" },
      { property: "og:description", content: "Formação premium em Mercado Financeiro, TI e Ciências Sociais e Gestão." },
    ],
  }),
  component: Home,
});

const categorias = [
  { titulo: "Mercado Financeiro", desc: "Do primeiro pip à análise avançada de ativos, ações e criptomoedas.", icon: Landmark, slug: "financeiro", img: bgForex },
  { titulo: "TI", desc: "Ferramentas, automações e plataformas para o profissional moderno em Angola.", icon: Cpu, slug: "ti", img: techHands },
  { titulo: "Ciências Sociais e Gestão", desc: "Desenvolva competências em gestão, liderança e ciências sociais aplicadas.", icon: Users, slug: "ciencias-sociais", img: ebookStill },
];

const beneficios = [
  { icon: Award, titulo: "Certificação", desc: "Certificados reconhecidos ao concluir cada percurso." },
  { icon: Users, titulo: "Comunidade Ativa", desc: "Uma rede de traders que aprendem e crescem juntos." },
  { icon: ShieldCheck, titulo: "Conteúdo Confiável", desc: "Material curado por profissionais em atividade no mercado." },
  { icon: Zap, titulo: "Acesso Vitalício", desc: "Reveja o conteúdo sempre que precisar, para sempre." },
];

const testemunhos = [
  { nome: "Kiala M.", papel: "Aluna · Luanda", quote: "Em três meses passei de curiosa a operar com plano. A didática é humana, direta e sem promessas vazias." },
  { nome: "André V.", papel: "Trader · Benguela", quote: "O nível técnico é comparável ao que se paga em euros lá fora — mas feito para a nossa realidade." },
  { nome: "Marisa T.", papel: "Aluna · Talatona", quote: "Finalmente entendi o mercado. Os professores respondem, a comunidade acolhe. Sinto-me em casa." },
];

function Home() {
  const { data: cursos } = useQuery({
    queryKey: ["cursos"],
    queryFn: () => CursoApi.list(),
  });
  const destaques = (cursos ?? []).slice(0, 3);

  return (
    <SiteLayout>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        {/* backdrop */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroTrader}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-right opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1e38] via-[#0a1e38]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f2a4a]" />
          <div className="noise-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-28 md:pt-40 md:pb-36 grid gap-12 md:grid-cols-12 items-center">
          <div className="md:col-span-7">
            <span className="eyebrow mb-6">Academia Premium · Angola</span>
            <h1 className="text-5xl md:text-7xl leading-[1.02] mb-6">
              A disciplina de quem<br/>
              já vive do <span className="text-shimmer italic font-serif">mercado</span>.
            </h1>
            <p className="text-lg md:text-xl text-silver/85 mb-10 max-w-xl leading-relaxed">
              Formação em Mercado Financeiro, TI e Ciências Sociais e Gestão pensada para
              angolanos que querem construir liberdade com método — não com sorte.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/cursos" className="btn-gold px-7 py-3.5 inline-flex items-center gap-2 text-sm">
                Explorar Cursos <ArrowRight className="h-4 w-4"/>
              </Link>
              <Link to="/ebooks" className="btn-outline-gold px-7 py-3.5 text-sm">
                Ver E-books
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap items-end gap-x-10 gap-y-6">
              {[
                { n: "500+", l: "Alunos formados" },
                { n: "20+", l: "Cursos ao vivo" },
                { n: "4.8", l: "Avaliação média" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl md:text-4xl font-serif gold-gradient-text">{s.n}</div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-silver/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating live-card */}
          <div className="md:col-span-5 relative">
            <div className="glass-card p-6 md:p-7 animate-floaty">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse"/>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-silver/70">Mercado ao vivo</span>
                </div>
                <Sparkles className="h-4 w-4 text-gold-bright"/>
              </div>
              <div className="space-y-3.5">
                {[
                  { p: "EUR/USD", v: "1.0842", d: "+0.32%" },
                  { p: "BTC/USD", v: "62,410", d: "+1.85%" },
                  { p: "XAU/USD", v: "2,341", d: "-0.14%" },
                  { p: "GBP/USD", v: "1.2701", d: "+0.09%" },
                ].map((r) => (
                  <div key={r.p} className="flex items-center justify-between text-sm border-b border-gold/10 pb-2.5 last:border-0">
                    <span className="text-silver/90">{r.p}</span>
                    <span className="font-mono text-foreground">{r.v}</span>
                    <span className={`font-mono text-xs ${r.d.startsWith("-") ? "text-danger" : "text-success"}`}>{r.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIAS ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-16">
          <span className="eyebrow mb-4">Áreas de Formação</span>
          <h2 className="text-4xl md:text-5xl leading-tight">
            Três caminhos. <span className="italic font-serif text-silver/70">Uma disciplina.</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {categorias.map((c, i) => (
            <Reveal key={c.slug} delay={i * 90}>
              <Link to="/cursos" search={{ cat: c.slug }} className="glass-card glass-card-hover tactile group overflow-hidden block h-full">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={c.img} alt="" aria-hidden="true"
                    className="w-full h-full object-cover tactile-img"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a4a] via-[#0f2a4a]/40 to-transparent"/>
                  <div className="absolute bottom-4 left-5 h-12 w-12 rounded-xl btn-gold flex items-center justify-center">
                    <c.icon className="h-6 w-6"/>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl mb-2 font-serif">{c.titulo}</h3>
                  <p className="text-sm text-silver/80 leading-relaxed mb-4">{c.desc}</p>
                  <span className="text-gold-bright text-xs uppercase tracking-[0.2em] inline-flex items-center gap-2">
                    Ver cursos <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"/>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== DESTAQUE — imagem editorial ===================== */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={community} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-40" loading="lazy"/>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f2a4a] via-[#0f2a4a]/70 to-transparent"/>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow mb-5">A nossa gente</span>
            <h2 className="text-4xl md:text-5xl leading-tight mb-6">
              Uma comunidade que <span className="italic font-serif text-gold-bright">aprende junta</span>.
            </h2>
            <p className="text-silver/85 text-lg leading-relaxed mb-6 max-w-lg">
              Mais do que aulas, criamos um espaço onde traders angolanos partilham setups,
              erros e conquistas. Aprender aqui é sentir-se acompanhado.
            </p>
            <Link to="/sobre" className="btn-outline-gold px-6 py-3 text-sm inline-flex items-center gap-2">
              Conheça a ALACTEL <ArrowRight className="h-4 w-4"/>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== CURSOS EM DESTAQUE ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <span className="eyebrow mb-4">Selecionados pela redação</span>
            <h2 className="text-4xl md:text-5xl">Cursos em destaque</h2>
          </div>
          <Link to="/cursos" className="btn-outline-gold px-5 py-2.5 text-sm hidden sm:inline-flex items-center gap-2">
            Ver todos <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
        {destaques.length === 0 ? (
          <div className="glass-card p-12 text-center text-silver/80">
            Sem cursos disponíveis de momento. Volte em breve.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {destaques.map((c, i) => (
              <Reveal key={c.id} delay={i * 90}><CourseCard curso={c}/></Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ===================== BENEFÍCIOS ===================== */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow mb-4">Porque a ALACTEL</span>
          <h2 className="text-4xl md:text-5xl leading-tight">
            Feito com <span className="italic font-serif text-gold-bright">rigor</span>.
            Ensinado com humanidade.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {beneficios.map((b, i) => (
            <Reveal key={b.titulo} delay={i * 80}>
              <div className="glass-card tactile p-7 h-full">
                <div className="h-11 w-11 rounded-xl bg-gold/12 border border-gold/30 flex items-center justify-center mb-5">
                  <b.icon className="h-5 w-5 text-gold-bright"/>
                </div>
                <h3 className="text-base mb-2 font-serif">{b.titulo}</h3>
                <p className="text-sm text-silver/75 leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== TESTEMUNHOS ===================== */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={bgForex} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-20" loading="lazy"/>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f2a4a] via-transparent to-[#0f2a4a]"/>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <span className="eyebrow mb-4">Vozes de alunos</span>
            <h2 className="text-4xl md:text-5xl">O que dizem sobre nós</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testemunhos.map((t, i) => (
              <Reveal key={t.nome} delay={i * 100}>
                <figure className="glass-card tactile p-8 flex flex-col h-full">
                  <Quote className="h-6 w-6 text-gold-bright mb-4 opacity-70"/>
                  <blockquote className="text-silver/90 text-base leading-relaxed font-serif italic flex-1">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-gold/10">
                    <div className="text-sm font-medium text-foreground">{t.nome}</div>
                    <div className="text-xs text-silver/60 uppercase tracking-[0.18em] mt-1">{t.papel}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PAGAMENTOS ===================== */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="glass-card p-10 md:p-12 text-center">
          <span className="eyebrow mb-4 justify-center">Métodos locais</span>
          <h2 className="text-3xl md:text-4xl mb-4">Pagamento à maneira angolana</h2>
          <p className="text-silver/80 mb-8 max-w-xl mx-auto">Suportamos os principais métodos locais. Simples, rápido, sem burocracia.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Kwik", "Express", "Unitel Money"].map((m) => (
              <span key={m} className="px-6 py-3 rounded-full border border-gold/30 bg-navy-light/30 text-gold-bright font-medium text-sm tracking-wide">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroTrader} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-25" loading="lazy"/>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f2a4a]/95 via-[#0f2a4a]/85 to-[#0f2a4a]"/>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="eyebrow mb-6 justify-center">Comece hoje</span>
          <h2 className="text-4xl md:text-6xl leading-[1.05] mb-6">
            A sua próxima decisão financeira <br/>
            <span className="italic font-serif gold-gradient-text">começa aqui</span>.
          </h2>
          <p className="text-silver/85 text-lg mb-10 max-w-xl mx-auto">
            Junte-se a centenas de alunos que já mudaram a sua relação com o dinheiro.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/registo" className="btn-gold px-8 py-4 text-sm">Criar conta gratuita</Link>
            <Link to="/cursos" className="btn-outline-gold px-8 py-4 text-sm">Ver cursos</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
