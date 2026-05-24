import AudioButton from "../../../shared/components/AudioButton.jsx";
import CardHeader from "./CardHeader.jsx";
import FraseDelVersoConPalabraResaltada from "./FraseDelVersoConPalabraResaltada.jsx";

export default function ReconocerGramatica({ ejercicio, onAnswer }) {
  const palabraPrincipal = ejercicio.versoResuelto.elementos[ejercicio.versoResuelto.indiceTarget];

  return (
    <div className="p-6 rounded-xl border border-solid border-line bg-paper-glass" style={{ backdropFilter: "blur(24px) saturate(140%)", WebkitBackdropFilter: "blur(24px) saturate(140%)" }}>
      <CardHeader label={`verso ${palabraPrincipal.aparicion.verso}`} right={ejercicio.tipo === "caso" ? "caso" : "tiempo"} />
      <FraseDelVersoConPalabraResaltada versoResuelto={ejercicio.versoResuelto} />
      <div className="text-center mt-5 mb-5">
        <AudioButton text={ejercicio.palabra.forma} lang="el" label="escuchar forma" />
        <div className="font-serif text-[26px] text-ink mt-[14px]">{ejercicio.palabra.forma}</div>
        <div className="font-garamond text-[13px] text-ink-mid italic">
          de <span className="font-serif not-italic">{ejercicio.id}</span> · {ejercicio.palabra.significado}
        </div>
      </div>
      <div className="font-sans text-[14px] text-ink text-center font-medium mb-4">
        {ejercicio.tipo === "caso" ? "¿En qué caso está?" : "¿Qué tiempo verbal es?"}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ejercicio.opciones.map((option) => (
          <button key={option.id} onClick={() => onAnswer(option.id)} className="font-sans bg-transparent border border-solid border-line-mid rounded-[10px] text-ink cursor-pointer text-[13px] font-medium py-3.5 px-2">
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
