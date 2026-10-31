import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Target, Eye, Heart, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre Nós — ALACTEL" },
      { name: "description", content: "Missão, visão e valores da ALACTEL em Angola." },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl mb-4">Sobre a ALACTEL</h1>
          <p className="text-silver/80 max-w-2xl mx-auto">
            Somos uma academia angolana focada em formar novos traders e profissionais do mercado financeiro através de conteúdo prático, atualizado e de alta qualidade.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {[
            { icon: Target, titulo: "Missão", desc: "Democratizar o acesso à educação financeira em Angola." },
            { icon: Eye, titulo: "Visão", desc: "Ser referência em formação financeira nos PALOP." },
            { icon: Heart, titulo: "Valores", desc: "Ética, transparência, excelência e comunidade." },
          ].map((v) => (
            <div key={v.titulo} className="glass-card p-8 text-center">
              <div className="h-14 w-14 rounded-xl btn-gold flex items-center justify-center mx-auto mb-4">
                <v.icon className="h-7 w-7"/>
              </div>
              <h3 className="text-xl mb-2">{v.titulo}</h3>
              <p className="text-sm text-silver/80">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-10 mb-12">
          <h2 className="text-2xl mb-4">A Nossa História</h2>
          <p className="text-silver/85 leading-relaxed">
            A ALACTEL nasceu da necessidade de uma formação financeira acessível, séria e adaptada à realidade angolana. Combinando experiência prática nos mercados internacionais com conhecimento local, criámos uma plataforma que aproxima o trader angolano das melhores práticas mundiais.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-8">
            <h3 className="text-xl mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-gold-bright"/> Localização</h3>
            <p className="text-silver/85">Luanda - Talatona, Angola</p>
            <a href="https://wa.me/244942976462" target="_blank" rel="noreferrer"
              className="mt-6 btn-gold px-5 py-2.5 inline-flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4"/> Falar no WhatsApp
            </a>
          </div>
          <div className="glass-card p-8">
            <h3 className="text-xl mb-4">Formas de Pagamento</h3>
            <div className="flex flex-wrap gap-3">
              {["Kwik", "Express", "Unitel Money"].map((m) => (
                <span key={m} className="px-4 py-2 rounded-lg border border-gold/30 bg-navy-light/40 text-gold-bright">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
