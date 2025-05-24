// TODO

// Styling- custom sprite styles

// Sound effects
// crash, eat, game over, start, high score

// optimize layout for mobile

// themes (garden, space, ocean, etc.)

// make repo and add to portfolio
import { setupTouchControls, setupKeyboardControls } from "./input.js";
import { drawGame } from "./game.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let gameInterval;
let speed = 100;

let velocity = { x: 1, y: 0 };
let lastVelocity = { x: 1, y: 0 };

let snake = [
  { x: 9, y: 9 },
  { x: 8, y: 9 },
  { x: 7, y: 9 },
];

let food = { x: 15, y: 10 };

setupTouchControls(canvas, velocity, lastVelocity);
setupKeyboardControls(velocity, lastVelocity);

function generateNextFood() {
  let newX = Math.floor(Math.random() * tileCount);
  let newY = Math.floor(Math.random() * tileCount);

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
  score = 0;
  snake = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ];
  velocity.x = 1;
  velocity.y = 0;
  lastVelocity.x = velocity.x;
  lastVelocity.y = velocity.y;
  generateNextFood();
  clearInterval(gameInterval); // stop any previous game loops!
  gameInterval = setInterval(play, speed); // start fresh
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

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);

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

function play() {
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
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
    generateNextFood(); // Generate new food
  } else {
    snake.pop(); // Remove the tail
  }

  drawGame(ctx, gridSize, snake, food, score, highScore);

  lastVelocity.x = velocity.x;
  lastVelocity.y = velocity.y;
}

startGame(); // Start the game on page load
