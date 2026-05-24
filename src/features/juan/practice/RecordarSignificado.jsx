import AudioButton from "../../../shared/components/AudioButton.jsx";
import CardHeader from "./CardHeader.jsx";
import FraseDelVersoConPalabraResaltada from "./FraseDelVersoConPalabraResaltada.jsx";

export default function RecordarSignificado({ ejercicio, onAnswer }) {
  const palabraPrincipal = ejercicio.versoResuelto.elementos[ejercicio.versoResuelto.indiceTarget];

  return (
    <div className="p-6 rounded-xl border border-solid border-line bg-paper-glass" style={{ backdropFilter: "blur(24px) saturate(140%)", WebkitBackdropFilter: "blur(24px) saturate(140%)" }}>
      <CardHeader label={`verso ${palabraPrincipal.aparicion.verso}`} right="recordar" />
      <FraseDelVersoConPalabraResaltada versoResuelto={ejercicio.versoResuelto} />

      <div className="text-center mt-6">
        <AudioButton text={ejercicio.id} lang="el" label="escuchar lema" />
        <div className="font-serif text-[32px] text-ink mt-4">{ejercicio.id}</div>
        <div className="font-garamond text-[17px] text-ink mt-2">{ejercicio.significado}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <button onClick={() => onAnswer("noLaSé")} className="font-sans bg-transparent border border-solid rounded-[10px] cursor-pointer text-[11px] font-medium tracking-[0.12em] p-3.5 uppercase text-rose-800 border-rose-800">no la sé</button>
        <button onClick={() => onAnswer("laSé")} className="font-sans bg-transparent border border-solid rounded-[10px] cursor-pointer text-[11px] font-medium tracking-[0.12em] p-3.5 uppercase text-emerald-800 border-emerald-800">la sé</button>
      </div>
    </div>
  );
}
