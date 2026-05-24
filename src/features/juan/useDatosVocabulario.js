import { useMemo } from "react";
import { useEstudio } from "../../state/useEstudio.js";
import { entradasVocabulario, versosVocabulario } from "../../shared/modelo/funciones.js";
import { DATOS_CRUDOS_JUAN_1 } from "./data/crudo.js";

export function useDatosVocabulario() {
  const { nivelesVocabulario } = useEstudio();

  const entradas = useMemo(
    () => entradasVocabulario(DATOS_CRUDOS_JUAN_1, nivelesVocabulario),
    [nivelesVocabulario]
  );

  const versos = useMemo(
    () => versosVocabulario(DATOS_CRUDOS_JUAN_1),
    []
  );

  return { entradas, versos };
}
