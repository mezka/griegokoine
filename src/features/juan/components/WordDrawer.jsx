import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { transliterate } from "../../../shared/utils/transliterate.js";
import AudioButton from "../../../shared/components/AudioButton.jsx";
import { NIVELES, metadatosDelNivel } from "../../../shared/modelo/niveles.js";
import { Z } from "../../../shared/styles/theme.js";

export default function WordDrawer({ palabra, onClose, onSetLevel }) {
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (!palabra || palabra.tipo === "puntuacion") return null;

  const { entrada, aparicion } = palabra;
  const nivel = entrada.nivel;
  const meta = metadatosDelNivel(nivel);

  const content = (
    <div       style={{ zIndex: Z.drawer }} className="fixed inset-0 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-md mx-0 sm:mx-4 p-5 bg-paper max-h-[85vh] overflow-y-auto border-2 border-ink"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="font-sans text-[10px] text-ink-soft tracking-[0.18em] uppercase font-medium">palabra</div>
          <button onClick={onClose} className="p-1 text-ink-soft bg-transparent border-none cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="text-center mb-1 font-serif text-[56px] leading-none" style={{ color: meta.texto || undefined }}>
          {aparicion.forma}
        </div>
        <div className="text-center mb-6">
          <AudioButton text={aparicion.forma} lang="el" label="escuchar" />
          <span className="ml-2 font-garamond text-xs text-ink-soft italic">
            ≈ {transliterate(aparicion.forma)}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <Field label="lema">{entrada.lemma}</Field>
          <Field label="significado">{aparicion.significado}</Field>
          <Field label="análisis"><span className="italic">{aparicion.analisisGramatical}</span></Field>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="font-sans text-[9px] text-ink-soft tracking-[0.18em] uppercase font-medium">nivel</div>
          <div className="font-garamond text-xs italic" style={{ color: meta.texto || undefined }}>{meta.nombre}</div>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {NIVELES.map((opcion) => {
            const active = nivel === opcion.valor;
            return (
              <button
                key={opcion.valor}
                onClick={() => onSetLevel(entrada.lemma, opcion.valor)}
                className="py-3 font-serif text-lg font-bold border-2 border-solid cursor-pointer"
                style={{
                  color: active ? "#fbf6e8" : (opcion.color || "#5a4f3e"),
                  background: active ? (opcion.color || "#5a4f3e") : "transparent",
                  borderColor: opcion.color || "#5a4f3e",
                }}
              >
                {opcion.valor}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return content;
  return createPortal(content, document.body);
}

function Field({ label, children }) {
  return (
    <div className="flex gap-3 items-baseline pb-3 border-b border-rule">
      <div className="w-24 shrink-0 font-sans text-[9px] text-ink-soft tracking-[0.18em] uppercase font-medium">{label}</div>
      <div className="font-garamond text-base text-ink">{children}</div>
    </div>
  );
}
