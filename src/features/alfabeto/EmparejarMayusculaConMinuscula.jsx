import { useState } from "react";
import { useEstudio } from "../../state/useEstudio.js";
import { SesionEmparejar } from "./sesiones.js";
import AudioButton from "../../shared/components/AudioButton.jsx";

export default function EmparejarMayusculaConMinuscula({ letras }) {
  const { actualizarNivelAlfabeto } = useEstudio();
  const [sesion, setSesion] = useState(() => SesionEmparejar.crear(letras));
  const [respondida, setRespondida] = useState(null);

  const reiniciar = () => {
    setSesion(SesionEmparejar.crear(letras));
    setRespondida(null);
  };

  const elegir = (nombre) => {
    if (respondida) return;
    const ejercicio = sesion.actual();
    if (!ejercicio) return;
    const { esCorrecta: ok, id, sesion: nueva } = sesion.evaluar(nombre);
    setSesion(nueva);
    setRespondida({ nombreElegido: nombre, esCorrecta: ok, ejercicio, sesion: nueva });
    actualizarNivelAlfabeto(id, ok);
  };

  const siguiente = () => {
    if (!respondida) return;
    setRespondida(null);
  };
  const ejercicio = respondida?.ejercicio ?? sesion.actual();

  if (!ejercicio) {
    return (
      <div className="text-center py-8 border-2 border-stone-800 bg-[#fbf5e6] font-cinzel">
        <div className="tracking-widest uppercase text-xs text-stone-700">sesión terminada</div>
        <button onClick={reiniciar} className="mt-4 px-5 py-2 border-2 border-stone-800 bg-stone-800 text-stone-50 tracking-widest uppercase text-[10px]">
          reiniciar
        </button>
      </div>
    );
  }

  const glifoPregunta = ejercicio?.letra[ejercicio.pregunta];
  const tipoPregunta = ejercicio?.pregunta === "mayuscula" ? "mayúscula" : "minúscula";
  const tipoRespuesta = ejercicio?.respuesta === "mayuscula" ? "mayúscula" : "minúscula";
  const glifoRespuesta = ejercicio?.letra[ejercicio.respuesta];

  return (
    <>
      <div className="flex items-center justify-between text-xs mb-3 px-1 font-cinzel">
        <span className="tracking-widest uppercase text-stone-700 text-[10px]">encontrá su {tipoRespuesta}</span>
        <span className="tracking-widest text-[10px]">
          <span className="text-emerald-800">✓ {sesion.aciertos}</span>
          <span className="mx-2 text-stone-400">·</span>
          <span className="text-rose-800">✕ {sesion.fallos}</span>
        </span>
      </div>

      <div className="w-full aspect-[3/2] rounded-sm border-2 border-stone-800 bg-[#fbf5e6] shadow-[8px_8px_0_0_rgba(50,40,20,0.85)] flex flex-col items-center justify-center relative">
        <div className="absolute top-3 left-3 text-stone-500 text-[10px] tracking-widest uppercase font-cinzel">{tipoPregunta}</div>
        <div className="text-stone-900 leading-none font-cormorant text-[8rem] font-medium">{glifoPregunta}</div>
        <div className="text-stone-500 text-[10px] tracking-[0.3em] uppercase mt-3 font-cinzel">tocá la {tipoRespuesta} correspondiente</div>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-3">
        {ejercicio?.opciones.map((opcion) => {
          const esCorrecta = opcion.id === ejercicio.id;
          const fueElegida = respondida?.nombreElegido === opcion.id;
          let clase = "border-stone-700 text-stone-800 bg-[#fbf5e6] hover:bg-stone-800 hover:text-stone-50";
          if (respondida) {
            if (esCorrecta) clase = "border-emerald-900 bg-emerald-100 text-emerald-900";
            else if (fueElegida) clase = "border-rose-900 bg-rose-100 text-rose-900";
            else clase = "border-stone-200 text-stone-400 bg-stone-50";
          }
          return (
            <button key={opcion.id} onClick={() => elegir(opcion.id)} disabled={!!respondida} className={`aspect-square border-2 text-2xl transition font-cormorant ${clase}`}>
              {opcion.glifo}
            </button>
          );
        })}
      </div>

      {respondida && (
        <div className="mt-4">
          <div className={`text-center py-3 border-2 ${respondida.esCorrecta ? "border-emerald-900 text-emerald-900" : "border-rose-900 text-rose-900"}`}>
            <div className="text-xs tracking-widest uppercase font-cinzel">{respondida.esCorrecta ? "correcto" : "incorrecto"}</div>
            <div className="text-sm mt-1 italic font-cormorant">{glifoPregunta} ↔ <span className="not-italic font-semibold">{glifoRespuesta}</span> · {ejercicio?.id}</div>
            <div className="mt-2 flex justify-center"><AudioButton text={ejercicio?.id} /></div>
          </div>
          <button onClick={siguiente} className="w-full mt-3 py-3 border-2 border-stone-800 bg-stone-800 text-stone-50 tracking-widest uppercase text-[10px] hover:bg-stone-700 transition font-cinzel">{respondida.sesion.terminada() ? "terminar" : "siguiente →"}</button>
        </div>
      )}

      <button onClick={reiniciar} className="w-full mt-3 py-2 border-2 border-stone-400 text-stone-500 tracking-widest uppercase text-[10px] hover:border-stone-800 hover:text-stone-800 transition font-cinzel">reiniciar</button>
    </>
  );
}
