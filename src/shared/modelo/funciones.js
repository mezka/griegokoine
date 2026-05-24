import { NIVEL } from "./niveles.js";

export function entradasVocabulario(capitulo, niveles) {
  const entradas = {};
  let indiceGlobal = 0;

  for (const v of capitulo.verses) {
    for (const t of v.tokens) {
      if (t.punct) continue;
      if (!entradas[t.l]) {
        entradas[t.l] = {
          lemma: t.l,
          nivel: niveles[t.l] ?? NIVEL.NUEVA,
          apariciones: [],
        };
      }
      entradas[t.l].apariciones.push({
        forma: t.f,
        verso: v.n,
        indice: indiceGlobal,
        significado: t.g,
        analisisGramatical: t.p,
      });
      indiceGlobal++;
    }
  }

  return entradas;
}

export function versosVocabulario(capitulo) {
  let global = 0;
  return capitulo.verses.map((v) => {
    const indiceInicial = global;
    const elementos = [];
    for (const t of v.tokens) {
      if (t.punct) {
        elementos.push({ tipo: "puntuacion", texto: t.punct });
      } else {
        elementos.push({ tipo: "palabra", lemma: t.l });
        global++;
      }
    }
    return { numero: v.n, elementos, indiceInicial };
  });
}

export function resolverVerso(verso, entradas) {
  let pos = verso.indiceInicial;
  return verso.elementos.map((el) => {
    if (el.tipo === "puntuacion") return el;
    const entrada = entradas[el.lemma];
    const aparicion = entrada.apariciones.find((a) => a.indice === pos);
    pos++;
    return { tipo: "palabra", entrada, aparicion };
  });
}

export function contarPorNivel(entradas) {
  const c = new Array(6).fill(0);
  for (const e of Object.values(entradas)) {
    c[e.nivel]++;
  }
  return c;
}
