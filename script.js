// TODO

// Styling- custom sprite styles

// Sound effects
// crash, eat, game over, start, high score

// optimize layout for mobile

// themes (garden, space, ocean, etc.)

// make repo and add to portfolio
import { setupTouchControls, setupKeyboardControls } from "./input.js";
import {
  drawGame,
  drawGhostSnake,
  willCrash,
  generateNextFood,
  eatFood,
} from "./game.js";

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
  generateNextFood(tileCount, snake, food); // Generate new food
  clearInterval(gameInterval); // stop any previous game loops!
  gameInterval = setInterval(play, speed); // start fresh
}

function gameOver() {
  clearInterval(gameInterval);
  const deadSnake = [...snake];
  drawGame(ctx, gridSize, deadSnake, food, score, highScore);
  drawGhostSnake(ctx, gridSize, deadSnake, 100).then(() => {
    startGame();
  });
}

function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move snake head
  const newHead = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };

  if (willCrash(newHead, snake, tileCount)) {
    gameOver(); // Don't move the snake yet!
    return;
  }

  snake.unshift(newHead); // Add new head to the front

  if (willCrash(snake[0], snake, tileCount)) {
    gameOver();
  }

  eatFood(newHead, snake, food, score, highScore, tileCount);

  drawGame(ctx, gridSize, snake, food, score, highScore);

  lastVelocity.x = velocity.x;
  lastVelocity.y = velocity.y;
}

startGame(); // Start the game on page load
