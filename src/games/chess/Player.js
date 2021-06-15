export default class Player {
  constructor(colour) {
    this.colour = colour;
  }

  selectMove(moves, game) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  isHuman() {
    return false;
  }
}