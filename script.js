// TODO

// Save high score in local storage

// Styling- custom sprite styles

// Sound effects
// crash, eat, game over, start, high score

// optimize layout for mobile

// themes (garden, space, ocean, etc.)

// make repo and add to portfolio

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // pixels
const tileCount = canvas.width / gridSize;

let gameInterval;
let speed = 100;

let velocity = { x: 1, y: 0 }; // moving right initially
let lastVelocity = { x: 1, y: 0 };

let snake = [
  { x: 9, y: 9 },
  { x: 8, y: 9 },
  { x: 7, y: 9 },
];

let food = { x: 15, y: 10 };

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0 && lastVelocity.x === 0) {
      velocity = { x: 1, y: 0 };
    } else if (dx < 0 && lastVelocity.x === 0) {
      velocity = { x: -1, y: 0 };
    }
  } else {
    // Vertical swipe
    if (dy > 0 && lastVelocity.y === 0) {
      velocity = { x: 0, y: 1 };
    } else if (dy < 0 && lastVelocity.y === 0) {
      velocity = { x: 0, y: -1 };
    }
  }
});

document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key === "ArrowUp" && lastVelocity.y == 0) {
    velocity = { x: 0, y: -1 };
  } else if (key === "ArrowDown" && lastVelocity.y == 0) {
    velocity = { x: 0, y: 1 };
  } else if (key === "ArrowLeft" && lastVelocity.x == 0) {
    velocity = { x: -1, y: 0 };
  } else if (key === "ArrowRight" && lastVelocity.x == 0) {
    velocity = { x: 1, y: 0 };
  }
});

function generateNextFood() {
  newX = Math.floor(Math.random() * tileCount);
  newY = Math.floor(Math.random() * tileCount);

  // Check if the new food position is on the snake
  for (let part of snake) {
    if (part.x === newX && part.y === newY) {
      return generateNextFood(); // Recursively find a new position
    }
    food.x = newX;
    food.y = newY;
  }
}

function startGame() {
  // Optional: reset
  snake = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ];
  velocity = { x: 1, y: 0 };
  lastVelocity = velocity;
  generateNextFood();
  clearInterval(gameInterval); // stop any previous game loops!
  gameInterval = setInterval(drawGame, speed); // start fresh
}

function showGhostSnake(deadSnake) {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  let index = 0;
  const delay = 100; // ms between each segment "ghosting"

  const ghostInterval = setInterval(() => {
    if (index >= deadSnake.length) {
      clearInterval(ghostInterval);
      startGame(); // Restart after animation
      return;
    }

    const part = deadSnake[index];
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);

    index++;
  }, delay);
}

function gameOver() {
  clearInterval(gameInterval);
  //   alert("Game over! Slippy is full... forever.");
  const deadSnake = [...snake]; // Save copy before

  ctx.fillStyle = "#6a4c93";
  for (let part of deadSnake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }

  ctx.fillStyle = "#ffb4a2";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  showGhostSnake(deadSnake);
}

function checkCollision() {
  // Check wall collision
  if (
    snake[0].x < 0 ||
    snake[0].x >= tileCount ||
    snake[0].y < 0 ||
    snake[0].y >= tileCount
  ) {
    gameOver();
    return;
  }

  // Check self collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      gameOver();
      return;
    }
  }
}

let lastTail = { x: 0, y: 0 }; // for debugging

function willCrash(nextHead) {
  // Check wall collision
  if (
    nextHead.x < 0 ||
    nextHead.x >= tileCount ||
    nextHead.y < 0 ||
    nextHead.y >= tileCount
  ) {
    return true;
  }

  // Check self collision
  for (let i = 0; i < snake.length; i++) {
    if (nextHead.x === snake[i].x && nextHead.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move snake head
  const newHead = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };

  if (willCrash(newHead)) {
    gameOver(); // Don't move the snake yet!
    return;
  }

  snake.unshift(newHead); // Add new head to the front

  checkCollision();

  // Check if Slippy ate food
  if (newHead.x === food.x && newHead.y === food.y) {
    // Don’t pop the tail = snake grows!
    generateNextFood(); // Generate new food
  } else {
    snake.pop(); // Remove the tail
  }

  // Draw snake
  ctx.fillStyle = "#6a4c93";
  for (let part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }

  // Draw food
  ctx.fillStyle = "#ffb4a2";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  lastVelocity = { ...velocity };
}

startGame(); // Start the game on page load
