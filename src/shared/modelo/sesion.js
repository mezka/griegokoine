export class SesionBase {
  constructor(rondas, indice, aciertos, fallos) {
    this._rondas = rondas;
    this._indice = indice;
    this._aciertos = aciertos;
    this._fallos = fallos;
  }

  actual() { return this._rondas[this._indice]; }

  avanzar(esCorrecta) {
    return new this.constructor(
      this._rondas,
      this._indice + 1,
      this._aciertos + (esCorrecta ? 1 : 0),
      this._fallos + (esCorrecta ? 0 : 1),
    );
  }

  terminada() { return this._indice >= this._rondas.length; }
  get aciertos() { return this._aciertos; }
  get fallos() { return this._fallos; }
  get total() { return this._rondas.length; }
  get indice() { return this._indice; }
}
