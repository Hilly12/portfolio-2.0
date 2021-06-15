export default class Move {
  constructor(fr, to, cap, enp) {
    this.fr = fr;
    this.to = to;
    this.cap = cap;
    this.enp = enp;
  }

  isDoublePush() {
    return Math.abs(this.fr[0] - this.to[0]) === 2
  }

  toString() {
    const f = String.fromCharCode(this.fr[1] + "a".charCodeAt(0)) + String.fromCharCode(this.fr[0] + "1".charCodeAt(0));
    const t = String.fromCharCode(this.to[1] + "a".charCodeAt(0)) + String.fromCharCode(this.to[0] + "1".charCodeAt(0));
    return f + (this.cap ? "x" : "-") + t + (this.enp ? " ep" : "");
  }

  value() {
    const e = this.enp ? 1 : 0;
    const c = this.cap ? 1 : 0;
    return e * 2 + c;
  }

  equals(other) {
    return this.fr === other.fr && this.to === other.to && this.cap === other.cap && this.enp === other.enp;
  }

  isValidMove(validMoves) {
    for (let i = 0; i < validMoves.length; i++) {
      if (this.equals(validMoves[i])) {
        return true;
      }
    }
    return false;
  }
}