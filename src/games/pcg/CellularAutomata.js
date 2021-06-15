class CellularAutomata {
  GenerateCave(width, height, floorRatio) {
    const board = [];

    this.GenerateRandom(board, width, height, floorRatio);

    return board;
  }

  GenerateRandom(board, width, height, floorRatio) {
    for (let x = 0; x < width; x++) {
      board[x] = [];
      for (let y = 0; y < height; y++) {
        if (Math.random() < floorRatio || x < 2 || y < 2 || x >= width - 2 || y >= height - 2) {
          board[x][y] = 1;
        } else {
          board[x][y] = 0;
        }
      }
    }
  }

  CellularAutomata(board, lowerBound, upperBound) {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[0].length; y++) {
        const neighbours = this.GetNeighbourWallCount(board, x, y);
        if (neighbours > upperBound) {
          board[x][y] = 1;
        } else if (neighbours < lowerBound) {
          board[x][y] = 0;
        }
      }
    }
  }

  RemoveExcessRegions(board, threshold, type) {
    const regions = [];
    const flags = [];
    for (let x = 0; x < board.length; x++) {
      flags[x] = [];
      for (let y = 0; y < board[0].length; y++) {
        flags[x][y] = 0;
      }
    }
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[0].length; y++) {
        if (board[x][y] === type && flags[x][y] === 0) {
          regions.push(this.GetRegionTiles(board, x, y, flags));
        }
      }
    }
    for (let i = 0; i < regions.length; i++) {
      if (regions[i].length < threshold) {
        while (regions[i].length !== 0) {
          const current = regions[i].pop();
          const hPos = current[0];
          const vPos = current[1];
          board[hPos][vPos] = 1 - type;
        }
      }
    }
  }

  GetRegionTiles(board, x, y, flags) {
    const type = board[x][y];
    const regionTiles = []
    const openSet = [[x, y]];
    while (openSet.length !== 0) {
      const current = openSet.pop();
      const hPos = current[0];
      const vPos = current[1];
      flags[hPos][vPos] = 1;
      for (let Y = vPos - 1; Y <= vPos + 1; Y++) {
        for (let X = hPos - 1; X <= hPos + 1; X++) {
          if (Math.abs(X - hPos) !== Math.abs(Y - vPos)
            && X >= 0 && X < board.length && Y >= 0 && Y < board[0].length
            && flags[X][Y] === 0 && board[X][Y] === type) {
            openSet.push([X, Y]);
          }
        }
      }
      regionTiles.push(current);
    }
    return regionTiles;
  }

  GetNeighbourWallCount(board, hPos, vPos) {
    let count = 0;
    for (let y = vPos - 1; y <= vPos + 1; y++) {
      for (let x = hPos - 1; x <= hPos + 1; x++) {
        if (x < 0 || x >= board.length || y < 0 || y >= board[0].length || board[x][y] === 1) {
          count++;
        }
      }
    }
    return count;
  }
}

export default CellularAutomata;