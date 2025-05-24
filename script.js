// TODO

// to run:
//  python -m http.server

// Sound effects
// crash, eat, game over, start, high score

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

let scoreBoard = {
  score: 0,
  highScore: localStorage.getItem("highScore") || 0,
};
let gameInterval;
let speed = 100;
let snake = [
  { x: 9, y: 9 },
  { x: 8, y: 9 },
  { x: 7, y: 9 },
];
let velocity = { x: 1, y: 0 };
let lastVelocity = { x: 1, y: 0 };
let food = { x: 15, y: 10 };

setupTouchControls(canvas, velocity, lastVelocity);
setupKeyboardControls(velocity, lastVelocity);

function startGame() {
  scoreBoard.score = 0;
  snake = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ];
  velocity.x = 1;
  velocity.y = 0;
  lastVelocity.x = velocity.x;
  lastVelocity.y = velocity.y;
  generateNextFood(tileCount, snake, food);
  clearInterval(gameInterval);
  gameInterval = setInterval(play, speed);
}

function gameOver() {
  clearInterval(gameInterval);
  const deadSnake = [...snake];
  drawGame(ctx, gridSize, velocity, deadSnake, food, scoreBoard);
  drawGhostSnake(ctx, gridSize, deadSnake, 100).then(() => {
    startGame();
  });
}

function play() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const newHead = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y,
  };
  if (willCrash(newHead, snake, tileCount)) {
    gameOver();
    return;
  }
  snake.unshift(newHead);
  eatFood(newHead, snake, food, scoreBoard, tileCount);
  drawGame(ctx, gridSize, velocity, snake, food, scoreBoard);
  lastVelocity.x = velocity.x;
  lastVelocity.y = velocity.y;
}

startGame();
