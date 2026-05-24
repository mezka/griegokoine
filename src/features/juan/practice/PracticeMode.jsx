import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useEstudio } from "../../../state/useEstudio.js";
import {
  SesionRecordarSignificado,
  SesionElegirSignificado,
  SesionCompletarPalabra,
  SesionReconocerGramatica,
} from "../sesiones.js";
import CompletarPalabraFaltante from "./CompletarPalabraFaltante.jsx";
import ElegirSignificado from "./ElegirSignificado.jsx";
import ReconocerGramatica from "./ReconocerGramatica.jsx";
import RecordarSignificado from "./RecordarSignificado.jsx";

const TIPOS = [
  { id: "recordarSignificado", label: "recordar" },
  { id: "elegirSignificado", label: "elegir" },
  { id: "completarPalabra", label: "completar" },
  { id: "reconocerGramatica", label: "gramática" },
];

const TIPO_INICIAL = TIPOS[0].id;

export default function PracticeMode() {
  const { actualizarNivelVocabulario } = useEstudio();
  const { entradas, versos } = useOutletContext();

  const [tipo, setTipo] = useState(TIPO_INICIAL);
  const [sesion, setSesion] = useState(null);

  const iniciar = (tipoSeleccionado) => {
    setTipo(tipoSeleccionado);

    if (tipoSeleccionado === "recordarSignificado") {
      setSesion(SesionRecordarSignificado.crear(entradas, versos));
      return;
    }

    if (tipoSeleccionado === "elegirSignificado") {
      setSesion(SesionElegirSignificado.crear(entradas, versos));
      return;
    }

    if (tipoSeleccionado === "completarPalabra") {
      setSesion(SesionCompletarPalabra.crear(entradas, versos));
      return;
    }

    setSesion(SesionReconocerGramatica.crear(entradas, versos));
  };

  const responderVocabulario = (eleccion) => {
    if (!sesion || sesion.terminada()) return;
    const { id, esCorrecta, sesion: nueva } = sesion.evaluar(eleccion);
    setSesion(nueva);
    actualizarNivelVocabulario(id, esCorrecta);
  };

  const responderGramatica = (eleccion) => {
    if (!sesion || sesion.terminada()) return;
    const { id, esCorrecta, sesion: nueva } = sesion.evaluar(eleccion);
    setSesion(nueva);
    actualizarNivelVocabulario(id, esCorrecta);
  };

  const reiniciar = () => iniciar(tipo);

  if (!sesion) return <Selector tipo={tipo} onSelect={iniciar} />;

  if (sesion.terminada()) {
    return sesion.total === 0 ? (
      <SesionVacia />
    ) : (
      <Resumen
        aciertos={sesion.aciertos}
        fallos={sesion.fallos}
        onRestart={reiniciar}
      />
    );
  }

  const ejercicio = sesion.actual();
  if (!ejercicio) return null;

  return (
    <>
      <Selector tipo={tipo} onSelect={iniciar} />
      <Progreso
        indice={sesion.indice}
        total={sesion.total}
        aciertos={sesion.aciertos}
        fallos={sesion.fallos}
      />
      <EjercicioActual
        tipo={tipo}
        ejercicio={ejercicio}
        indice={sesion.indice}
        onAnswerVocabulario={responderVocabulario}
        onAnswerGramatica={responderGramatica}
      />
    </>
  );
}

function Selector({ tipo, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 mb-4">
      {TIPOS.map((item) => {
        const active = tipo === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`font-sans border border-solid rounded-lg cursor-pointer text-[9px] font-medium tracking-[0.12em] px-1 py-2.5 uppercase ${active ? "text-ink bg-paper-glass-strong border-line-mid" : "text-ink-mid bg-transparent border-line"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function Progreso({ indice, total, aciertos, fallos }) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-ink-mid font-medium">
        {indice + 1} <span className="opacity-40">/</span> {total}
      </span>
      <span className="font-sans text-[10px] tracking-[0.1em] uppercase font-medium">
        <span className="text-emerald-800">✓ {aciertos}</span>
        <span className="text-ink-fade mx-2">·</span>
        <span className="text-rose-800">✕ {fallos}</span>
      </span>
    </div>
  );
}

function EjercicioActual({
  tipo,
  ejercicio,
  indice,
  onAnswerVocabulario,
  onAnswerGramatica,
}) {
  const key = `${indice}-${ejercicio.id}`;

  if (tipo === "recordarSignificado") {
    return (
      <RecordarSignificado
        key={key}
        ejercicio={ejercicio}
        onAnswer={onAnswerVocabulario}
      />
    );
  }

  if (tipo === "elegirSignificado") {
    return (
      <ElegirSignificado
        key={key}
        ejercicio={ejercicio}
        onAnswer={onAnswerVocabulario}
      />
    );
  }

  if (tipo === "completarPalabra") {
    return (
      <CompletarPalabraFaltante
        key={key}
        ejercicio={ejercicio}
        onAnswer={onAnswerVocabulario}
      />
    );
  }

  return (
    <ReconocerGramatica
      key={key}
      ejercicio={ejercicio}
      onAnswer={onAnswerGramatica}
    />
  );
}

function Resumen({ aciertos, fallos, onRestart }) {
  return (
    <div
      className="text-center py-12 px-6 rounded-xl border border-solid border-line bg-paper-glass"
      style={{
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
      }}
    >
      <div className="font-serif italic text-[48px] text-ink leading-none">
        τέλος
      </div>
      <div className="mt-10 flex justify-center gap-14">
        <div className="text-center">
          <div
            style={{ color: "#5e7a48" }}
            className="font-serif text-[44px] leading-none"
          >
            {aciertos}
          </div>
          <div className="mt-3 font-sans text-[9px] tracking-[0.18em] uppercase text-ink-mid">
            acertadas
          </div>
        </div>
        <div className="w-px bg-line self-stretch" />
        <div className="text-center">
          <div
            style={{ color: "#9a3838" }}
            className="font-serif text-[44px] leading-none"
          >
            {fallos}
          </div>
          <div className="mt-3 font-sans text-[9px] tracking-[0.18em] uppercase text-ink-mid">
            falladas
          </div>
        </div>
      </div>
      <button
        onClick={onRestart}
        className="mt-10 font-sans text-[11px] tracking-[0.14em] uppercase font-medium text-paper bg-ink border border-ink rounded-[10px] py-3 px-7 cursor-pointer"
      >
        nueva sesión
      </button>
    </div>
  );
}

function SesionVacia() {
  return (
    <div className="text-center py-10 px-6 rounded-xl border border-solid border-line bg-paper-glass font-garamond text-ink-soft italic">
      Marcá algunas palabras en la lectura para poder practicarlas.
    </div>
  );
}
