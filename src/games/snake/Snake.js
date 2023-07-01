import React, {Component} from "react";
import {useSwipeable} from "react-swipeable";
import "./Snake.css";
import Modal from "../../components/Modal";
import {Button, ButtonGroup, Form, FormGroup, Spinner, Table} from "reactstrap";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// http://127.0.0.1:8000/api/scores/
// https://www.aahilm.com/api/scores/
const server = "https://www.aahil.dev/stocks/scores/";

export const Swipeable = ({children, ...props}) => {
  const handlers = useSwipeable(props);
  return (<div { ...handlers }>{children}</div>);
}

const width = 32;
const height = 16;
const sq = 3.125;
const blank = [];
const board = [];
const spRate = 7;

const initialState = {
  snake: [
    [10, 8],
    [9, 8],
  ],
  fruit: getRandomCoordinates(undefined),
  specialFruit: undefined,
  lifetime: 0,
  fruits: 0,
  score: 0,
  direction: "r",
  gameState: 0,
  gameOverModal: false,
  scoreModal: false,
  settingsModal: false,
};

const defaultAdjectives = [
  'aged', 'ancient', 'autumn', 'billowing', 'bitter', 'black', 'blue', 'bold',
  'broad', 'broken', 'calm', 'cold', 'cool', 'crimson', 'curly', 'damp',
  'dark', 'dawn', 'delicate', 'divine', 'dry', 'empty', 'falling', 'fancy',
  'flat', 'floral', 'fragrant', 'frosty', 'gentle', 'green', 'hidden', 'holy',
  'icy', 'jolly', 'late', 'lingering', 'little', 'lively', 'long', 'lucky',
  'misty', 'morning', 'muddy', 'mute', 'nameless', 'noisy', 'odd', 'old',
  'orange', 'patient', 'plain', 'polished', 'proud', 'purple', 'quiet', 'rapid',
  'raspy', 'red', 'restless', 'rough', 'round', 'royal', 'shiny', 'shrill',
  'shy', 'silent', 'small', 'snowy', 'soft', 'solitary', 'sparkling', 'spring',
  'square', 'steep', 'still', 'summer', 'super', 'sweet', 'tender', 'tight',
  'tiny', 'twilight', 'wandering', 'weathered', 'white', 'wild', 'winter', 'wispy',
  'withered', 'yellow', 'young'
]

const defaultNouns = [
  'art', 'band', 'bar', 'base', 'bird', 'block', 'boat', 'bottle',
  'bread', 'breeze', 'brook', 'bush', 'butterfly', 'cake', 'cell', 'cherry',
  'cloud', 'credit', 'darkness', 'dawn', 'dew', 'disk', 'dream', 'dust',
  'feather', 'field', 'fire', 'firefly', 'flower', 'fog', 'forest', 'frog',
  'frost', 'glade', 'glitter', 'grass', 'hall', 'hat', 'haze', 'heart',
  'hill', 'king', 'lab', 'lake', 'leaf', 'limit', 'math', 'meadow',
  'mode', 'moon', 'morning', 'mountain', 'mouse', 'mud', 'night', 'paper',
  'pine', 'poetry', 'pond', 'queen', 'rain', 'recipe', 'resonance', 'rice',
  'river', 'salad', 'scene', 'sea', 'shadow', 'shape', 'silence', 'sky',
  'smoke', 'snow', 'snowflake', 'sound', 'star', 'sun', 'sun', 'sunset',
  'surf', 'term', 'thunder', 'tooth', 'tree', 'truth', 'union', 'unit',
  'violet', 'voice', 'water', 'waterfall', 'wave', 'wildflower', 'wind', 'wood'
]

const defaultNums = 2;

for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      board.push([x, y]);
    } else {
      blank.push([x, y]);
    }
  }
}

function getRandomCoordinates(gameState) {
  if (gameState) {
    /* For variation to avoid glitch */
    let x = Math.floor(Math.random() * (width - 2)) + 1;
    let y = Math.floor(Math.random() * (height - 2)) + 1;
    let valid = false;
    while (!valid) {
      x = Math.floor(Math.random() * (width - 2)) + 1;
      y = Math.floor(Math.random() * (height - 2)) + 1;
      const head = [x, y];
      valid = !gameState.snake.some(
        (point) => point[0] === head[0] && point[1] === head[1]
      );
      if (gameState.specialFruit !== undefined) {
        const sp = gameState.specialFruit;
        valid = valid && !(sp[0] === head[0] && sp[1] === head[0]);
      }
    }
    return [x, y];
  } else {
    const x = Math.floor(Math.random() * (width - 2)) + 1;
    const y = Math.floor(Math.random() * (height - 2)) + 1;
    return [x, y];
  }
}

function draw(array, str) {
  return array.map((points, i) => {
    return (
      <div
        className={str}
        key={i}
        style={{
          left: `${points[0] * sq}%`,
          top: `${points[1] * sq * 2}%`,
        }}
      />
    );
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class Snake extends Component {
  constructor(props) {
    super(props);
    this.toggleHighScores = this.toggleHighScores.bind(this);
    this.toggleGameOver = this.toggleGameOver.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.submitScore = this.submitScore.bind(this);
    this.success = this.success.bind(this);
    this.loadLeaderboard = this.loadLeaderboard.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.saveSuccess = this.saveSuccess.bind(this);
    this.dismissSnackbar = this.dismissSnackbar.bind(this);
    this.state = {
      cookies: false,
      dname: "",
      error: false,
      helperText: " ",
      thresholdScore: 500,
      loading: false,
      saveLoading: false,
      leaderboardLoading: true,
      success: false,
      changes: "",
      refreshRate: 100,
      difficulty: 2,
      scoreDelta: 50,
      specialMultiplier: 8,
      leaderboard: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      gameState: initialState,
    };
  }

  loadLeaderboard() {
    console.log("loading leaderboard");

    axios.get(server).then((response) => {
      this.setState({
        leaderboardLoading: false,
        leaderboard: response.data,
      });
      this.setState({
        leaderboard: this.state.leaderboard.filter(a => a.game_id === 0).sort((a, b) => b.score - a.score),
      });
    });
  }

  toggleHighScores() {
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        scoreModal: !this.state.gameState.scoreModal,
      },
    }));
  }

  toggleGameOver() {
    if (this.state.gameState.score >= this.state.thresholdScore) {
      let adjective = capitalize(defaultAdjectives[Math.floor(Math.random() * defaultAdjectives.length)]);
      let noun = capitalize(defaultNouns[Math.floor(Math.random() * defaultNouns.length)]);
      let num = ''
      for (let i = 0; i < defaultNums; i++) {
        num = num + Math.floor(Math.random() * 10);
      }
      this.setState({
        dname: [adjective, noun, num].join('')
      })
    } else {
      this.setState({ dname: '' });
    }
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        gameOverModal: !this.state.gameState.gameOverModal,
      },
    }));
  }

  toggleSettings() {
    if (!this.state.gameState.settingsModal) {
      this.setState({
        diff: this.state.difficulty,
      });
    }
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        settingsModal: !this.state.gameState.settingsModal,
      },
    }));
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
    let ascii = /^[ -~]+$/;
    let whitespace = /\s/;
    if (e.target.value.toLowerCase().includes("fuck")) {
      this.setState({
        error: true,
        helperText: "Please avoid profanity",
      });
    } else if (whitespace.test(e.target.value)) {
      this.setState({
        error: true,
        helperText: "Name cannot have whitespace",
      });
    } else if (e.target.value !== "" && !ascii.test(e.target.value)) {
      this.setState({
        error: true,
        helperText: "Only ASCII characters accepted",
      });
    } else if (e.target.value.length > 25) {
      this.setState({
        error: true,
        helperText: "Name too long",
      });
    } else {
      this.setState({
        error: false,
        helperText: " ",
      });
    }
  };

  submitScore() {
    this.setState({
      loading: true,
      leaderboardLoading: true,
    });

    console.log("Making post request to " + server);

    axios.post(server, {
      username: this.state.dname,
      score: this.state.gameState.score,
      game_id: 0
    }).then((response) => {
      console.log(response);
      this.success();
    }).catch((error) => {
      console.log(error);
      this.setState({
        loading: false,
        leaderboardLoading: false,
      });
      alert("Unable to connect to server");
    });
  }

  success() {
    this.loadLeaderboard();
    this.setState({
      changes: "Score submitted",
      success: true,
      loading: false,
    });
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        gameOverModal: false,
      },
    }));
  }

  dismissSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      success: false,
    });
  };

  saveSettings() {
    this.setState({
      saveLoading: true,
    })
    if (this.state.cookies) {
      localStorage.setItem('difficulty', this.state.diff);
    }
    setTimeout(this.saveSuccess, 200);
  }

  saveSuccess() {
    this.setState({
      saveLoading: false,
      changes: "Saved changes",
      success: true,
      difficulty: this.state.diff
    })
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        settingsModal: false
      },
    }));
    this.updateVars();
  }

  render() {
    return (
      <Swipeable
        onSwipedLeft={this.moveLeft.bind(this)}
        onSwipedRight={this.moveRight.bind(this)}
        onSwipedUp={this.moveUp.bind(this)}
        onSwipedDown={this.moveDown.bind(this)}
        trackMouse={false}
      >
        <div
          onDoubleClick={this.spaceDown.bind(this)}
          className="game-board-wrapper"
        >
          <div className="game-board-wrapper-inner">
            <div style={{ marginTop: "-1.6em" }}>
              {this.state.gameState.gameState === 1
                ? `Score: ${this.state.gameState.score}`
                : "Press Space or Double Tap to Play"}
            </div>
            <div className="game-board">
              <div>
                {draw(blank, "blank tile")}
                {draw(board, "board tile")}
                {draw([this.state.gameState.fruit], "food tile")}
                {draw(this.state.gameState.snake, "snake tile")}
                {this.state.gameState.specialFruit !== undefined
                  ? draw([this.state.gameState.specialFruit], "spfood tile")
                  : null}
              </div>
            </div>
            <div style={{ paddingTop: "1px" }}>
              {this.state.gameState.specialFruit !== undefined && this.state.gameState.gameState === 1
                ? `Lifetime: ${this.state.gameState.lifetime} `
                : null}
              {this.state.gameState.gameState !== 1 ? (
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100%" }}>
                    <span className="link" onClick={this.toggleHighScores}>
                      View Leaderboard
                    </span>
                  </div>
                  <div style={{ position: "absolute", right: '10px' }}>
                    <span className="link" onClick={this.toggleSettings}>
                      Settings
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="pad"/>
        </div>
        {this.state.gameState.scoreModal ? (
          <Modal title="Leaderboard" toggle={this.toggleHighScores}>
            <Table style={{ textAlign: "left", margin: "auto" }}>
              <thead>
              <tr>
                <th width={10}/>
                <th width={10}/>
                <th>Name</th>
                <th>Score</th>
              </tr>
              </thead>
              <tbody>
              {this.state.leaderboard.map((entry, index) => {
                return (
                  <tr key={index}>
                    <th>
                      {index === 0 ? (
                        <FontAwesomeIcon
                          style={{ color: "#d4af37" }}
                          icon={faCrown}
                        />
                      ) : index === 1 ? (
                        <FontAwesomeIcon
                          style={{ color: "#aaa9ad" }}
                          icon={faCrown}
                        />
                      ) : index === 2 ? (
                        <FontAwesomeIcon
                          style={{ color: "#b08d57" }}
                          icon={faCrown}
                        />
                      ) : (
                        <FontAwesomeIcon
                          style={{ color: "#e5e4e2" }}
                          icon={faCrown}
                        />
                      )}
                    </th>
                    <th>{index + 1}</th>
                    <td>
                      {this.state.leaderboardLoading ? (
                        <Skeleton/>
                      ) : (
                        entry.username
                      )}
                    </td>
                    <td>
                      {this.state.leaderboardLoading ? (
                        <Skeleton/>
                      ) : (
                        entry.score
                      )}
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </Table>
          </Modal>
        ) : null}
        {this.state.gameState.gameOverModal ? (
          <Modal title="Game Over" toggle={this.toggleGameOver}>
            <br/>
            <p className="text-muted" style={{ textAlign: "center" }}>
              You scored {this.state.gameState.score} points
            </p>
            {this.state.gameState.score < this.state.thresholdScore ?
              <p className="text-muted" style={{ textAlign: "center" }}>
                Score over {this.state.thresholdScore} to qualify for the leaderboard
              </p> :
              null}

            <br/>
            <Form>
              <FormGroup>
                <TextField
                  disabled={this.state.gameState.score < this.state.thresholdScore || this.state.loading}
                  value={this.state.dname}
                  helperText={this.state.helperText}
                  id="dname"
                  color="primary"
                  size="small"
                  label="Name"
                  variant="outlined"
                  onChange={this.onChange}
                  error={this.state.error}
                  autoComplete="off"
                />
              </FormGroup>
              <Button
                color="primary"
                disabled={
                  this.state.gameState.score < this.state.thresholdScore ||
                  this.state.loading ||
                  this.state.error ||
                  this.state.dname.trim() === ""
                }
                onClick={this.submitScore}
                size="sm"
              >
                Submit to Leaderboard
                {this.state.loading ? (
                  <Spinner className="ml-1" size="sm"/>
                ) : null}
              </Button>
            </Form>
            <br/>
          </Modal>
        ) : null}
        {this.state.gameState.settingsModal ? (
          <Modal title="Settings" toggle={this.toggleSettings}>
            <Form>
              <FormGroup>
                <ButtonGroup size="sm">
                  <Button outline onClick={() => this.setState({ diff: 1 })} active={this.state.diff === 1}
                          color="primary" className="button-group">Easy</Button>
                  <Button outline onClick={() => this.setState({ diff: 2 })} active={this.state.diff === 2}
                          color="primary" className="button-group">Medium</Button>
                  <Button outline onClick={() => this.setState({ diff: 3 })} active={this.state.diff === 3}
                          color="primary" className="button-group">Hard</Button>
                  <Button outline onClick={() => this.setState({ diff: 4 })} active={this.state.diff === 4}
                          color="primary" className="button-group">Insane</Button>
                </ButtonGroup>
              </FormGroup>
              <Button
                color="primary"
                onClick={this.saveSettings}
                size="sm"
              >
                Save Changes
                {this.state.saveLoading ? (
                  <Spinner className="ml-1" size="sm"/>
                ) : null}
              </Button>
            </Form>
            <br/>
          </Modal>
        ) : null}
        <Snackbar
          open={this.state.success}
          autoHideDuration={2000}
          onClose={this.dismissSnackbar}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity="success"
            onClose={this.dismissSnackbar}
          >
            {this.state.changes}
          </Alert>
        </Snackbar>
      </Swipeable>
    );
  }

  componentDidMount() {
    this.loadLeaderboard();

    const cookies = JSON.parse(localStorage.getItem('cookies'));
    if (cookies) {
      this.setState({
        cookies: true
      })
      const difficulty = JSON.parse(localStorage.getItem('difficulty'));
      if (difficulty) {
        this.setState({
          difficulty: difficulty
        });
      } else {
        localStorage.setItem('difficulty', this.state.difficulty);
      }
    }

    document.onkeydown = this.onKeyDown;
  }

  componentWillUnmount() {
    document.onkeydown = null;
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
  }

  /* Check collisions */
  componentDidUpdate(prevProps, prevState, SS) {
    if (this.state.gameState.gameState !== 1) {
      return;
    }
    /* Collision with border */
    let head = this.state.gameState.snake[
    this.state.gameState.snake.length - 1
      ];
    let x = head[0];
    let y = head[1];
    if (x < 1 || y < 1 || x >= width - 1 || y >= height - 1) {
      this.onGameOver();
    }

    /* Collision with self */
    let snake = [...this.state.gameState.snake];
    head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((point) => {
      if (head[0] === point[0] && head[1] === point[1]) {
        this.onGameOver();
      }
    });

    /* Collision with fruit */
    head = this.state.gameState.snake[this.state.gameState.snake.length - 1];
    let fruit = this.state.gameState.fruit;
    if (head[0] === fruit[0] && head[1] === fruit[1]) {
      this.setState((prevState) => ({
        gameState: {
          ...prevState.gameState,
          fruit: getRandomCoordinates(this.state.gameState),
        },
      }));
      this.onEatFruit(this.state.scoreDelta);
    }

    /* Collision with special fruit */
    if (this.state.gameState.specialFruit !== undefined) {
      head = this.state.gameState.snake[this.state.gameState.snake.length - 1];
      let sp = this.state.gameState.specialFruit;
      if (head[0] === sp[0] && head[1] === sp[1]) {
        this.setState((prevState) => ({
          gameState: {
            ...prevState.gameState,
            specialFruit: undefined,
          },
        }));
        this.onEatFruit(this.state.scoreDelta * this.state.specialMultiplier);
      } else {
        if (this.state.gameState.lifetime <= 0) {
          this.setState((prevState) => ({
            gameState: {
              ...prevState.gameState,
              specialFruit: undefined,
            },
          }));
        }
      }
    }
  }

  onEatFruit(score) {
    /* Enlarge */
    let newSnake = [...this.state.gameState.snake];
    newSnake.unshift([]);
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        snake: newSnake,
      },
    }));

    /* Increment Score */
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        score: this.state.gameState.score + score,
        fruits: this.state.gameState.fruits + 1,
      },
    }));

    /* Speed up */
    // if (this.state.refreshRate > 30) {
    //   this.setState({
    //     refreshRate: this.state.refreshRate + 100,
    //   });
    // }

    /* Spawn Special Fruit */
    if (
      this.state.gameState.fruits !== 0 &&
      this.state.gameState.fruits % spRate === 0
    ) {
      this.setState((prevState) => ({
        gameState: {
          ...prevState.gameState,
          specialFruit: getRandomCoordinates(this.state.gameState),
          lifetime: 50,
        },
      }));
    }
  }

  onGameOver() {
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        gameState: 2
      },
    }));
    clearInterval(this.state.interval);
    this.toggleGameOver();
  }

  onNewGame() {
    this.updateVars();
    this.setState({
      gameState: initialState,
      interval: setInterval(this.moveSnake, this.state.refreshRate)
    });
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        gameState: 1,
      },
    }));
  }

  updateVars() {
    switch (this.state.difficulty) {
      case 1:
        this.setState({
          refreshRate: 200,
          scoreDelta: 20,
          specialMultiplier: 10
        });
        break;
      case 2:
        this.setState({
          refreshRate: 100,
          scoreDelta: 50,
          specialMultiplier: 10
        });
        break;
      case 3:
        this.setState({
          refreshRate: 70,
          scoreDelta: 100,
          specialMultiplier: 10
        });
        break;
      case 4:
        this.setState({
          refreshRate: 40,
          scoreDelta: 200,
          specialMultiplier: 20
        });
        break;
      default:
        break;
    }
  }

  moveSnake = () => {
    if (this.state.gameState.gameState !== 1) {
      return;
    }
    let snake = [...this.state.gameState.snake];
    let head = snake[snake.length - 1];

    switch (this.state.gameState.direction) {
      case "r":
        head = [head[0] + 1, head[1]];
        break;
      case "l":
        head = [head[0] - 1, head[1]];
        break;
      case "d":
        head = [head[0], head[1] + 1];
        break;
      case "u":
        head = [head[0], head[1] - 1];
        break;
      default:
        break;
    }
    snake.push(head);
    snake.shift();
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        lifetime: this.state.gameState.lifetime - 1,
        snake: snake,
      },
    }));
  };

  onKeyDown = (e) => {
    e = e || window["event"];
    switch (e.keyCode) {
      case 27:
        this.setState((prevState) => ({
          gameState: {
            ...prevState.gameState,
            gameOverModal: false,
            scoreModal: false,
            settingsModal: false
          },
        }));
        break;
      case 38:
        this.moveUp();
        break;
      case 40:
        this.moveDown();
        break;
      case 37:
        this.moveLeft();
        break;
      case 39:
        this.moveRight();
        break;
      case 32:
        this.spaceDown();
        break;
      default:
        break;
    }
  };

  spaceDown() {
    if (
      this.state.gameState.gameState !== 1 &&
      !this.state.gameState.gameOverModal
    ) {
      this.onNewGame();
    }
  }

  moveLeft() {
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        direction: "l",
      },
    }));
  }

  moveRight() {
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        direction: "r",
      },
    }));
  }

  moveUp() {
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        direction: "u",
      },
    }));
  }

  moveDown() {
    this.setState((prevState) => ({
      gameState: {
        ...prevState.gameState,
        direction: "d",
      },
    }));
  }
}

export default Snake;
