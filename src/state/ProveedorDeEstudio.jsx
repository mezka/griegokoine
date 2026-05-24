import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NIVEL, NIVELES, actualizarNivel } from "../shared/modelo/niveles.js";
import { load, save } from "../shared/utils/storage.js";
import { EstudioContext } from "./useEstudio.js";

const KEY_ALFABETO = "estudio_alfabeto";
const KEY_JUAN = "estudio_juan";
const KEY_VERSO = "estudio_verso";

function limpiarNivelesGuardados(niveles) {
  if (!niveles || typeof niveles !== "object" || Array.isArray(niveles)) return {};
  return Object.fromEntries(
    Object.entries(niveles).map(([id, nivel]) => {
      const valor = Number(nivel);
      return [id, NIVELES[valor] ? valor : NIVEL.NUEVA];
    })
  );
}

export function ProveedorDeEstudio({ children }) {
  const [nivelesAlfabeto, setNivelesAlfabeto] = useState(() =>
    limpiarNivelesGuardados(load(KEY_ALFABETO, {}))
  );
  const [nivelesVocabulario, setNivelesVocabulario] = useState(() =>
    limpiarNivelesGuardados(load(KEY_JUAN, {}))
  );
  const [indiceDelVersoActual, setIndiceDelVersoActual] = useState(() =>
    load(KEY_VERSO, 0)
  );
  const listo = useRef(false);
  useEffect(() => { listo.current = true; }, []);

  useEffect(() => {
    if (!listo.current) return;
    save(KEY_ALFABETO, nivelesAlfabeto);
  }, [nivelesAlfabeto]);

  useEffect(() => {
    if (!listo.current) return;
    save(KEY_JUAN, nivelesVocabulario);
  }, [nivelesVocabulario]);

  useEffect(() => {
    if (!listo.current) return;
    save(KEY_VERSO, indiceDelVersoActual);
  }, [indiceDelVersoActual]);

  const borrarTodoElProgreso = useCallback(() => {
    setNivelesAlfabeto({});
    setNivelesVocabulario({});
    setIndiceDelVersoActual(0);
  }, []);

  const borrarProgresoVocabulario = useCallback(() => {
    setNivelesVocabulario({});
  }, []);

  const actualizarNivelAlfabeto = useCallback((id, esCorrecta) => {
    setNivelesAlfabeto((prev) => actualizarNivel(prev, id, esCorrecta));
  }, []);

  const actualizarNivelVocabulario = useCallback((id, esCorrecta) => {
    setNivelesVocabulario((prev) => actualizarNivel(prev, id, esCorrecta));
  }, []);

  const establecerNivelVocabulario = useCallback((id, nivel) => {
    if (!NIVELES[nivel]) return;
    setNivelesVocabulario((prev) => ({ ...prev, [id]: nivel }));
  }, []);

  const value = useMemo(
    () => ({
      nivelesAlfabeto,
      nivelesVocabulario,
      indiceDelVersoActual,
      setIndiceDelVersoActual,
      borrarTodoElProgreso,
      borrarProgresoVocabulario,
      actualizarNivelAlfabeto,
      actualizarNivelVocabulario,
      establecerNivelVocabulario,
    }),
    [
      nivelesAlfabeto,
      nivelesVocabulario,
      indiceDelVersoActual,
      borrarTodoElProgreso,
      borrarProgresoVocabulario,
      actualizarNivelAlfabeto,
      actualizarNivelVocabulario,
      establecerNivelVocabulario,
    ]
  );

  return (
    <EstudioContext.Provider value={value}>{children}</EstudioContext.Provider>
  );
}
