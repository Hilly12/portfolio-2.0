import {Component} from "react";
import axios from "axios";

// http://127.0.0.1:8000/api/scores/
// https://www.aahilm.com/api/scores/
const server = "https://www.aahil.dev/stocks/scores/";

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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class BaseGame extends Component {
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
      gameOverLoading: false,
      saveLoading: false,
      leaderboardLoading: true,
      success: false,
      changes: "",
      leaderboard: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
      scoreModal: false,
      gameOverModal: false,
      settingsModal: false
    };
  }

  loadLeaderboard(game_id) {
    console.log("loading leaderboard");

    axios.get(server).then((response) => {
      this.setState({
        leaderboardLoading: false,
        leaderboard: response.data,
      });
      this.setState({
        leaderboard: this.state.leaderboard.filter(a => a.game_id === game_id).sort((a, b) => b.score - a.score),
      });
    });
  }

  toggleHighScores() {
    this.setState({ scoreModal: !this.state.scoreModal });
  }

  toggleGameOver(score, threshold) {
    if (score >= threshold) {
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
    this.setState({ gameOverModal: !this.state.gameOverModal });
  }

  toggleSettings(onLoad) {
    // if (!this.state.settingsModal) {
    //   this.setState({
    //     diff: this.state.difficulty,
    //   });
    // }
    onLoad();
    this.setState({ settingsModal: !this.state.settingsModal });
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
  }

  submitScore(game_id, score) {
    this.setState({
      gameOverLoading: true,
      leaderboardLoading: true,
    });

    console.log("Making post request to " + server);

    axios.post(server, {
      username: this.state.dname,
      score: score,
      game_id: game_id
    }).then((response) => {
      console.log(response);
      this.success(game_id);
    }).catch((error) => {
      console.log(error.response);
      this.setState({
        gameOverLoading: false,
        leaderboardLoading: false,
      });
      alert("Unable to connect to server");
    });
  }

  success(game_id) {
    this.loadLeaderboard(game_id);
    this.setState({
      changes: "Score submitted",
      success: true,
      gameOverLoading: false,
    });
    this.setState({ gameOverModal: false });
  }

  dismissSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      success: false,
    });
  };

  saveSettings(onSaveStart) {
    this.setState({
      saveLoading: true,
    });
    onSaveStart();
    // if (this.state.cookies) {
    //   localStorage.setItem('difficulty', this.state.diff);
    // }
    setTimeout(this.saveSuccess, 200);
  }

  saveSuccess(onSaveSuccess) {
    this.setState({
      saveLoading: false,
      changes: "Saved changes",
      success: true
    })
    onSaveSuccess();
    this.setState({ settingsModal: false });
  }
}

export default BaseGame;