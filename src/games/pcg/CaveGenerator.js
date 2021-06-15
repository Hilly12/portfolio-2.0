import React, {Component} from 'react';
import {Button} from "reactstrap";
import CellularAutomata from "./CellularAutomata";

let width = 128;
let height = 64;
let wallThreshold = 50;
let floorThreshold = 50;

class CaveGenerator extends Component {
  constructor(props) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.paint = this.paint.bind(this);
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handleIterate = this.handleIterate.bind(this);
    this.state = {
      width: 0,
      height: 0,
      sq: 0,
      generator: undefined,
      board: [],
      style: 1,
      method: 1,
      level: 1,
      states: [],
      levels: [],
      regionsProcessed: false,
      text: 'Press the right arrow key or tap to Iterate'
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    this.canvasRef = React.createRef();

    const generator = new CellularAutomata();
    this.setState({ generator: generator })
    const board = generator.GenerateCave(width, height, 0.4);
    this.setState({
      board: board
    });

    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.paint();
  }

  componentWillUnmount() {
    document.onkeydown = null;
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      sq: Math.min(window.innerWidth * 0.8, 1024) / width
    });
  }

  handleGenerate() {
    this.setState({
      board: this.state.generator.GenerateCave(width, height, 0.4),
      level: 1,
      states: [],
      levels: []
    });
    this.paint()
  }

  handleIterate() {
    if (!this.hasChanged()) {
      this.setState({
        level: this.state.level + 1
      })
      if (this.state.level >= 7) {
        return;
      }
    }
    const arr = []
    for (let x = 0; x < this.state.board.length; x++) {
      arr[x] = [];
      for (let y = 0; y < this.state.board[0].length; y++) {
        arr[x][y] = this.state.board[x][y];
      }
    }
    const lvl = this.state.level;

    this.state.states.push(arr);
    this.state.levels.push(lvl);
    if (lvl === 1) {
      this.setState({
        text: "Cellular Automata - 4, 4",
        regionsProcessed: false
      })
      console.log(this.state.text);
      this.state.generator.CellularAutomata(this.state.board, 4, 4);
    } else if (lvl === 2) {
      this.setState({
        text: "Removed Small Wall Regions - " + wallThreshold,
        regionsProcessed: true
      })
      console.log(this.state.text);
      this.state.generator.RemoveExcessRegions(this.state.board, wallThreshold, 1);
    } else if (lvl === 3) {
      this.setState({
        text: "Removed Small Floor Regions - " + floorThreshold,
        regionsProcessed: true
      })
      console.log(this.state.text);
      this.state.generator.RemoveExcessRegions(this.state.board, floorThreshold, 0);
    } else if (lvl === 4) {
      this.setState({
        text: "Cellular Automata - 5, 5",
        regionsProcessed: false
      })
      console.log(this.state.text);
      this.state.generator.CellularAutomata(this.state.board, 5, 5);
    } else if (lvl === 5) {
      this.setState({
        text: "Removed Small Wall Regions - " + wallThreshold,
        regionsProcessed: true
      })
      console.log(this.state.text);
      this.state.generator.RemoveExcessRegions(this.state.board, wallThreshold, 1);
    } else if (lvl === 6) {
      this.setState({
        text: "Removed Small Floor Regions - " + floorThreshold,
        regionsProcessed: true
      })
      console.log(this.state.text);
      this.state.generator.RemoveExcessRegions(this.state.board, floorThreshold, 0);
    }
    this.paint();
  }

  handleUndo() {
    if (this.state.states.length > 0) {
      const prev = this.state.states.pop();
      const lvl = this.state.levels.pop();
      console.log(lvl);
      if(this.state.level === 2 || this.state.level === 5) {
        this.setState({
          regionsProcessed: false
        })
      } else if(this.state.level === 4) {
        this.setState({
          regionsProcessed: true
        })
      }
      this.setState({
        board: prev,
        level: lvl,
        text: 'Press the right arrow key or tap to Iterate',
      });
      this.paint();
    }
  }

  hasChanged() {
    if (this.state.states.length === 0) {
      return true;
    }
    if (this.state.regionsProcessed) {
      return false;
    }
    const prev = this.state.states[this.state.states.length - 1];
    for (let x = 0; x < this.state.board.length; x++) {
      for (let y = 0; y < this.state.board[0].length; y++) {
        if (prev[x][y] !== this.state.board[x][y]) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    return (
      <div style={{ width: '100%', height: '80vh', textAlign: 'center' }}>
        <div style={{ paddingTop: '20px' }}/>
        <span style={{ fontFamily: 'Monospace', fontSize: '16px', fontWeight: '600' }}>{'<- '}</span>
        {this.state.text}
        <span style={{ fontFamily: 'Monospace', fontSize: '16px', fontWeight: '600' }}>{' ->'}</span>
        <br/>
        <canvas onClick={this.handleIterate} ref={this.canvasRef} width={this.state.sq * width}
                height={this.state.sq * height}/>
        <br/>
        <div
          style={{
            width: `${this.state.sq * width}px`,
            display: `${this.state.width < 535 ? 'initial' : 'inline-flex'}`,
            margin: 'auto'
          }}>
          <div className="p-1" style={{ textAlign: 'center', margin: 'auto' }}>
            <Button size="sm" onClick={this.handleGenerate} color="info" style={{ width: '100px' }}>
              Generate
            </Button>
          </div>
          {/*<div className="p-1" style={{ textAlign: 'center', }}>*/}
          {/*  <ButtonGroup size="sm">*/}
          {/*    <Button outline onClick={() => this.setState({ style: 1 })} active={this.state.style === 1}*/}
          {/*            color="info" className="button-group" style={{ width: '100px' }}>Landscape</Button>*/}
          {/*    <Button outline onClick={() => this.setState({ style: 2 })} active={this.state.style === 2}*/}
          {/*            color="info" className="button-group" style={{ width: '100px' }}>Cavern</Button>*/}
          {/*    <Button outline onClick={() => this.setState({ style: 3 })} active={this.state.style === 3}*/}
          {/*            color="info" className="button-group" style={{ width: '100px' }}>Fractal</Button>*/}
          {/*  </ButtonGroup>*/}
          {/*</div>*/}

        </div>
      </div>
    );
  }

  paint() {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const board = this.state.board;
    let sq = this.state.sq;

    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[0].length; y++) {
        if (this.state.level < 7) {
          ctx.strokeStyle = "#888888";
          ctx.strokeRect(x * sq, y * sq, sq, sq);
        }
        if (board[x][y] === 0) {
          ctx.fillStyle = "#f8f8f8"
        } else {
          ctx.fillStyle = "#111111"
        }
        ctx.fillRect(x * sq, y * sq, sq, sq);
      }
    }
  }

  onKeyDown = (e) => {
    e = e || window["event"];
    switch (e.keyCode) {
      case 37:
        this.handleUndo();
        break;
      case 39:
        this.handleIterate();
        break;
      default:
        break;
    }
  };
}

export default CaveGenerator;