import React, {Fragment} from 'react';
import UIfx from 'uifx';
import "./Spaceshooter.css"
import BaseGame from "../BaseGame";
import LeaderboardModal from "../LeaderboardModal";
import GameOverModal from "../GameOverModal";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import laser from "./../../assets/sounds/laser_gun.mp3"
import explosion from "./../../assets/sounds/explosion.mp3"
import powerup from "./../../assets/sounds/powerup.mp3"

const sp = 40;
const weight = 10;
const bulletDim = [1, 12];
const powerupDim = sp / 2;
const vel = 4;
const spinPad = [2, 10];
const spinRate = 60;
const probsUp = [0.1, 0.05, 0]
const probHp = 0.4
const hpUp = 8;
const maxhp = 100;
const asteroidScore = 50;
const enemyScore = 150;
const enemyBulletDamage = 30;

const threshold = 1000;

const bulletSound = new UIfx(laser, { volume: 0.02 });
const explosionSound = new UIfx(explosion, { volume: 0.1 });
const powerupSound = new UIfx(powerup, { volume: 0.1 })

class Spaceshooter extends BaseGame {
  constructor(props) {
    super(props);

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.update = this.update.bind(this);
    this.paint = this.paint.bind(this);
    this.state = {
      ...this.state,
      width: 0,
      height: 0,
      game: 0,
      stars: [],
      starsVel: 0.3
    }
  }

  componentDidMount() {
    this.canvasRef = React.createRef();

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

    document.onkeydown = this.onKeyDown;
    document.onkeyup = this.onKeyUp;
    this.loadLeaderboard(1);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.game === 0) {
      for (let i = 0; i < 100; i++) {
        const size = Math.random() * 2 + 0.5;
        this.state.stars.push([Math.random() * (this.state.width - 20) + 10, Math.random() * (this.state.height - 20) + 10, size, size, this.state.starsVel]);
      }
      this.setState({
        game: 1
      })
      this.paint();
    }
  }

  componentWillUnmount() {
    document.onkeydown = null;
    document.onkeyup = null;
    this.canvasRef = null;
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    let height = window.innerHeight * 0.88;
    if (window.innerHeight < 400) {
      height = window.innerHeight * 0.76
    } else if (window.innerHeight < 700) {
      height = window.innerHeight * 0.80
    } else if (window.innerHeight < 900) {
      height = window.innerHeight * 0.84
    } else if (window.innerHeight > 1280) {
      height = 1080;
    }

    let width = height * 0.8;
    if (window.innerWidth < 600) {
      width = window.innerWidth * 0.99;
    }

    this.setState({
      width: width,
      height: height,
      x: (width - sp) / 2,
      y: height - sp * 2
    });
  }

  render() {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ paddingTop: '20px' }}/>
        <div style={{ position: 'absolute', top: '40%', left: '0', right: '0' }}>
          {this.state.game !== 2 &&
          <Fragment>
            <h2 style={{ marginBottom: '-5px' }}>Space Shooter</h2>
            <br/>
            <div className="animate-flicker">
              Press Space to Play
            </div>
            <br/>
            <div style={{ margin: 'auto' }}>
              <span className="link" onClick={this.toggleHighScores}>
                Leaderboard
              </span>
            </div>
          </Fragment>
          }
        </div>
        <canvas id="canvas" className="border" ref={this.canvasRef} width={this.state.width}
                height={this.state.height}/>
        {this.state.scoreModal &&
        <LeaderboardModal toggleHighScores={this.toggleHighScores} leaderboard={this.state.leaderboard}
                          loading={this.state.leaderboardLoading}/>
        }
        {this.state.gameOverModal &&
        <GameOverModal toggleGameOver={this.toggleGameOver} score={this.state.score} threshold={threshold}
                       loading={this.state.gameOverLoading} dname={this.state.dname} error={this.state.error}
                       onChange={this.onChange} helperText={this.state.helperText} game_id={1}
                       submitScore={this.submitScore}/>
        }
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
      </div>
    );
  }

  onNewGame() {
    this.setState({
      game: 2,
      interval: setInterval(this.update, 10),
      x: (this.state.width - sp) / 2,
      y: this.state.height - sp * 2,
      hp: maxhp,
      level: 1,
      dmg: 1,
      movingLeft: false,
      movingRight: false,
      movingUp: false,
      movingDown: false,
      firing: false,
      bullets: [],
      enemyBullets: [],
      enemyBulletFreq: 100,
      bulletVel: 8,
      powerups: [],
      powerupVel: 1,
      enemies: [],
      enemyProb: 0.2,
      enemyVel: 1,
      enemyDamage: 20,
      asteroidSpawnRate: 100,
      frameCount: 0,
      bulletRefresh: 10,
      starRefresh: 200,
      prob: 0,
      score: 0,
      asteroidHP: 10,
      enemyHP: 6,
    });
  }

  onGameOver() {
    clearInterval(this.state.interval);
    this.setState({
      game: 0,
    });
    this.toggleGameOver(this.state.score, threshold);
  }

  createEnemy() {
    const x = Math.random() * (this.state.width - 80) + 40;
    const y = -sp;
    const vel = this.state.enemyVel + (Math.random() * 0.2 - 0.1);
    const hp = this.state.enemyHP;
    const damaged = false;
    this.state.enemies.push([x, y, vel, hp, damaged, 1]);
  }

  createAsteroid() {
    const size = sp / 8;
    const x = Math.random() * (this.state.width - sp) + sp / 2;
    const y = -10;
    const pointList = []
    const rotation = 0;
    const vel = this.state.enemyVel + (Math.random() * 0.2 - 0.1);
    const hp = this.state.asteroidHP;
    const damaged = false;

    let xrand;
    let yrand;

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand, yrand + 3 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand - size, yrand + 2 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand - 2 * size, yrand + 2 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand - 3 * size, yrand + size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand - 4 * size, yrand]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand - size, yrand - 3 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand + 2 * size, yrand - 4 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand + 2 * size, yrand - 3 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand + 4 * size, yrand - 2 * size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand + 4 * size, yrand + size]);

    xrand = Math.round(Math.random() * size - size / 2);
    yrand = Math.round(Math.random() * size - size / 2);
    pointList.push([xrand + 3 * size, yrand + 2 * size]);

    this.state.enemies.push([x, y, vel, hp, damaged, 0, pointList, rotation]);
  }

  update() {
    /* Input Handler */
    if (this.state.movingLeft && this.state.x - vel >= 0) { /* left */
      this.setState({
        x: this.state.x - vel
      })
    }
    if (this.state.movingRight && this.state.x + vel + sp < this.state.width) { /* right */
      this.setState({
        x: this.state.x + vel
      })
    }
    if (this.state.movingUp && this.state.y - vel >= 0) { /* up */
      this.setState({
        y: this.state.y - vel
      })
    }
    if (this.state.movingDown && this.state.y + vel + sp < this.state.height) { /* down */
      this.setState({
        y: this.state.y + vel
      })
    }

    /* Bullet Controller */
    this.state.bullets.forEach(bullet => {
      bullet[1] -= this.state.bulletVel;
    });
    this.setState({
      bullets: this.state.bullets.filter(bullet => {
        let intersecting = false;
        this.state.enemies.forEach(enemy => {
          let rect = enemy[5] === 1 ? [enemy[0], enemy[1], sp, sp] : [enemy[0] - sp / 2, enemy[1] - sp / 2, sp, sp]
          if (this.intersect([bullet[0], bullet[1] + 5, bulletDim[0], bulletDim[1] / 2], rect)) {
            enemy[3] -= this.state.dmg;
            enemy[4] = true;
            intersecting = true;
          }
        });
        return !intersecting && (bullet[1] > -bulletDim[1]);
      })
    });

    this.state.enemyBullets.forEach(bullet => {
      bullet[1] += this.state.bulletVel;
    });
    this.setState({
      enemyBullets: this.state.enemyBullets.filter(bullet => {
        let intersecting = false;
        if (this.intersect([bullet[0], bullet[1] + 7, bulletDim[0], bulletDim[1] / 2], [this.state.x, this.state.y, sp, sp])) {
          this.setState({
            hp: this.state.hp - enemyBulletDamage
          })
          intersecting = true;
          explosionSound.play();
        }
        return !intersecting && (bullet[1] < this.state.height);
      })
    });

    /* Enemy Controller */
    this.state.enemies.forEach(enemy => {
      enemy[1] += enemy[2];
      let rect;
      if (enemy[5] === 1) {
        rect = [enemy[0], enemy[1], sp, sp]
        if (this.state.frameCount % (this.state.enemyBulletFreq + Math.round(enemy[2] * 10)) === 0) {
          this.state.enemyBullets.push([enemy[0] + sp / 2 - 1, enemy[1] + sp - 5]);
          bulletSound.play(0.1);
        }
      } else {
        rect = [enemy[0] - sp / 2, enemy[1] - sp / 2, sp, sp]
        enemy[7] += enemy[2] / 100;
      }
      if (this.intersect(rect, [this.state.x, this.state.y, sp, sp])) {
        enemy[3] -= weight;
        this.setState({
          hp: this.state.hp - this.state.enemyDamage
        })
      }
    });
    this.setState({
      enemies: this.state.enemies.filter(enemy => {
        let offset = enemy[5] === 1 ? sp / 2 : 0
        if (enemy[3] <= 0) {
          this.setState({
            score: this.state.score + (enemy[5] === 1 ? enemyScore : asteroidScore)
          })
          explosionSound.play();
          if (Math.random() < 0.5 || enemy[5] === 1) {
            if (Math.random() > (1 - probsUp[this.state.prob])) {
              this.state.powerups.push([enemy[0] + offset, enemy[1] + offset, 1]);
              if (this.state.prob < 2) {
                this.setState({
                  prob: this.state.prob + 1
                })
              }
            }
          } else {
            if (Math.random() > (1 - probHp)) {
              this.state.powerups.push([enemy[0] + offset, enemy[1] + offset, 0]);
            }
          }
          return false;
        }
        return enemy[1] < this.state.height;
      })
    });

    /* Powerup Controller */
    this.state.powerups.forEach(powerup => {
      powerup[1] += this.state.powerupVel;
    });
    const initialPowerups = this.state.powerups;
    const powerups = this.partition(initialPowerups, powerup => this.intersect([powerup[0], powerup[1], powerupDim, powerupDim], [this.state.x, this.state.y + 5, sp, sp]));
    powerups[0].forEach(powerup => {
      if (powerup[2] === 1) {
        this.setState({
          level: this.state.level + 1
        });
      } else {
        this.setState({
          hp: Math.min(this.state.hp + hpUp, maxhp)
        });
      }
      powerupSound.play();
    })
    this.setState({
      powerups: powerups[1].filter(powerup => powerup[1] < this.state.height)
    })

    this.state.stars.forEach(star => {
      star[1] = (star[1] + star[4]) % this.state.height;
    });

    /* Spawners */
    if (this.state.frameCount % this.state.bulletRefresh === 0) {
      if (this.state.firing) {
        switch (this.state.level) {
          case 1:
            this.state.bullets.push([this.state.x + sp / 2 - 1, this.state.y - 5]);
            break;
          case 2:
            this.state.bullets.push([this.state.x + sp * 0.4, this.state.y - 5]);
            this.state.bullets.push([this.state.x + sp * 0.6 - 2, this.state.y - 5]);
            break;
          case 3:
            this.state.bullets.push([this.state.x + sp * 0.35, this.state.y - 5]);
            this.state.bullets.push([this.state.x + sp / 2 - 1, this.state.y - 5]);
            this.state.bullets.push([this.state.x + sp * 0.65 - 2, this.state.y - 5]);
            break;
          default:
            this.state.bullets.push([this.state.x + sp * 0.35, this.state.y - 5]);
            this.state.bullets.push([this.state.x + sp / 2 - 1, this.state.y - 5]);
            this.state.bullets.push([this.state.x + sp * 0.65 - 2, this.state.y - 5]);
            break;
        }
        bulletSound.play();
      }
    }
    if (this.state.frameCount % this.state.asteroidSpawnRate === 0) {
      if (this.state.score > 2500) {
        this.setState({
          asteroidHP: 14,
          enemyHP: 8,
          enemyProb: 0.3
        });
      }
      if (this.state.score > 5000) {
        this.setState({
          asteroidHP: 14,
          enemyHP: 8,
          enemyProb: 0.3
        });
      }
      if (this.state.score > 10000) {
        this.setState({
          asteroidHP: 15,
          enemyHP: 10,
          enemyProb: 0.4
        });
      }
      if (Math.random() > 1 - this.state.enemyProb && this.state.score > 300) {
        this.createEnemy();
      } else {
        this.createAsteroid();
      }
    }

    if (this.state.hp <= 0) {
      this.onGameOver();
    }

    this.paint();
    this.setState({
      frameCount: this.state.frameCount + 1
    });
  }

  paint() {
    const canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.strokeStyle = "#555555";
    ctx.strokeStyle = "#8e8d8d";
    this.state.stars.forEach(star => {
      ctx.beginPath();
      ctx.moveTo(star[0], star[1]);
      ctx.lineTo(star[0] + star[2], star[1] + star[3]);
      ctx.moveTo(star[0] + star[2], star[1]);
      ctx.lineTo(star[0], star[1] + star[3]);
      ctx.stroke();
    });

    if (this.state.game !== 2) {
      return;
    }

    this.state.powerups.forEach(powerup => {
      const x = powerup[0];
      const y = powerup[1];
      const sq = powerupDim;
      const type = powerup[2];
      if (type === 0) {
        ctx.fillStyle = "#28A943";
      } else {
        ctx.fillStyle = "#AA288C";
      }
      const n = (this.state.frameCount / spinRate);
      const pad = 2 * Math.abs(n - Math.floor(n + 0.5)) * (spinPad[1] - spinPad[0]) + spinPad[0];
      ctx.beginPath();
      ctx.moveTo(x + pad, y + sq / 2);
      ctx.lineTo(x + sq / 2, y);
      ctx.lineTo(x + sq - pad, y + sq / 2);
      ctx.lineTo(x + sq / 2, y + sq);
      ctx.fill();
    });

    ctx.fillStyle = "#dc3545";
    ctx.strokeStyle = "#dc3545";
    this.state.bullets.forEach(bullet => {
      ctx.fillRect(bullet[0], bullet[1], bulletDim[0], bulletDim[1]);
      ctx.strokeRect(bullet[0], bullet[1], bulletDim[0], bulletDim[1]);
    });

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#4c4c4c";
    this.state.enemyBullets.forEach(bullet => {
      ctx.fillRect(bullet[0], bullet[1], bulletDim[0], bulletDim[1]);
      ctx.strokeRect(bullet[0], bullet[1], bulletDim[0], bulletDim[1]);
    });

    this.state.enemies.forEach(enemy => {
      if (enemy[5] === 1) {
        this.drawEnemy(ctx, enemy);
      } else {
        this.drawAsteroid(ctx, enemy);
      }
    })

    this.drawSpaceShip(ctx);

    ctx.fillStyle = "#28A943";
    ctx.fillRect(0, 0, this.state.width * this.state.hp / maxhp, 2);
    ctx.fillStyle = "black";
    ctx.font = "10pt Montserrat";
    ctx.fillText('Score: ' + this.state.score, 5, 20);
  }

  drawSpaceShip(ctx) {
    ctx.fillStyle = "#007BFF";
    ctx.strokeStyle = "#007BFF";

    const x = this.state.x;
    const y = this.state.y;

    ctx.beginPath();
    ctx.moveTo(x, y + sp);
    ctx.lineTo(x + sp / 2, y + sp * 0.3);
    ctx.lineTo(x + sp, y + sp);
    ctx.stroke();
    ctx.fill();

    // [x centre relative, w], [y top relative, y bottom relative]
    const spikes = [
      [[0.5, 1], [0, 1]],
      [[0.5, 3], [0.2, 0.4]],
      [[0.35, 1], [0.2, 0.4]],
      [[0.65, 1], [0.2, 0.4]],
      [[0.5, 5], [1, 1.1]]
    ];
    spikes.forEach(spike => {
      ctx.fillRect(x + sp * spike[0][0] - spike[0][1] / 2, y + sp * spike[1][0], spike[0][1], sp * (spike[1][1] - spike[1][0]));
      ctx.strokeRect(x + sp * spike[0][0] - spike[0][1] / 2, y + sp * spike[1][0], spike[0][1], sp * (spike[1][1] - spike[1][0]));
    })

    // Read vertically
    const xlevels = [0.25, 0.125, 0];
    const ylevels = [0.4, 0.5, 0.6];
    const widths = [0.5, 0.75, 1];
    const heights = [0.3, 0.3, 0.4];

    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + sp * xlevels[i], y + sp * ylevels[i], sp * widths[i], sp * heights[i]);
      ctx.strokeRect(x + sp * xlevels[i], y + sp * ylevels[i], sp * widths[i], sp * heights[i]);
    }

    ctx.fillRect(x, y + sp, 2, 2);
    ctx.strokeRect(x, y + sp, 2, 2);
    ctx.fillRect(x + sp - 2, y + sp, 2, 2);
    ctx.strokeRect(x + sp - 2, y + sp, 2, 2);
  }

  drawEnemy(ctx, enemy) {
    const x = enemy[0];
    const y = enemy[1];
    const damaged = enemy[4];

    ctx.fillStyle = "#dc3545";
    ctx.strokeStyle = "#dc3545";
    if (damaged) {
      ctx.fillStyle = "#e55e6c";
      ctx.strokeStyle = "#e55e6c";
      enemy[4] = false;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + sp / 2, y + sp * 0.7);
    ctx.lineTo(x + sp, y);
    ctx.stroke();
    ctx.fill();

    // [x centre relative, w], [y top relative, y bottom relative]
    const spikes = [
      [[0.5, 1], [0, 1]],
      [[0.5, 3], [0.6, 0.8]],
      [[0.35, 1], [0.6, 0.8]],
      [[0.65, 1], [0.6, 0.8]],
      [[0.5, 5], [-0.1, 0]]
    ];
    spikes.forEach(spike => {
      ctx.fillRect(x + sp * spike[0][0] - spike[0][1] / 2, y + sp * spike[1][0], spike[0][1], sp * (spike[1][1] - spike[1][0]));
      ctx.strokeRect(x + sp * spike[0][0] - spike[0][1] / 2, y + sp * spike[1][0], spike[0][1], sp * (spike[1][1] - spike[1][0]));
    })

    // Read vertically
    const xlevels = [0.25, 0.125, 0];
    const ylevels = [0.3, 0.2, 0];
    const widths = [0.5, 0.75, 1];
    const heights = [0.3, 0.3, 0.4];

    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x + sp * xlevels[i], y + sp * ylevels[i], sp * widths[i], sp * heights[i]);
      ctx.strokeRect(x + sp * xlevels[i], y + sp * ylevels[i], sp * widths[i], sp * heights[i]);
    }

    ctx.fillRect(x, y - 2, 2, 2);
    ctx.strokeRect(x, y - 2, 2, 2);
    ctx.fillRect(x + sp - 2, y - 2, 2, 2);
    ctx.strokeRect(x + sp - 2, y - 2, 2, 2);
  }

  drawAsteroid(ctx, asteroid) {
    const x = asteroid[0];
    const y = asteroid[1];
    const damaged = asteroid[4];
    const pointList = asteroid[6];
    const rotation = asteroid[7];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.fillStyle = "#555555";
    if (damaged) {
      ctx.fillStyle = "#806262";
      asteroid[4] = false;
    }

    ctx.moveTo(pointList[pointList.length - 1][0], pointList[pointList.length - 1][1]);

    for (let i = 0; i < pointList.length; i++) {
      ctx.lineTo(pointList[i][0], pointList[i][1]);
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  intersect(v1, v2) {
    const r1 = { x: v1[0], y: v1[1], w: v1[2], h: v1[3] };
    const r2 = { x: v2[0], y: v2[1], w: v2[2], h: v2[3] };
    return !(r2.x > r1.x + r1.w || r2.x + r2.w < r1.x || r2.y > r1.y + r1.h || r2.y + r2.h < r1.y);
  }

  partition(arr, filter) {
    let fail = [];

    let pass = arr.filter((e, i, a) => {
      if (filter(e, i, a)) {
        return true;
      }
      fail.push(e);
      return false;
    });

    return [pass, fail];
  }

  onKeyDown = (e) => {
    e = e || window["event"];
    if (e.keyCode === 32) {
      if (this.state.game === 2) {
        this.setState({
          firing: true
        });
      } else if (this.state.game === 1 && !this.state.gameOverModal) {
        this.onNewGame();
      }
    }
    if (e.keyCode === 37) { /* left */
      this.setState({
        movingLeft: true
      })
    }
    if (e.keyCode === 39) { /* right */
      this.setState({
        movingRight: true
      })
    }
    if (e.keyCode === 38) { /* up */
      this.setState({
        movingUp: true
      })
    }
    if (e.keyCode === 40) { /* down */
      this.setState({
        movingDown: true
      })
    }
  };

  onKeyUp = (e) => {
    e = e || window["event"];
    if (e.keyCode === 32) {
      this.setState({
        firing: false
      });
    }
    if (e.keyCode === 37) { /* left */
      this.setState({
        movingLeft: false
      })
    }
    if (e.keyCode === 39) { /* right */
      this.setState({
        movingRight: false
      })
    }
    if (e.keyCode === 38) { /* up */
      this.setState({
        movingUp: false
      })
    }
    if (e.keyCode === 40) { /* down */
      this.setState({
        movingDown: false
      })
    }
  };
}

export default Spaceshooter;