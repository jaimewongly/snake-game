export function drawGame(ctx, gridSize, snake, food, score, highScore) {
  // Draw snake
  ctx.fillStyle = "#6a4c93";
  for (let part of snake) {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  }

  // Draw food
  ctx.fillStyle = "#ffb4a2";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "16px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`High Score: ${highScore}`, 10, 40);
}
