import AudioButton from "../../../shared/components/AudioButton.jsx";
import CardHeader from "./CardHeader.jsx";
import FraseDelVersoConPalabraResaltada from "./FraseDelVersoConPalabraResaltada.jsx";

export default function ElegirSignificado({ ejercicio, onAnswer }) {
  const palabraPrincipal = ejercicio.versoResuelto.elementos[ejercicio.versoResuelto.indiceTarget];

  return (
    <div className="p-6 rounded-xl border border-solid border-line bg-paper-glass" style={{ backdropFilter: "blur(24px) saturate(140%)", WebkitBackdropFilter: "blur(24px) saturate(140%)" }}>
      <CardHeader label={`verso ${palabraPrincipal.aparicion.verso}`} right="significado" />
      <FraseDelVersoConPalabraResaltada versoResuelto={ejercicio.versoResuelto} />
      <div className="text-center mt-4">
        <AudioButton text={palabraPrincipal.aparicion.forma} lang="el" label="escuchar palabra" />
      </div>
      <div className="mt-6 space-y-2">
        {ejercicio.opciones.map((option, i) => (
          <button key={i} onClick={() => onAnswer(option)} className="w-full text-left font-garamond bg-transparent border border-solid border-line-mid rounded-[10px] text-ink cursor-pointer text-[15px] py-3.5 px-4">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
