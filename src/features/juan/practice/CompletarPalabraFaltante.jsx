import AudioButton from "../../../shared/components/AudioButton.jsx";
import CardHeader from "./CardHeader.jsx";
import FraseDelVersoConPalabraResaltada from "./FraseDelVersoConPalabraResaltada.jsx";

export default function CompletarPalabraFaltante({ ejercicio, onAnswer }) {
  const palabraPrincipal = ejercicio.versoResuelto.elementos[ejercicio.versoResuelto.indiceTarget];

  return (
    <div className="p-6 rounded-xl border border-solid border-line bg-paper-glass" style={{ backdropFilter: "blur(24px) saturate(140%)", WebkitBackdropFilter: "blur(24px) saturate(140%)" }}>
      <CardHeader label={`verso ${palabraPrincipal.aparicion.verso}`} right="hueco" />
      <FraseDelVersoConPalabraResaltada versoResuelto={ejercicio.versoResuelto} ocultarPrincipal />
      <div className="text-center mt-4 font-garamond text-[13px] text-ink-mid italic">
        significa: {palabraPrincipal.aparicion.significado}
      </div>
      <div className="text-center mt-4">
        <AudioButton text={palabraPrincipal.aparicion.forma} lang="el" label="escuchar respuesta" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {ejercicio.opciones.map((option) => (
          <button key={option} onClick={() => onAnswer(option)} className="font-serif bg-transparent border border-solid border-line-mid rounded-[10px] text-ink cursor-pointer text-[21px] leading-[1.3] py-3.5 px-2">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
