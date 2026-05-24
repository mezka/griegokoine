import { NIVEL } from "../../shared/modelo/niveles.js";
import { resolverVerso } from "../../shared/modelo/funciones.js";
import { SesionBase } from "../../shared/modelo/sesion.js";
import { shuffleArray } from "../../shared/utils/shuffle.js";

function significadosIncorrectos(entradas, lemmaCorrecta, cantidad = 3) {
  const significados = new Set();
  for (const e of Object.values(entradas)) {
    if (e.lemma !== lemmaCorrecta) significados.add(e.apariciones[0].significado);
  }
  return shuffleArray([...significados]).slice(0, cantidad);
}

function formasIncorrectas(entradas, lemmaCorrecta, cantidad = 3) {
  const formas = new Set();
  for (const e of Object.values(entradas)) {
    if (e.lemma === lemmaCorrecta) continue;
    for (const ap of e.apariciones) formas.add(ap.forma);
  }
  return shuffleArray([...formas]).slice(0, cantidad);
}

function lemmasParaPracticar(entradas) {
  return Object.values(entradas).filter(
    (e) => e.nivel > NIVEL.NUEVA && e.nivel < NIVEL.DOMINADA
  );
}

function crearRondaVocabulario(entradas, versos, entrada) {
  const ap = entrada.apariciones[Math.floor(Math.random() * entrada.apariciones.length)];
  const verso = versos.find((v) => v.numero === ap.verso);
  const elementos = resolverVerso(verso, entradas);
  const indiceTarget = indiceElementoConIndiceGlobal(verso, ap.indice);
  return { lemma: entrada.lemma, versoResuelto: { elementos, indiceTarget }, significado: ap.significado, forma: ap.forma };
}

function indiceElementoConIndiceGlobal(verso, indiceGlobal) {
  let cuenta = verso.indiceInicial;
  for (let i = 0; i < verso.elementos.length; i++) {
    if (verso.elementos[i].tipo === "puntuacion") continue;
    if (cuenta === indiceGlobal) return i;
    cuenta++;
  }
  return -1;
}

export class SesionRecordarSignificado extends SesionBase {
  static crear(entradas, versos) {
    const lemmas = lemmasParaPracticar(entradas);
    const rondas = shuffleArray([...lemmas]).map((entrada) => {
      const ronda = crearRondaVocabulario(entradas, versos, entrada);
      return { id: ronda.lemma, versoResuelto: ronda.versoResuelto, significado: ronda.significado };
    });
    return new SesionRecordarSignificado(rondas, 0, 0, 0);
  }

  evaluar(eleccion) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = eleccion === "laSé";
    return {
      esCorrecta, id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}

export class SesionElegirSignificado extends SesionBase {
  static crear(entradas, versos) {
    const lemmas = lemmasParaPracticar(entradas);
    const rondas = shuffleArray([...lemmas]).map((entrada) => {
      const ronda = crearRondaVocabulario(entradas, versos, entrada);
      return {
        id: ronda.lemma,
        versoResuelto: ronda.versoResuelto,
        significadoCorrecto: ronda.significado,
        opciones: shuffleArray([ronda.significado, ...significadosIncorrectos(entradas, ronda.lemma)]),
      };
    });
    return new SesionElegirSignificado(rondas, 0, 0, 0);
  }

  evaluar(significadoElegido) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = significadoElegido === ronda.significadoCorrecto;
    return {
      esCorrecta, id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}

export class SesionCompletarPalabra extends SesionBase {
  static crear(entradas, versos) {
    const lemmas = lemmasParaPracticar(entradas);
    const rondas = shuffleArray([...lemmas]).map((entrada) => {
      const ronda = crearRondaVocabulario(entradas, versos, entrada);
      return {
        id: ronda.lemma,
        versoResuelto: ronda.versoResuelto,
        formaCorrecta: ronda.forma,
        opciones: shuffleArray([ronda.forma, ...formasIncorrectas(entradas, ronda.lemma)]),
      };
    });
    return new SesionCompletarPalabra(rondas, 0, 0, 0);
  }

  evaluar(palabraElegida) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = palabraElegida === ronda.formaCorrecta;
    return {
      esCorrecta, id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}

function leerAnalisisGramatical(ap) {
  const texto = ap.analisisGramatical.toLowerCase();
  return {
    esSustantivoOAdjetivo: /sustantivo|adjetivo|art[íi]culo|pron|participio/.test(texto),
    esVerboConjugado: /^verbo\b/.test(texto) && !/infinitivo/.test(texto),
    caso: texto.match(/\b(nom|gen|dat|ac|voc)\./)?.[1] || null,
    tiempo: texto.match(/\b(pres|impf|aor|perf|plup|fut)\./)?.[1] || null,
  };
}

const CASOS = [
  { id: "nom", label: "nominativo" },
  { id: "gen", label: "genitivo" },
  { id: "dat", label: "dativo" },
  { id: "ac", label: "acusativo" },
  { id: "voc", label: "vocativo" },
];

const TIEMPOS = [
  { id: "pres", label: "presente" },
  { id: "impf", label: "imperfecto" },
  { id: "aor", label: "aoristo" },
  { id: "fut", label: "futuro" },
  { id: "perf", label: "perfecto" },
];

export class SesionReconocerGramatica extends SesionBase {
  static crear(entradas, versos) {
    const rondas = [];
    for (const verso of versos) {
      const elementos = resolverVerso(verso, entradas);
      for (let idx = 0; idx < elementos.length; idx++) {
        const el = elementos[idx];
        if (el.tipo === "puntuacion") continue;
        const gramatica = leerAnalisisGramatical(el.aparicion);
        if (gramatica.esSustantivoOAdjetivo && gramatica.caso) {
          rondas.push({
            id: el.entrada.lemma,
            palabra: { forma: el.aparicion.forma, significado: el.aparicion.significado, analisisGramatical: el.aparicion.analisisGramatical },
            tipo: "caso",
            respuestaCorrecta: gramatica.caso,
            versoResuelto: { elementos, indiceTarget: idx },
            opciones: shuffleArray(crearOpciones(gramatica.caso, CASOS)),
          });
        } else if (gramatica.esVerboConjugado && gramatica.tiempo) {
          rondas.push({
            id: el.entrada.lemma,
            palabra: { forma: el.aparicion.forma, significado: el.aparicion.significado, analisisGramatical: el.aparicion.analisisGramatical },
            tipo: "tiempo",
            respuestaCorrecta: gramatica.tiempo,
            versoResuelto: { elementos, indiceTarget: idx },
            opciones: shuffleArray(crearOpciones(gramatica.tiempo, TIEMPOS)),
          });
        }
      }
    }
    return new SesionReconocerGramatica(shuffleArray(rondas), 0, 0, 0);
  }

  evaluar(opcionId) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = opcionId === ronda.respuestaCorrecta;
    return {
      esCorrecta, id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}

function crearOpciones(respuesta, pool) {
  const correcta = pool.find((o) => o.id === respuesta);
  const distractores = shuffleArray(pool.filter((o) => o.id !== respuesta)).slice(0, 3);
  return [correcta, ...distractores];
}
