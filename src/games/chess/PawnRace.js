import Move from "./Move"
import Long from "./Long";

const WHITE = 1;
const BLACK = -1;
const EMPTY = 0;

class PawnRace {
  constructor() {
    this.board = []
    for (let r = 0; r < 8; r++) {
      const arr = [];
      for (let c = 0; c < 8; c++) {
        arr.push(EMPTY);
      }
      this.board.push(arr);
    }
    this.enpassant_col = -1;
    this.turn = 1;
    this.moves = [];

    // Turing Test

    // this.board[1][1] = WHITE;
    // this.board[2][2] = WHITE;
    // this.board[2][3] = WHITE;
    // this.board[4][1] = BLACK;
    // this.board[4][2] = BLACK;
    // this.board[4][3] = BLACK;

    // this.board[5][1] = BLACK;
    // this.board[5][2] = BLACK;
    // this.board[5][3] = BLACK;
    // this.board[3][1] = WHITE;
    // this.board[3][2] = WHITE;
    // this.board[3][3] = WHITE;

    // Normal Board

    for (let i = 0; i < 8; i++) {
      this.board[1][i] = WHITE;
    }

    this.board[1][Math.floor(Math.random() * 8)] = 0

    for (let i = 0; i < 8; i++) {
      this.board[6][i] = BLACK;
    }

    this.board[6][Math.floor(Math.random() * 8)] = 0

    this.zArray = [];
    const rs = [];
    while (rs.length < (64 + 8 + 1) * 4) {
      const r = Math.floor(Math.random() * Math.pow(2, 16));
      if (rs.indexOf(r) === -1) rs.push(r);
    }
    for (let col = 0; col < 2; col++) {
      let arr = [];
      for (let i = 0; i < 64; i++) {
        arr.push(new Long(rs[i * 4], rs[i * 4 + 1], rs[i * 4 + 2], rs[i * 4 + 3]));
      }
      this.zArray.push(arr);
    }
    this.zDoublePush = [];
    for (let i = 64; i < 72; i++) {
      this.zDoublePush.push(new Long(rs[i * 4], rs[i * 4 + 1], rs[i * 4 + 2], rs[i * 4 + 3]));
    }
    const i = 72;
    this.zBlackMove = new Long(rs[i * 4], rs[i * 4 + 1], rs[i * 4 + 2], rs[i * 4 + 3]);
    this.hash = this.generateHash();

    // console.log(this.hash.xor(this.zBlackMove).xor(this.zBlackMove).equals(this.hash));
  }

  getCurrentColor() {
    return this.turn % 2 === 1 ? WHITE : BLACK;
  }

  generateValidMoves() {
    const color = this.getCurrentColor();
    const moves = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === color && color === WHITE) {
          if (row === 1 && this.board[row + 1][col] === EMPTY && this.board[row + 2][col] === EMPTY) {
            moves.push(new Move([row, col], [row + 2, col], false, false));
          }
          if (row < 7 && this.board[row + 1][col] === EMPTY) {
            moves.push(new Move([row, col], [row + 1, col], false, false));
          }
          if (row < 7 && col < 7 && this.board[row + 1][col + 1] === BLACK) {
            moves.push(new Move([row, col], [row + 1, col + 1], true, false));
          }
          if (row < 7 && col > 0 && this.board[row + 1][col - 1] === BLACK) {
            moves.push(new Move([row, col], [row + 1, col - 1], true, false));
          }
          if (row === 4 && col < 7 && this.board[row][col + 1] === BLACK && this.enpassant_col === col + 1) {
            moves.push(new Move([row, col], [row + 1, col + 1], true, true));
          }
          if (row === 4 && col > 0 && this.board[row][col - 1] === BLACK && this.enpassant_col === col - 1) {
            moves.push(new Move([row, col], [row + 1, col - 1], true, true));
          }
        } else if (this.board[row][col] === color && color === BLACK) {
          if (row === 6 && this.board[row - 1][col] === EMPTY && this.board[row - 2][col] === EMPTY) {
            moves.push(new Move([row, col], [row - 2, col], false, false));
          }
          if (row > 0 && this.board[row - 1][col] === EMPTY) {
            moves.push(new Move([row, col], [row - 1, col], false, false));
          }
          if (row > 0 && col < 7 && this.board[row - 1][col + 1] === WHITE) {
            moves.push(new Move([row, col], [row - 1, col + 1], true, false));
          }
          if (row > 0 && col > 0 && this.board[row - 1][col - 1] === WHITE) {
            moves.push(new Move([row, col], [row - 1, col - 1], true, false));
          }
          if (row === 3 && col < 7 && this.board[row][col + 1] === WHITE && this.enpassant_col === col + 1) {
            moves.push(new Move([row, col], [row - 1, col + 1], true, true));
          }
          if (row === 3 && col > 0 && this.board[row][col - 1] === WHITE && this.enpassant_col === col - 1) {
            moves.push(new Move([row, col], [row - 1, col - 1], true, true));
          }
        }
      }
    }

    return moves;
  }

  applyMove(move) {
    const lastMove = this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;
    this.moves.push(move);

    const occupant = this.board[move.fr[0]][move.fr[1]];
    let cIndex = (occupant + 1) / 2;

    this.board[move.to[0]][move.to[1]] = occupant;
    this.hash = this.hash.xor(this.zArray[cIndex][move.to[0] * 8 + move.to[1]]);

    this.board[move.fr[0]][move.fr[1]] = EMPTY;
    this.hash = this.hash.xor(this.zArray[cIndex][move.fr[0] * 8 + move.fr[1]]);

    this.enpassant_col = -1;
    if (move.isDoublePush()) {
      this.enpassant_col = move.to[1];
      this.hash = this.hash.xor(this.zDoublePush[move.to[1]]);
    } else if (lastMove && lastMove.isDoublePush()) {
      this.hash = this.hash.xor(this.zDoublePush[move.to[1]]);
    }

    if (move.enp) {
      this.board[move.fr[0]][move.to[1]] = EMPTY;
      this.hash = this.hash.xor(this.zArray[1 - cIndex][move.fr[0] * 8 + move.to[1]]);
    } else if (move.cap) {
      this.hash = this.hash.xor(this.zArray[1 - cIndex][move.to[0] * 8 + move.to[1]]);
    }

    this.turn += 1
    this.hash = this.hash.xor(this.zBlackMove);
  }

  unapplyMove(move) {
    this.moves.pop();
    const lastMove = this.moves.length > 0 ? this.moves[this.moves.length - 1] : null;

    const occupant = this.board[move.to[0]][move.to[1]];
    let cIndex = (occupant + 1) / 2;

    this.board[move.to[0]][move.to[1]] = EMPTY;
    this.hash = this.hash.xor(this.zArray[cIndex][move.to[0] * 8 + move.to[1]]);

    this.board[move.fr[0]][move.fr[1]] = occupant;
    this.hash = this.hash.xor(this.zArray[cIndex][move.fr[0] * 8 + move.fr[1]]);

    this.enpassant_col = -1;
    if (move.isDoublePush()) {
      this.hash = this.hash.xor(this.zArray[cIndex][move.fr[0] * 8 + move.fr[1]]);
    } else if (lastMove && lastMove.isDoublePush()) {
      this.enpassant_col = lastMove.to[1];
      this.hash = this.hash.xor(this.zArray[cIndex][move.fr[0] * 8 + move.fr[1]]);
    }

    const other = -occupant;
    if (move.enp) {
      this.board[move.fr[0]][move.to[1]] = other;
      this.hash = this.hash.xor(this.zArray[1 - cIndex][move.fr[0] * 8 + move.to[1]]);
    } else if (move.cap) {
      this.board[move.to[0]][move.to[1]] = other;
      this.hash = this.hash.xor(this.zArray[1 - cIndex][move.to[0] * 8 + move.to[1]]);
    }

    this.turn += 1
    this.hash = this.hash.xor(this.zBlackMove);
  }

  checkTerminal(moves) {
    if (moves.length === 0) {
      return [true, EMPTY];
    }
    for (let i = 0; i < 8; i++) {
      if (this.board[0][i] === BLACK) {
        return [true, BLACK];
      }
    }
    for (let i = 0; i < 8; i++) {
      if (this.board[7][i] === WHITE) {
        return [true, WHITE];
      }
    }
    return [false, EMPTY];
  }

  generateHash() {
    let hash = new Long(0, 0, 0, 0);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.board[r][c] !== EMPTY) {
          hash = hash.xor(this.zArray[(this.board[r][c] + 1) / 2][r * 8 + c]);
        }
      }
    }
    if (this.getCurrentColor() === BLACK) {
      hash = hash.xor(this.zBlackMove);
    }
    return hash;
  }
}

export default PawnRace