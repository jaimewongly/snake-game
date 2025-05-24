export function drawGame(ctx, gridSize, snake, food, score, highScore) {
  drawSnake(ctx, snake, gridSize);
  drawFood(ctx, food, gridSize);
  drawScore(ctx, score, highScore);
}

function drawScore(ctx, score, highScore) {
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);
}

function drawFood(ctx, food, gridSize) {
  ctx.fillStyle = "#ffb4a2";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function drawSnake(ctx, snake, gridSize) {
  ctx.fillStyle = "#6a4c93";
  for (let part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }
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
      ctx.fillStyle = "#ffffff";
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
  }
}

export function eatFood(nextHead, snake, food, score, highScore, tileCount) {
  if (nextHead.x === food.x && nextHead.y === food.y) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    generateNextFood(tileCount, snake, food);
  } else {
    snake.pop();
  }
}

export function willCrash(nextHead, snake, tileCount) {
  return (
    willCrashIntoWall(nextHead, tileCount) || willCrashIntoSelf(nextHead, snake)
  );
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
