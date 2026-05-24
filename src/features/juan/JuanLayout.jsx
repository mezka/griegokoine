import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, List, Repeat } from "lucide-react";
import BackHomeLink from "../../shared/components/BackHomeLink.jsx";
import { DATOS_CRUDOS_JUAN_1 } from "./data/crudo.js";
import { useDatosVocabulario } from "./useDatosVocabulario.js";

export default function JuanLayout() {
  const datos = useDatosVocabulario();
  const tabs = [
    { to: "/juan/lectura", label: "leer", Icon: BookOpen },
    { to: "/juan/practica", label: "practicar", Icon: Repeat },
    { to: "/juan/glosario", label: "glosario", Icon: List },
  ];

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center p-4 pt-[72px] relative text-ink bg-fixed"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 0%, rgba(216, 202, 168, 0.55), transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 30%, rgba(196, 178, 138, 0.45), transparent 65%),
          radial-gradient(ellipse 70% 40% at 50% 100%, rgba(232, 220, 192, 0.50), transparent 60%),
          linear-gradient(180deg, #f4ecd6 0%, #ece2c6 50%, #e6dcc0 100%)
        `,
      }}
    >
      <BackHomeLink />
      <div className="w-full max-w-md">
        <div className="text-center mb-8 pt-2">
          <div className="font-serif text-[26px] italic leading-[1.1]">
            {DATOS_CRUDOS_JUAN_1.reference}
          </div>
          <div className="font-sans text-[9px] text-ink-mid mt-2 tracking-[0.18em] uppercase font-medium">
            {DATOS_CRUDOS_JUAN_1.refEs}
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          {tabs.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-sans text-[11px] tracking-[0.12em] uppercase font-medium no-underline py-[10px] px-[14px] rounded-[10px] inline-flex items-center justify-center flex-1 gap-1.5 border ${
                  isActive
                    ? "border-line-mid bg-[rgba(251,246,232,0.78)]"
                    : "border-line text-ink-mid bg-transparent"
                }`
              }
            >
              <Icon size={13} strokeWidth={1.5} /> {label}
            </NavLink>
          ))}
        </div>

        <Outlet context={datos} />

        <p className="text-center mt-8 font-sans text-[9px] text-ink-fade italic tracking-[0.05em]">
          NA28 · pronunciación erasmiana aproximada
        </p>
      </div>
    </div>
  );
}
