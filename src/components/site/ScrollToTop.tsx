import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`
        fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full
        bg-gradient-to-br from-[#F2C94C] to-[#D4AF37]
        text-[#0F2A4A] shadow-gold
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]
        active:scale-95
        ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}
      `}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.5]" />
    </button>
  );
}
