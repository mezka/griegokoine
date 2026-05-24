import { useMemo, useState } from "react";
import { Layers, Target, Type } from "lucide-react";
import BackHomeLink from "../../shared/components/BackHomeLink.jsx";
import { useEstudio } from "../../state/useEstudio.js";
import { NIVEL } from "../../shared/modelo/niveles.js";
import { LETRAS } from "./data/crudo.js";
import ElegirNombreDeLetra from "./ElegirNombreDeLetra.jsx";
import EmparejarMayusculaConMinuscula from "./EmparejarMayusculaConMinuscula.jsx";
import RecordarNombreDeLetra from "./RecordarNombreDeLetra.jsx";

export default function EstudiarAlfabetoGriego() {
  const { nivelesAlfabeto } = useEstudio();
  const [modo, setModo] = useState("recordar");

  const letras = useMemo(
    () => LETRAS.map((l) => ({ ...l, nivel: nivelesAlfabeto[l.nombre] ?? NIVEL.NUEVA })),
    [nivelesAlfabeto]
  );

  const modos = [
    { id: "recordar", label: "tarjetas", Icono: Layers },
    { id: "elegir", label: "nombre", Icono: Target },
    { id: "emparejar", label: "mayús/min", Icono: Type },
  ];

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 py-6 font-cormorant bg-[radial-gradient(ellipse_at_top,_#f5ecd9_0%,_#ede0c4_40%,_#e3d2ad_100%)]">
      <BackHomeLink />
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl tracking-[0.3em] text-stone-800 uppercase font-cinzel font-bold">Alfabeto</h1>
          <p className="text-stone-600 italic text-xs mt-0.5">ἑλληνικὰ γράμματα</p>
        </div>

        <div className="flex gap-1 mb-4">
          {modos.map(({ id, label, Icono }) => {
            const activo = modo === id;
            return (
              <button key={id} onClick={() => setModo(id)} className={`flex-1 py-2 px-2 border-2 border-stone-800 text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition font-cinzel ${activo ? "bg-stone-800 text-stone-50" : "bg-transparent text-stone-800 hover:bg-stone-200"}`}>
                <Icono size={12} /> {label}
              </button>
            );
          })}
        </div>

        {modo === "recordar" && <RecordarNombreDeLetra letras={letras} />}
        {modo === "elegir" && <ElegirNombreDeLetra letras={letras} />}
        {modo === "emparejar" && <EmparejarMayusculaConMinuscula letras={letras} />}
      </div>
    </div>
  );
}
