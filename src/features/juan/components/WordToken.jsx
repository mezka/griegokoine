import { metadatosDelNivel } from "../../../shared/modelo/niveles.js";

export default function WordToken({ elemento, onClick }) {
  if (elemento.tipo === "puntuacion") {
    return <span className="text-ink-soft">{elemento.texto}</span>;
  }

  const meta = metadatosDelNivel(elemento.entrada.nivel);

  return (
    <button
      onClick={() => onClick(elemento)}
      className="font-serif inline transition-colors bg-transparent border-none cursor-pointer px-0.5 m-0 text-[inherit]"
      style={{
        borderBottom: `1px ${meta.punteado ? "dotted" : "solid"} ${meta.color || "var(--color-rule)"}`,
        color: meta.texto || "var(--color-ink)",
      }}
    >
      {elemento.aparicion.forma}
    </button>
  );
}
