const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let snake = [];
let dx = gridSize, dy = 0;
let food;
let score = 0;
let lastFrameTime = 0;
let speed = 100;
let gameStarted = false;
let isPaused = false;

document.addEventListener("keydown", handleKey);

function handleKey(e) {
  if (!gameStarted) return;
  if (e.key === " ") {
    togglePause();
  } else if (e.key === "ArrowUp" && dy === 0) {
    setDirection('up');
  } else if (e.key === "ArrowDown" && dy === 0) {
    setDirection('down');
  } else if (e.key === "ArrowLeft" && dx === 0) {
    setDirection('left');
  } else if (e.key === "ArrowRight" && dx === 0) {
    setDirection('right');
  }
}

function setDirection(dir) {
  if (dir === "up" && dy === 0) {
    dx = 0; dy = -gridSize;
  } else if (dir === "down" && dy === 0) {
    dx = 0; dy = gridSize;
  } else if (dir === "left" && dx === 0) {
    dx = -gridSize; dy = 0;
  } else if (dir === "right" && dx === 0) {
    dx = gridSize; dy = 0;
  }
}

function startGame() {
  snake = [{ x: 160, y: 160 }];
  dx = gridSize;
  dy = 0;
  food = randomPosition();
  score = 0;
  speed = +document.getElementById("difficulty").value;
  document.getElementById("score").textContent = score;
  document.getElementById("overlay").style.display = "none";
  gameStarted = true;
  isPaused = false;
  lastFrameTime = 0;
  requestAnimationFrame(gameLoop);
}

function togglePause() {
  isPaused = !isPaused;
}

function gameLoop(timestamp) {
  if (!gameStarted) return;
  if (isPaused) return requestAnimationFrame(gameLoop);

  if (timestamp - lastFrameTime >= speed) {
    update();
    lastFrameTime = timestamp;
  }

  requestAnimationFrame(gameLoop);
}

function update() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    return gameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomPosition();
    score++;
    document.getElementById("score").textContent = score;
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gambar kepala ular
  if (snake.length > 0) {
    ctx.fillStyle = "#00aaff"; // Warna kepala
    ctx.fillRect(snake[0].x, snake[0].y, gridSize, gridSize);
  }

  // Gambar tubuh
  ctx.fillStyle = "#00ffcc";
  for (let i = 1; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
  }

  // Gambar makanan
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function randomPosition() {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y };
}

function gameOver() {
  gameStarted = false;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("overlay").style.display = "flex";
}

function hideOverlay() {
  document.getElementById("overlay").style.display = "none";
}
