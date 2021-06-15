class Long {
  constructor(n1, n2, n3, n4) {
    this.n1 = n1 % 65536;
    this.n2 = n2 % 65536;
    this.n3 = n3 % 65536;
    this.n4 = n4 % 65536;
  }

  equals(other) {
    return this.n1 === other.n1 && this.n2 === other.n2 && this.n3 === other.n3 && this.n4 === other.n4;
  }

  last16bits() {
    return this.n4;
  }

  xor(long) {
    return new Long((this.n1 ^ long.n1) % 65536, (this.n2 ^ long.n2) % 65536, (this.n3 ^ long.n3) % 65536, (this.n4 ^ long.n4) % 65536);
  }

  toString() {
    return [this.n1.toString(2), this.n2.toString(2), this.n2.toString(3), this.n2.toString(4)].join('-');
  }
}

export default Long;