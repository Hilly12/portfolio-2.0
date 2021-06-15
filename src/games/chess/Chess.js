import React, {Component} from 'react';
import {Button, ButtonGroup} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChessPawn} from "@fortawesome/free-solid-svg-icons/faChessPawn";
import move from "./../../assets/sounds/move.mp3"
import capture from "./../../assets/sounds/capture.mp3"
import UIfx from 'uifx';
import PawnRace from "./PawnRace";
import HumanPlayer from "./Players/HumanPlayer";
import MinimaxPlayer from "./Players/MinimaxPlayer";

const whitePawn = "https://lh3.googleusercontent.com/pw/ACtC-3dgFEJOGHR-_tbBeWu5LjxtXLSTiS91D2wrDpImnCWXX5HGTNpj3SRZe0U7_KwHVowWdHBWVn-FCpacCJvlicfA9VcFgSlqkhwtAbHuwEedwPcNlrykDXJ6M8CdMNwS4w-I8m7Z8vXy2eQuQ2ED4Ppy=s64-no";
const blackPawn = "https://lh3.googleusercontent.com/pw/ACtC-3dPNhV7HNq3JeH1JGvw7TsIcVQ1dHoOYmi2ayIWnfnGxwzNR8LpATfxuYxH-pg1YhFf6lhnCVekqxa-js3pLpppySdHxwLOeUBRdhodWSv--btxywtEeujm0WF7NJl6l1olnzwRswhz3lWSZ6S7PlUr=s64-no";

const moveSound = new UIfx(move, { volume: 1 });
const captureSound = new UIfx(capture, { volume: 1 });

class Chess extends Component {
  constructor(props) {
    super(props);

    this.newGame = this.newGame.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.gameTimer = this.gameTimer.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.click = this.click.bind(this);
    this.state = {
      boardDim: 0,
      col: 1,
      diff: 1,
      highlighted: [],
      gameOver: false,
      turn: 1
    }
  }

  newGame() {
    clearInterval(this.state.interval);
    this.game = new PawnRace();
    this.player = new HumanPlayer(this.state.col);
    this.opponent = new MinimaxPlayer(-this.state.col);

    const points = [];
    if (this.player.colour === -1) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          points.push([r, c]);
        }
      }
    } else {
      for (let r = 7; r >= 0; r--) {
        for (let c = 0; c < 8; c++) {
          points.push([r, c]);
        }
      }
    }
    this.setState({
      highlighted: [],
      interval: setInterval(this.gameTimer, 100),
      gameOver: false,
      points: points,
      turn: 1
    });
  }

  nextTurn(moves) {
    const colour = this.game.getCurrentColor();
    if (colour === this.player.colour) {
      return;
    }

    const move = this.opponent.selectMove(moves, this.game);
    if (move.cap) {
      captureSound.play();
    } else {
      moveSound.play();
    }
    this.game.applyMove(move);
    this.setState({
      turn: this.state.turn + 1
    })
  }

  gameOver(winner) {
    clearInterval(this.state.interval);
    // this.toggleGameOver(winner);
    this.setState({
      gameOver: true
    });
    if (winner === this.player.colour) {
      alert("Congratulations you win!");
    } else if (winner === -this.player.colour) {
      alert("You lose :(");
    } else {
      alert("Stalemate!");
    }
  }

  gameTimer() {
    const moves = this.game.generateValidMoves();
    const res = this.game.checkTerminal(moves)
    const gameOver = res[0];
    const winner = res[1];
    if (gameOver) {
      this.gameOver(winner);
      return;
    }
    if (this.player.colour === this.game.getCurrentColor()) {
      return;
    }

    this.nextTurn(moves);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.newGame();
  }

  componentWillUnmount() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ boardDim: Math.min(this.divElement.offsetHeight, window.innerWidth * 0.95) });
  }

  click(r, c) {
    if (!this.game || this.game.getCurrentColor() !== this.player.colour || this.state.gameOver) {
      return;
    }
    if (this.state.highlighted.length === 2) {
      const fr = this.state.highlighted;
      const to = [r, c];
      this.setState({
        highlighted: []
      });
      const validMoves = this.game.generateValidMoves();
      let move = null;
      for (let i = 0; i < validMoves.length; i++) {
        const mv = validMoves[i];
        if (fr[0] === mv.fr[0] && fr[1] === mv.fr[1] && to[0] === mv.to[0] && to[1] === mv.to[1]) {
          move = mv;
        }
      }
      if (move) {
        if (move.cap) {
          captureSound.play();
        } else {
          moveSound.play();
        }
        this.game.applyMove(move);
      }
    } else if (this.game.board[r][c] === this.player.colour) {
      this.setState({
        highlighted: [r, c]
      });
    }
  }

  render() {
    const selCol = this.state.col === 1 ? 'white' : 'black';
    const board = this.game ? this.game.board : null;
    const highlighted = this.state.highlighted;
    const points = this.state.points;
    const turn = this.state.turn;
    return (
      <div>
        <div className="chessboard-wrapper" ref={(divElement) => {
          this.divElement = divElement
        }}>
          <ButtonGroup size="sm" style={{ marginBottom: '6px' }}>
            <Button outline onClick={() => this.setState({ diff: 1 })} active={this.state.diff === 1}
                    color="info" className="button-group">Minimax</Button>
            <Button outline onClick={() => this.setState({ diff: 2 })} active={this.state.diff === 2}
                    disabled color="info" className="button-group">Alphazero</Button>
          </ButtonGroup>
          <div className="chessboard-container shadow"
               style={{ width: this.state.boardDim, height: this.state.boardDim, position: 'relative' }}>
            <div style={{ width: '100%', height: '100%' }}>
              {this.game &&
              points.map((p, key) => {
                  const x = key % 8;
                  const y = Math.floor(key / 8);
                  const r = p[0];
                  const c = p[1];
                  let classes = [];
                  if (highlighted[0] === r && highlighted[1] === c) {
                    classes.push("c-sel");
                  } else if ((r + c) % 2 === 0) {
                    classes.push("c-black");
                  } else {
                    classes.push("c-white");
                  }
                  return (
                    <div
                      className={classes.join(' ')}
                      key={key}
                      id={turn}
                      onClick={() => this.click(r, c)}
                      style={{
                        position: 'absolute',
                        left: `${x * 12.5}%`,
                        top: `${y * 12.5}%`,
                        width: '12.6%',
                        height: '12.6%'
                      }}
                    >
                      {board[r][c] !== 0 &&
                      <img style={{ width: '100%', height: '100%' }} src={board[r][c] === 1 ? whitePawn : blackPawn}
                           alt=""/>
                      }
                    </div>
                  )
                }
              )
              }
            </div>
          </div>
          <Button onClick={this.newGame} size="sm" color="info" style={{ marginTop: '8px', marginRight: '6px' }}>
            New Game
          </Button>
          <Button size="sm" color="info" onClick={() => this.setState({ col: -this.state.col })}
                  style={{ marginTop: '8px', minWidth: '30px', color: selCol }}>
            <FontAwesomeIcon icon={faChessPawn}/>
          </Button>
        </div>
      </div>
    );
  }
}

export default Chess;