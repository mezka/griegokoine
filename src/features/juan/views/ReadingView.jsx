import { Fragment, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEstudio } from "../../../state/useEstudio.js";
import { metadatosDelNivel } from "../../../shared/modelo/niveles.js";
import { resolverVerso, contarPorNivel } from "../../../shared/modelo/funciones.js";
import { GREEK_NUM } from "../../../shared/styles/theme.js";
import WordDrawer from "../components/WordDrawer.jsx";
import WordToken from "../components/WordToken.jsx";

export default function ReadingView() {
  const {
    establecerNivelVocabulario,
    indiceDelVersoActual,
    setIndiceDelVersoActual,
  } = useEstudio();

  const { entradas, versos } = useOutletContext();

  const [indicePalabraSeleccionada, setIndicePalabraSeleccionada] = useState(null);

  const indiceSeguro = indiceValido(indiceDelVersoActual, versos.length);
  const versoActual = versos[indiceSeguro];
  const totalDePalabras = Object.keys(entradas).length;

  useEffect(() => {
    if (indiceSeguro !== indiceDelVersoActual) {
      setIndiceDelVersoActual(indiceSeguro);
    }
  }, [indiceDelVersoActual, indiceSeguro, setIndiceDelVersoActual]);

  const conteoPorNivel = useMemo(
    () => contarPorNivel(entradas),
    [entradas]
  );
  const totalMarcadas = conteoPorNivel.slice(1).reduce((s, c) => s + c, 0);

  const palabraSeleccionada = resolverPalabraPorIndice(
    indicePalabraSeleccionada,
    entradas
  );

  const cambiarNivelDePalabraSeleccionada = (lemma, nivel) => {
    establecerNivelVocabulario(lemma, nivel);
  };

  const seleccionarPalabra = (palabra) => {
    setIndicePalabraSeleccionada(palabra.aparicion.indice);
  };

  if (!versoActual) return null;

  return (
    <>
      <ReadingProgress
        conteoPorNivel={conteoPorNivel}
        totalMarcadas={totalMarcadas}
        totalDePalabras={totalDePalabras}
      />
      <VerseCard
        verso={versoActual}
        entradas={entradas}
        onSelectWord={seleccionarPalabra}
      />
      <VerseNavigation
        indiceDelVersoActual={indiceSeguro}
        setIndiceDelVersoActual={setIndiceDelVersoActual}
        versosLength={versos.length}
        versoNumero={versoActual.numero}
      />
      {palabraSeleccionada && (
        <WordDrawer
          palabra={palabraSeleccionada}
          onClose={() => setIndicePalabraSeleccionada(null)}
          onSetLevel={cambiarNivelDePalabraSeleccionada}
        />
      )}
    </>
  );
}

function indiceValido(indice, total) {
  if (total <= 0) return 0;
  const valor = Number(indice);
  if (!Number.isInteger(valor)) return 0;
  return Math.min(total - 1, Math.max(0, valor));
}

function resolverPalabraPorIndice(indice, entradas) {
  if (indice === null) return null;
  for (const entrada of Object.values(entradas)) {
    const aparicion = entrada.apariciones.find((item) => item.indice === indice);
    if (aparicion) return { tipo: "palabra", entrada, aparicion };
  }
  return null;
}

function ReadingProgress({ conteoPorNivel, totalMarcadas, totalDePalabras }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="font-sans tracking-[0.18em] uppercase font-medium text-[9px] text-ink-mid">
          {totalMarcadas}{" "}
          <span className="opacity-50">/</span> {totalDePalabras}{" "}
          <span className="opacity-70">marcadas</span>
        </div>
      </div>
      <div className="flex gap-1 mb-6 h-[3px]">
        {[1, 2, 3, 4, 5].map((level) => {
          const count = conteoPorNivel[level] || 0;
          const meta = metadatosDelNivel(level);
          return (
            <div
              key={level}
              className="rounded-[2px]"
              style={{
                flex: count > 0 ? count : 0.05,
                background: count > 0 ? meta.color : "rgba(38, 32, 26, 0.08)",
                opacity: count > 0 ? 0.6 : 1,
              }}
              title={`${meta.nombre}: ${count}`}
            />
          );
        })}
      </div>
    </>
  );
}

function VerseCard({ verso, entradas, onSelectWord }) {
  const elementos = useMemo(
    () => resolverVerso(verso, entradas),
    [verso, entradas]
  );

  return (
    <div
      className="relative py-8 px-7 min-h-[55vh] rounded-xl border border-line"
      style={{
        background: "rgba(251, 246, 232, 0.62)",
        backdropFilter: "blur(24px) saturate(140%)",
        WebkitBackdropFilter: "blur(24px) saturate(140%)",
      }}
    >
      <div className="flex items-baseline justify-between mb-6 pb-[14px] border-b border-line">
        <span className="font-serif text-[28px] text-accent italic leading-none">
          {GREEK_NUM[verso.numero - 1]}
        </span>
        <span className="font-sans tracking-[0.18em] uppercase font-medium text-[9px] text-ink-mid">
          verso {verso.numero}
        </span>
      </div>
      <div className="font-serif text-[23px] leading-[1.95] text-ink text-justify">
        {elementos.map((el, i) => (
          <Fragment key={i}>
            {i > 0 && el.tipo === "palabra" ? " " : ""}
            <WordToken
              elemento={el}
              onClick={el.tipo === "palabra" ? onSelectWord : undefined}
            />
          </Fragment>
        ))}
      </div>
      <div className="mt-8 pt-4 border-t border-line">
        <div className="font-sans text-[10px] text-ink-fade italic text-center tracking-[0.05em]">
          tocá una palabra para ver su análisis
        </div>
      </div>
    </div>
  );
}

function VerseNavigation({
  indiceDelVersoActual,
  setIndiceDelVersoActual,
  versosLength,
  versoNumero,
}) {
  const isFirst = indiceDelVersoActual === 0;
  const isLast = indiceDelVersoActual === versosLength - 1;

  const btnClass = (disabled) =>
    `flex-1 flex items-center justify-center gap-2 font-sans text-[10px] tracking-[0.14em] uppercase font-medium bg-transparent border border-line rounded-[10px] px-[14px] py-3 ${
      disabled
        ? "text-ink-fade opacity-50 cursor-not-allowed"
        : "text-ink-mid cursor-pointer"
    }`;

  return (
    <div className="flex items-center justify-between gap-3 mt-5">
      <button
        onClick={() =>
          setIndiceDelVersoActual((i) => Math.max(0, i - 1))
        }
        disabled={isFirst}
        className={btnClass(isFirst)}
      >
        <ChevronLeft size={12} strokeWidth={1.5} /> anterior
      </button>
      <div className="font-serif text-base text-ink-soft italic px-[18px] py-3 bg-paper/40 border border-line rounded-[10px]">
        {versoNumero}{" "}
        <span className="text-ink-fade text-xs">/ {versosLength}</span>
      </div>
      <button
        onClick={() =>
          setIndiceDelVersoActual((i) => Math.min(versosLength - 1, i + 1))
        }
        disabled={isLast}
        className={btnClass(isLast)}
      >
        siguiente <ChevronRight size={12} strokeWidth={1.5} />
      </button>
    </div>
  );
}
