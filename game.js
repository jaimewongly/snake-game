const headImageA = new Image();
headImageA.src = "assets/treeckoA.png";
const headImageB = new Image();
headImageB.src = "assets/treeckoB.png";
let toggle = true;
import foods from "./foods.js";
let currentFoodImage = foods[randomInt(foods.length)];
const munch = new Audio("assets/munch.mp3");
const oof = new Audio("assets/oof.mp3");
let newHighScore = false;
const hooray = new Audio("assets/hagrid-hooray.mp3");

export function drawGame(ctx, gridSize, velocity, snake, food, scoreBoard) {
  drawScore(ctx, scoreBoard);
  drawInstructions(ctx);
  drawSnake(ctx, snake, gridSize, velocity);
  drawFood(ctx, food, gridSize);
}

function drawScore(ctx, scoreBoard) {
  ctx.fillStyle = "white";
  ctx.font = "16px Cascadia Mono";
  ctx.fillText(`Score: ${scoreBoard.score}`, 10, 20);
  ctx.fillText(`High Score: ${scoreBoard.highScore}`, 10, 40);
}

function drawInstructions(ctx) {
  ctx.fillStyle = "white";
  ctx.font = "16px Cascadia Mono";
  ctx.fillText("Use arrow keys to move", 10, 60);
  ctx.fillText("Press 'P' to pause", 10, 80);
}

function drawFood(ctx, food, gridSize) {
  if (currentFoodImage.complete) {
    ctx.drawImage(
      currentFoodImage,
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
  } else {
    ctx.fillStyle = "#ffb4a2";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function drawSnake(ctx, snake, gridSize, velocity) {
  snake.forEach((part, index) => {
    if (index === 0) {
      drawSnakeHead(part, gridSize, ctx, velocity);
    } else {
      drawSnakeBody(part, gridSize, ctx);
    }
  });
}

function drawSnakeBody(part, gridSize, ctx) {
  const centerX = part.x * gridSize + gridSize / 2;
  const centerY = part.y * gridSize + gridSize / 2;
  const radius = gridSize / 2 - 4;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#C8D878";
  ctx.fill();
  ctx.strokeStyle = "#141B0E";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSnakeHead(part, gridSize, ctx, velocity) {
  const centerX = part.x * gridSize + gridSize / 2;
  const centerY = part.y * gridSize + gridSize / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(getRotationAngle(velocity));

  const currentImage = toggle ? headImageA : headImageB;
  ctx.drawImage(currentImage, -gridSize / 2, -gridSize / 2, gridSize, gridSize);

  ctx.restore();
  toggle = !toggle;
}

function getRotationAngle(velocity) {
  if (velocity.x === 1) return -Math.PI / 2; // right
  if (velocity.y === 1) return 0; // down
  if (velocity.x === -1) return Math.PI / 2; // left
  if (velocity.y === -1) return -Math.PI; // up
  return 0;
}

export function drawGhostSnake(ctx, gridSize, snake, delay) {
  return new Promise((resolve) => {
    let index = 0;
    const gameInterval = setInterval(() => {
      if (index >= snake.length) {
        clearInterval(gameInterval);
        resolve();
        return;
      }
      const part = snake[index];
      ctx.fillStyle = "#88b868";
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
      index++;
    }, delay);
  });
}

export function generateNextFood(tileCount, snake, food) {
  let newX = Math.floor(Math.random() * tileCount);
  let newY = Math.floor(Math.random() * tileCount);
  for (let part of snake) {
    if (part.x === newX && part.y === newY) {
      return generateNextFood(tileCount, snake, food);
    }
    food.x = newX;
    food.y = newY;
    currentFoodImage = foods[randomInt(foods.length)];
  }
}

export function eatFood(nextHead, snake, food, scoreBoard, tileCount) {
  if (nextHead.x === food.x && nextHead.y === food.y) {
    playEatingSound();
    scoreBoard.score++;
    if (scoreBoard.score > scoreBoard.highScore) {
      newHighScore = true;
      scoreBoard.highScore = scoreBoard.score;
      localStorage.setItem("highScore", scoreBoard.highScore);
    }
    generateNextFood(tileCount, snake, food);
  } else {
    snake.pop();
  }
}

function playEatingSound() {
  if (munch.readyState >= 2) {
    munch.currentTime = 0;
    munch.play();
  }
}

function playHooraySound() {
  if (hooray.readyState >= 2) {
    hooray.currentTime = 0;
    hooray.play();
  }
}

export function willCrash(nextHead, snake, tileCount) {
  let willCrash =
    willCrashIntoWall(nextHead, tileCount) ||
    willCrashIntoSelf(nextHead, snake);
  if (willCrash) {
    playCrashSound();
    if (newHighScore) {
      playHooraySound();
      newHighScore = false;
    }
  }
  return willCrash;
}

function playCrashSound() {
  if (oof.readyState >= 2) {
    oof.currentTime = 0;
    oof.play();
  }
}

function willCrashIntoWall(nextHead, tileCount) {
  return (
    nextHead.x < 0 ||
    nextHead.x >= tileCount ||
    nextHead.y < 0 ||
    nextHead.y >= tileCount
  );
}

function willCrashIntoSelf(nextHead, snake) {
  for (let i = 1; i < snake.length; i++) {
    if (nextHead.x === snake[i].x && nextHead.y === snake[i].y) {
      return true;
    }
  }
  return false;
}
