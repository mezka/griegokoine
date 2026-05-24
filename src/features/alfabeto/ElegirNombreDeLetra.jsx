import { useState } from "react";
import { useEstudio } from "../../state/useEstudio.js";
import { SesionQuizNombre } from "./sesiones.js";
import AudioButton from "../../shared/components/AudioButton.jsx";

export default function ElegirNombreDeLetra({ letras }) {
  const { actualizarNivelAlfabeto } = useEstudio();
  const [sesion, setSesion] = useState(() => SesionQuizNombre.crear(letras));
  const [respondida, setRespondida] = useState(null);

  const reiniciar = () => {
    setSesion(SesionQuizNombre.crear(letras));
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

  return (
    <>
      <div className="flex items-center justify-between text-xs mb-3 px-1 font-cinzel">
        <span className="tracking-widest uppercase text-stone-700 text-[10px]">¿qué letra es?</span>
        <span className="tracking-widest text-[10px]">
          <span className="text-emerald-800">✓ {sesion.aciertos}</span>
          <span className="mx-2 text-stone-400">·</span>
          <span className="text-rose-800">✕ {sesion.fallos}</span>
        </span>
      </div>

      <div className="w-full aspect-[3/2] rounded-sm border-2 border-stone-800 bg-[#fbf5e6] shadow-[8px_8px_0_0_rgba(50,40,20,0.85)] flex flex-col items-center justify-center relative">
        <div className="text-stone-900 leading-none font-cormorant text-[7rem] font-medium">{ejercicio?.letra.mayuscula}</div>
        <div className="text-stone-600 leading-none -mt-1 font-cormorant text-[3rem]">{ejercicio?.letra.minuscula}{ejercicio?.letra.minusculaAlt ? ` ${ejercicio.letra.minusculaAlt}` : ""}</div>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-3">
        {ejercicio?.opciones.map((opcion) => {
          const fueElegida = respondida?.nombreElegido === opcion.id;
          const esCorrecta = opcion.id === ejercicio.id;
          let clase = "border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-stone-50";
          if (respondida) {
            if (esCorrecta) clase = "border-emerald-900 bg-emerald-100 text-emerald-900";
            else if (fueElegida) clase = "border-rose-900 bg-rose-100 text-rose-900";
            else clase = "border-stone-300 text-stone-400";
          }
          return (
            <button key={opcion.id} onClick={() => elegir(opcion.id)} disabled={!!respondida} className={`py-4 border-2 tracking-[0.15em] uppercase text-base transition font-cinzel font-bold ${clase}`}>
              {opcion.label}
            </button>
          );
        })}
      </div>

      {respondida && (
        <div className="mt-4">
          <div className={`text-center py-3 border-2 ${respondida.esCorrecta ? "border-emerald-900 text-emerald-900" : "border-rose-900 text-rose-900"}`}>
            <div className="text-xs tracking-widest uppercase font-cinzel">{respondida.esCorrecta ? "correcto" : "incorrecto"}</div>
            <div className="text-sm mt-1 italic font-cormorant">{ejercicio.letra.mayuscula} {ejercicio.letra.minuscula} se llama <strong>{ejercicio.id}</strong> · suena {ejercicio.letra.sonido}</div>
            <div className="mt-2 flex justify-center"><AudioButton text={ejercicio.id} /></div>
          </div>
          <button onClick={siguiente} className="w-full mt-3 py-3 border-2 border-stone-800 bg-stone-800 text-stone-50 tracking-widest uppercase text-[10px] hover:bg-stone-700 transition font-cinzel">{respondida.sesion.terminada() ? "terminar" : "siguiente →"}</button>
        </div>
      )}

      <button onClick={reiniciar} className="w-full mt-3 py-2 border-2 border-stone-400 text-stone-500 tracking-widest uppercase text-[10px] hover:border-stone-800 hover:text-stone-800 transition font-cinzel">reiniciar</button>
    </>
  );
}
