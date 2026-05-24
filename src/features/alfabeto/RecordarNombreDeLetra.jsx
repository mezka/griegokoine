import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { useEstudio } from "../../state/useEstudio.js";
import { metadatosDelNivel } from "../../shared/modelo/niveles.js";
import { SesionRecordarNombre } from "./sesiones.js";
import AudioButton from "../../shared/components/AudioButton.jsx";

export default function RecordarNombreDeLetra({ letras }) {
  const { actualizarNivelAlfabeto } = useEstudio();
  const [revelada, setRevelada] = useState(false);
  const [sesion, setSesion] = useState(() => SesionRecordarNombre.crear(letras));

  const crearSesion = () => {
    setSesion(SesionRecordarNombre.crear(letras));
    setRevelada(false);
  };

  const marcar = (eleccion) => {
    if (sesion.terminada()) return;
    const { id, esCorrecta, sesion: nueva } = sesion.evaluar(eleccion);
    setSesion(nueva);
    setRevelada(false);
    actualizarNivelAlfabeto(id, esCorrecta);
  };

  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.target.tagName === "INPUT") return;
      if (evento.key === " " || evento.key === "Enter") { evento.preventDefault(); setRevelada((r) => !r); }
    };
    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, []);

  const ejercicio = sesion.actual();
  const letrasPorNombre = useMemo(
    () => new Map(letras.map((letra) => [letra.nombre, letra])),
    [letras]
  );
  const letraActual = letrasPorNombre.get(ejercicio?.id) ?? ejercicio?.letra;
  const meta = letraActual ? metadatosDelNivel(letraActual.nivel) : metadatosDelNivel(0);

  if (sesion.terminada()) {
    return (
      <>
        <div className="text-center py-8 border-2 border-stone-800 bg-[#fbf5e6] font-cinzel">
          <div className="tracking-widest uppercase text-xs text-stone-700">sesión terminada</div>
          <div className="mt-3 tracking-widest text-[10px]">
            <span className="text-emerald-800">✓ {sesion.aciertos}</span>
            <span className="mx-2 text-stone-400">·</span>
            <span className="text-rose-800">✕ {sesion.fallos}</span>
          </div>
          <button onClick={crearSesion} className="mt-4 px-5 py-2 border-2 border-stone-800 bg-stone-800 text-stone-50 tracking-widest uppercase text-[10px]">
            reiniciar
          </button>
        </div>
      </>
    );
  }

  const iconosPorOpcion = {
    noLaSé: X,
    laSé: Check,
  };

  return (
    <>
      <div className="flex items-center justify-between text-xs text-stone-700 mb-3 px-1">
        <span className="tracking-widest uppercase font-cinzel">{sesion.indice + 1} / {sesion.total}</span>
        <span className="tracking-widest">
          <span className="text-emerald-800">✓ {sesion.aciertos}</span>
          <span className="mx-2 text-stone-400">·</span>
          <span className="text-rose-800">✕ {sesion.fallos}</span>
        </span>
      </div>

      <button
        onClick={() => setRevelada((r) => !r)}
        className="w-full aspect-[3/4] rounded-sm border-2 border-stone-800 bg-[#fbf5e6] shadow-[8px_8px_0_0_rgba(50,40,20,0.85)] hover:shadow-[6px_6px_0_0_rgba(50,40,20,0.85)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 relative overflow-hidden"
      >
        <span className="absolute top-3 left-3 text-stone-500 text-[10px] tracking-widest font-cinzel">№{String(sesion.indice + 1).padStart(2, "0")}</span>
        <span className="absolute top-3 right-3 text-stone-500 text-[10px] tracking-widest italic">{revelada ? meta.nombre : "recto"}</span>

        {!revelada ? (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="text-stone-900 leading-none font-cormorant text-[10rem] font-medium">{letraActual?.mayuscula}</div>
            <div className="text-stone-700 leading-none -mt-3 font-cormorant text-[4.5rem]">{letraActual?.minuscula}{letraActual?.minusculaAlt ? ` ${letraActual.minusculaAlt}` : ""}</div>
            <div className="text-stone-500 text-[10px] tracking-[0.3em] uppercase mt-5 font-cinzel">toca para revelar</div>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center px-6">
            <div className="text-stone-500 text-[10px] tracking-[0.3em] uppercase mb-3 font-cinzel">se llama</div>
            <div className="text-stone-900 leading-tight text-center font-cinzel text-[3rem] font-bold tracking-[0.05em]">{letraActual?.nombre}</div>
            <div className="mt-3 flex items-center gap-3">
              <AudioButton text={letraActual?.nombre} />
              <div className="text-stone-700 text-xl font-cormorant">{letraActual?.sonido}</div>
            </div>
            <div className="mt-3 text-stone-600 text-xs italic px-3 text-center">{letraActual?.pista}</div>
            <div className="mt-3 text-stone-600 text-2xl font-cormorant">{letraActual?.mayuscula} {letraActual?.minuscula}{letraActual?.minusculaAlt ? ` ${letraActual.minusculaAlt}` : ""}</div>
          </div>
        )}
      </button>

      {revelada && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {ejercicio.opciones.map((opcion) => {
            const Icono = iconosPorOpcion[opcion.id];
            const clase = opcion.id === "laSé"
              ? "border-emerald-900 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
              : "border-rose-900 bg-rose-50 text-rose-900 hover:bg-rose-100";
            return (
              <button key={opcion.id} onClick={() => marcar(opcion.id)} className={`py-3 border-2 tracking-widest uppercase text-[10px] flex items-center justify-center gap-2 transition font-cinzel ${clase}`}>
                {Icono && <Icono size={12} />} {opcion.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 gap-2">
        <button onClick={crearSesion} className="py-3 px-3 border-2 border-stone-800 bg-transparent text-stone-800 hover:bg-stone-800 hover:text-stone-50 transition" title="reiniciar"><RotateCcw size={12} /></button>
        <div className="flex-1 py-3 border-2 border-stone-300 text-stone-500 tracking-widest uppercase text-[10px] text-center font-cinzel">sesión de tarjetas</div>
      </div>

      <p className="text-center text-stone-500 text-[10px] italic mt-4 font-cormorant">espacio = voltear · marcar avanza la sesión</p>
    </>
  );
}
