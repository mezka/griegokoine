import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-home-bg pt-12 px-5 pb-8 font-sans text-home-ink">
      <div className="max-w-[420px] mx-auto">
        <div className="text-center mb-14">
          <div className="font-serif text-[44px] italic text-home-ink leading-none tracking-[-0.01em]">
            γρᾶμμα
          </div>
          <div className="font-sans text-[11px] tracking-[0.22em] uppercase text-home-ink-soft font-medium mt-[14px]">
            griego biblico
          </div>
        </div>

        <div className="flex flex-col gap-[14px]">
          <SectionCard
            to="/alfabeto"
            glyph="A a"
            title="Alfabeto"
            subtitle="Las 24 letras · pronunciacion erasmiana"
          />
          <SectionCard
            to="/juan/lectura"
            glyph="Io"
            title="Evangelio de Juan"
            subtitle="Capítulo 1 · vocabulario en contexto · gramatica"
          />
        </div>

        <div className="text-center mt-14 font-sans text-[10px] tracking-[0.06em] text-home-ink-fade italic">
          tu progreso se guarda automaticamente
        </div>
      </div>
    </div>
  );
}

function SectionCard({ to, glyph, title, subtitle }) {
  return (
    <Link
      to={to}
      className="bg-white border border-home-line rounded-2xl p-[22px] text-left transition duration-200 flex items-center gap-[18px] w-full no-underline hover:-translate-y-[1px] hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
    >
      <div className="font-serif text-[32px] text-accent italic leading-none shrink-0 w-[56px] text-center">
        {glyph}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-base font-semibold text-home-ink mb-1">
          {title}
        </div>
        <div className="font-sans text-xs text-home-ink-soft leading-[1.45]">
          {subtitle}
        </div>
      </div>
      <div className="font-sans text-lg text-home-ink-fade shrink-0">
        {">"}
      </div>
    </Link>
  );
}
