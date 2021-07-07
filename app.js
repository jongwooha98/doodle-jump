document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');

  let doodlerLeftSpace = 5;
  let startPoint = 15;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'rem';
    doodler.style.bottom = doodlerBottomSpace + 'rem';
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 31.5;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'rem';
      visual.style.bottom = this.bottom + 'rem';
      grid.appendChild(visual);
    }
  }
  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 60 / platformCount;
      let newPlatformBottom = 10 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
      console.log(platforms);
    }
  }
  function movePlatforms() {
    if (doodlerBottomSpace > 20) {
      platforms.forEach((platform) => {
        platform.bottom -= 0.4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'rem';

        if (platform.bottom < 1) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          let newPlatform = new Platform(60);
          platforms.push(newPlatform);
        }
      });
    }
  }
  function jump() {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 2;
      doodler.style.bottom = doodlerBottomSpace + 'rem';
      console.log(doodler);
      if (doodlerBottomSpace > startPoint + 20) {
        fall();
      }
    }, 30);
  }
  function fall() {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 0.5;
      doodler.style.bottom = doodlerBottomSpace + 'rem';
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 1.5 &&
          doodlerLeftSpace + 6 >= platform.left &&
          doodlerLeftSpace <= platform.left + 8.5 &&
          !isJumping
        ) {
          console.log('landed');
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function gameOver() {
    console.log('GAMEOVER');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  function control(e) {
    if (e.key == 'ArrowLeft') {
      moveLeft();
    }
    if (e.key == 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
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
        console.log('going left');
        doodlerLeftSpace -= 0.5;
        doodler.style.left = doodlerLeftSpace + 'rem';
      } else moveRight();
    }, 30);
  }
  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= 36) {
        console.log('going right');

        doodlerLeftSpace += 0.5;
        doodler.style.left = doodlerLeftSpace + 'rem';
      }
    }, 30);
  }
  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }
  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
    }
  }

  // attact button to start
  start();
});
