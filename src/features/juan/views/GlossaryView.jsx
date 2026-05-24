import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useEstudio } from "../../../state/useEstudio.js";
import { metadatosDelNivel, NIVELES } from "../../../shared/modelo/niveles.js";

export default function GlossaryView() {
  const { borrarProgresoVocabulario } = useEstudio();
  const [filter, setFilter] = useState("all");

  const { entradas } = useOutletContext();

  const allEntradas = useMemo(() => Object.values(entradas), [entradas]);

  const counts = useMemo(() => {
    const value = { all: allEntradas.length };
    for (let i = 0; i < NIVELES.length; i++) value[i] = 0;
    for (const e of allEntradas) value[e.nivel]++;
    return value;
  }, [allEntradas]);

  const filtered = useMemo(() => {
    let words;
    if (filter === "all") words = allEntradas;
    else words = allEntradas.filter((e) => e.nivel === parseInt(filter, 10));
    return [...words].sort(
      (a, b) => b.apariciones.length - a.apariciones.length
    );
  }, [allEntradas, filter]);

  const chips = [
    { id: "all", label: "todos", color: "#26201a" },
    ...NIVELES.map((n) => ({
      id: String(n.valor),
      label: n.nombre,
      color: n.color || "#5a4f3e",
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center overflow-hidden bg-bg">
      <div className="w-full max-w-md flex flex-col h-screen">
        <div className="flex justify-between items-center p-4 border-b-2 border-ink">
          <div className="font-sans tracking-[0.18em] uppercase font-medium text-[11px] text-ink">
            glosario · {allEntradas.length} únicos
          </div>
          <Link
            to="/juan/lectura"
            className="font-sans tracking-[0.18em] uppercase font-medium text-[10px] text-ink no-underline"
          >
            volver
          </Link>
        </div>

        <div className="flex gap-1 px-3 py-2 overflow-x-auto border-b border-rule">
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={`px-2.5 py-1.5 shrink-0 whitespace-nowrap font-sans tracking-[0.18em] uppercase font-medium text-[9px] cursor-pointer border ${active ? "text-paper" : "bg-transparent"}`}
                style={{
                  borderColor: chip.color,
                  ...(active
                    ? { background: chip.color }
                    : { color: chip.color }),
                }}
              >
                {chip.label} · {counts[chip.id]}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filtered.map(({ lemma, nivel, apariciones }) => {
            const meta = metadatosDelNivel(nivel);
            return (
              <div
                key={lemma}
                className="flex items-baseline justify-between py-2 px-1 gap-2 border-b border-rule"
              >
                <div className="flex-1 flex items-baseline gap-2 min-w-0">
                  <span
                    className="shrink-0 inline-block -translate-y-0.5"
                    style={{
                      width: 8,
                      height: 8,
                      background: meta.color || "transparent",
                      border: `1px solid ${meta.color || "rgba(38, 32, 26, 0.10)"}`,
                    }}
                  />
                  <span
                    className="font-serif text-[20px]"
                    style={
                      meta.texto ? { color: meta.texto } : undefined
                    }
                  >
                    {lemma}
                  </span>
                  <span className="font-garamond text-[13px] text-ink-soft italic truncate">
                    {apariciones[0].significado}
                  </span>
                </div>
                <span className="font-sans tracking-[0.18em] uppercase font-medium text-[9px] text-ink-soft shrink-0">
                  ×{apariciones.length}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="font-garamond text-sm text-ink-soft italic text-center py-12">
              ninguna palabra en este nivel
            </div>
          )}
        </div>

        <div className="p-4 border-t-2 border-ink">
          <button
            onClick={borrarProgresoVocabulario}
            className="font-sans tracking-[0.18em] uppercase font-medium text-[10px] text-accent bg-transparent border border-accent cursor-pointer w-full py-2"
          >
            reiniciar progreso
          </button>
        </div>
      </div>
    </div>
  );
}
