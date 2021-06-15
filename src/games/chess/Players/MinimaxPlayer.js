import Player from "../Player";

const LOWERBOUND = 0;
const UPPERBOUND = 1;
const EXACT = 2;
const INF = Math.pow(2, 24);
const MAX_TIME = 2000;
let startTime = 0;
let tableSize = 65536;

export default class MinimaxPlayer extends Player {
  constructor(colour) {
    super(colour);
    this.table = [];
    for (let i = 0; i < tableSize; i++) {
      this.table.push([]);
    }
    this.hits = 0;
  }


  selectMove(moves, game) {
    // console.log(moves);
    // this.hits = 0;
    // const result = this.minimax(game, 10, -INF, INF, this.colour);
    // console.log("Transposition Table Hits: " + this.hits);
    // console.log("Eval: " + result[0]);
    // return result[1];
    startTime = Date.now();
    let depth = 6;
    let bestMove = moves[0];
    let bestEval = -INF;
    let maxSearchDepth = 100;
    while ((Date.now() - startTime) <= MAX_TIME && depth <= maxSearchDepth) {
      const minimax = this.minimax(game, depth, -INF, INF, this.colour);
      const currEval = minimax[0];
      const move = minimax[1];
      if (currEval > bestEval) {
        bestMove = move;
        bestEval = currEval;
      }
      depth++;
    }
    console.log("Max Depth: " + (depth - 1));
    return bestMove;
  }

  minimax(game, depth, alpha, beta, colour) {
    const alphaOrig = alpha;
    const betaOrig = beta;
    if (depth === 0 || ((Date.now() - startTime) > MAX_TIME)) {
      return [this.staticEval(game.board) * colour, null];
    }

    const validMoves = game.generateValidMoves().sort((a, b) => b.value() - a.value());
    const gm = game.checkTerminal(validMoves);
    if (gm[0]) {
      if (gm[1] === 0) {
        return [0, null];
      }
      return [INF * gm[1] * colour, null]
    }

    const hash = game.hash;
    let entry = this.table[hash.last16bits()];
    if (entry.length > 0) {
      const entryHash = entry[0];
      const entryDepth = entry[1];
      const entryEval = entry[2];
      const entryMove = entry[3];
      const flag = entry[4];
      // if (entryDepth > depth && colour === -1) {
      //   console.log(depth);
      //   console.log(entryMove, validMoves);
      // }

      if (hash.equals(entryHash) && entryDepth < depth && entryMove.isValidMove(validMoves)) {
        this.hits++;
        switch (flag) {
          case 0:
            alpha = Math.max(alpha, entryEval);
            break;
          case 1:
            beta = Math.min(alpha, entryEval);
            break;
          case 2:
            return [entryEval, entryMove];
          default:
            break;
        }
        if (alpha >= beta) {
          return [entryEval, entryMove];
        }
      }
    }

    let bestEval = -INF;
    let bestMove = null;
    for (let i = 0; i < validMoves.length; i++) {
      game.applyMove(validMoves[i]);
      const negamax = this.minimax(game, depth - 1, -beta, -alpha, -colour);
      game.unapplyMove(validMoves[i]);

      const currEval = -negamax[0];
      if (currEval > bestEval) {
        bestEval = currEval;
        bestMove = validMoves[i];
      }
      alpha = Math.max(alpha, bestEval);
      if (beta <= alpha) {
        break;
      }
    }
    if (bestMove === null) {
      bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    entry = []
    entry.push(hash);
    entry.push(depth);
    entry.push(bestEval);
    entry.push(bestMove);
    if (bestEval <= alphaOrig) {
      entry.push(UPPERBOUND);
    } else if (bestEval >= betaOrig) {
      entry.push(LOWERBOUND);
    } else {
      entry.push(EXACT);
    }
    this.table[hash.last16bits()] = entry;

    return [bestEval, bestMove];
  }

  staticEval(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        score += board[r][c];
      }
    }
    return score;
  }
}