import { SesionBase } from "../../shared/modelo/sesion.js";
import { shuffleArray } from "../../shared/utils/shuffle.js";

const OPCIONES_RECORDAR = [
  { id: "noLaSé", label: "repasar" },
  { id: "laSé", label: "la sé" },
];

export class SesionRecordarNombre extends SesionBase {
  static crear(letras) {
    const rondas = shuffleArray([...letras]).map((letra) => ({
      id: letra.nombre,
      letra,
      opciones: OPCIONES_RECORDAR,
    }));
    return new SesionRecordarNombre(rondas, 0, 0, 0);
  }

  evaluar(eleccion) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = eleccion === "laSé";
    return {
      esCorrecta,
      id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}

export class SesionQuizNombre extends SesionBase {
  static crear(letras) {
    const todas = [...letras];
    const rondas = shuffleArray(todas).map((correcta) => {
      const distractores = shuffleArray(todas.filter((e) => e.nombre !== correcta.nombre)).slice(0, 1);
      return {
        id: correcta.nombre,
        letra: correcta,
        opciones: shuffleArray([correcta, ...distractores]).map((letra) => ({
          id: letra.nombre,
          label: letra.nombre,
        })),
      };
    });
    return new SesionQuizNombre(rondas, 0, 0, 0);
  }

  evaluar(nombreElegido) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = nombreElegido === ronda.id;
    return {
      esCorrecta,
      id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}

export class SesionEmparejar extends SesionBase {
  static crear(letras) {
    const todas = [...letras];
    const rondas = shuffleArray(todas).map((letra) => {
      const mostrarMayuscula = Math.random() < 0.5;
      return {
        id: letra.nombre,
        letra,
        pregunta: mostrarMayuscula ? "mayuscula" : "minuscula",
        respuesta: mostrarMayuscula ? "minuscula" : "mayuscula",
        opciones: shuffleArray(todas).map((l) => ({
          id: l.nombre,
          label: mostrarMayuscula ? l.minuscula : l.mayuscula,
          glifo: mostrarMayuscula ? l.minuscula : l.mayuscula,
        })),
      };
    });
    return new SesionEmparejar(rondas, 0, 0, 0);
  }

  evaluar(nombreElegido) {
    const ronda = this._rondas[this._indice];
    const esCorrecta = nombreElegido === ronda.id;
    return {
      esCorrecta,
      id: ronda.id,
      sesion: this.avanzar(esCorrecta),
    };
  }
}
