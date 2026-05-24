import { createContext, useContext } from "react";

export const EstudioContext = createContext(null);

export function useEstudio() {
  const value = useContext(EstudioContext);
  if (!value) throw new Error("useEstudio debe usarse dentro de ProveedorDeEstudio");
  return value;
}
