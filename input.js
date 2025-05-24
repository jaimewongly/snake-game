let touchStartX = 0;
let touchStartY = 0;

export function setupTouchControls(canvas, velocity, lastVelocity) {
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
      if (dx > 0 && lastVelocity.x === 0) {
        velocity.x = 1;
        velocity.y = 0;
      } else if (dx < 0 && lastVelocity.x === 0) {
        velocity.x = -1;
        velocity.y = 0;
      }
    } else {
      if (dy > 0 && lastVelocity.y === 0) {
        velocity.x = 0;
        velocity.y = 1;
      } else if (dy < 0 && lastVelocity.y === 0) {
        velocity.x = 0;
        velocity.y = -1;
      }
    }
  });
}

export function setupKeyboardControls(velocity, lastVelocity, paused) {
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (key === "ArrowUp" && lastVelocity.y == 0) {
      velocity.x = 0;
      velocity.y = -1;
    } else if (key === "ArrowDown" && lastVelocity.y == 0) {
      velocity.x = 0;
      velocity.y = 1;
    } else if (key === "ArrowLeft" && lastVelocity.x == 0) {
      velocity.x = -1;
      velocity.y = 0;
    } else if (key === "ArrowRight" && lastVelocity.x == 0) {
      velocity.x = 1;
      velocity.y = 0;
    } else if (key === "p" || key === "P") {
      paused.state = !paused.state;
    }
  });
}
