document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const gridHeight = document.querySelector('.grid').offsetHeight;
  const doodler = document.createElement('div');
  const gameover = document.querySelector('.gameover');
  const scoreDisplay = document.querySelector('.score');

  document.getElementById('play-again').addEventListener('click', start);

  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = gridHeight / 120;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;
  let isTouched = false;

  // create platforms
  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');
      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);
    }
  }
  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = gridHeight / platformCount;
      let newPlatformBottom = 100 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
      console.log(platforms);
    }
  }
  // create doodler
  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }
  // move platforms
  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';
        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }
  // doodler actions
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      // console.log(doodler);
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  }
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          // console.log('landed');
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }
  // doodler movements
  function control(e) {
    if (e.key == 'ArrowLeft') {
      moveLeft();
    }
    if (e.key == 'ArrowRight') {
      moveRight();
    }
    if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }
  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        console.log('going left' + doodlerLeftSpace);
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else {
        doodlerLeftSpace = 360;
        doodler.style.left = doodlerLeftSpace + 'px';
      }
    }, 30);
  }
  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 360) {
        console.log('going right' + doodlerLeftSpace);
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + 'px';
      } else {
        doodlerLeftSpace = 0;
        doodler.style.left = doodlerLeftSpace + 'px';
      }
    }, 30);
  }
  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }
  // game operations
  function start() {
    gameover.style.display = 'none';
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump(startPoint);
      document.addEventListener('keydown', control);
      document.addEventListener('touchstart', function () {
        isTouched
          ? (moveRight(), (isTouched = !isTouched))
          : (moveLeft(), (isTouched = !isTouched));
      });
    }
  }
  function gameOver() {
    console.log('GAMEOVER');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.appendChild(gameover);
    gameover.style.display = 'flex';
    scoreDisplay.innerHTML = 'Game Over!';
    scoreDisplay.innerHTML = 'Score: ' + score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    document.removeEventListener('keyup', control);
  }
  // attact button to start
  start();
});
