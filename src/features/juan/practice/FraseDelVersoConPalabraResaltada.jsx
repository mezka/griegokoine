export default function FraseDelVersoConPalabraResaltada({ versoResuelto, ocultarPrincipal = false }) {
  return (
    <div className="font-serif text-[24px] leading-[1.7] text-ink text-center">
      {versoResuelto.elementos.map((el, index) => {
        if (el.tipo === "puntuacion") return <span key={index} className="text-ink-soft">{el.texto}</span>;
        const esPrincipal = index === versoResuelto.indiceTarget;
        return (
          <span key={index}>
            {index > 0 ? " " : ""}
            {esPrincipal && ocultarPrincipal ? (
              <span className="inline-block min-w-[70px] border-b-2 border-accent text-transparent">___</span>
            ) : (
              <span className={esPrincipal ? "text-accent font-bold" : "text-ink font-normal"}>
                {el.aparicion.forma}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
