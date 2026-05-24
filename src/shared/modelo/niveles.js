export const NIVEL = { NUEVA: 0, REPASAR: 1, VISTA: 2, FAMILIAR: 3, SOLIDA: 4, DOMINADA: 5 };

export const NIVELES = [
  { valor: 0, nombre: "nueva",    color: null,     texto: null,     punteado: true },
  { valor: 1, nombre: "repasar",  color: "#9a3838", texto: "#7a2828", punteado: false },
  { valor: 2, nombre: "vista",    color: "#b06820", texto: "#7a4818", punteado: false },
  { valor: 3, nombre: "familiar", color: "#a88410", texto: "#75580a", punteado: false },
  { valor: 4, nombre: "sólida",   color: "#5e7a48", texto: "#3e552e", punteado: false },
  { valor: 5, nombre: "dominada", color: "#a89876", texto: "#a89876", punteado: false },
];

export function metadatosDelNivel(nivel) {
  return NIVELES[nivel] || NIVELES[0];
}

export function actualizarNivel(prev, id, esCorrecta) {
  const nivel = prev[id] ?? NIVEL.NUEVA;
  const nuevo = esCorrecta
    ? Math.min(NIVEL.DOMINADA, nivel + 1)
    : Math.max(NIVEL.NUEVA, nivel - 1);
  return { ...prev, [id]: nuevo };
}
