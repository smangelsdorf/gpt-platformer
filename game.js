// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gravity = 0.5;
const platforms = [
  { x: 0, y: canvas.height * (3 / 4), width: canvas.width, height: 10 },
  { x: 0, y: canvas.height * (2 / 4), width: canvas.width, height: 10 },
  { x: 0, y: canvas.height * (1 / 4), width: canvas.width, height: 10 },
];

const player = {
  x: 50,
  y: platforms[0].y - 30,
  width: 30,
  height: 30,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
  jumpHeight: -15,
};

const obstacles = [
  { x: canvas.width, y: platforms[0].y - 10, radius: 10, velocityX: -2 },
];

// Key events
const keys = {};
document.addEventListener('keydown', (e) => (keys[e.code] = true));
document.addEventListener('keyup', (e) => (keys[e.code] = false));

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Player movement
  if (keys['ArrowLeft']) {
    player.velocityX = -5;
  } else if (keys['ArrowRight']) {
    player.velocityX = 5;
  } else {
    player.velocityX = 0;
  }

  // Player jump
  if (keys['Space'] && player.onGround) {
    player.velocityY = player.jumpHeight;
    player.onGround = false;
  }

  // Apply gravity
  player.velocityY += gravity;

  // Update player position
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Collision detection with platforms
  player.onGround = false;
  for (let platform of platforms) {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y + player.height < platform.y + platform.height + player.velocityY
    ) {
      player.velocityY = 0;
      player.onGround = true;
      player.y = platform.y - player.height;
    }
  }

  // Obstacle movement
  for (let obstacle of obstacles) {
    obstacle.x += obstacle.velocityX;

    // Spawn new obstacles
    if (obstacle.x + obstacle.radius < 0) {
      obstacle.x = canvas.width;
    }
  }

  // Collision detection with obstacles
  for (let obstacle of obstacles) {
    if (
      player.x < obstacle.x + obstacle.radius &&
      player.x + player.width > obstacle.x - obstacle.radius &&
      player.y + player.height > obstacle.y - obstacle.radius &&
      player.y < obstacle.y + obstacle.radius
    ) {
      // Reset player position
      player.x = 50;
      player.y = platforms[0].y - player.height;
    }
  }
}

// Render game
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  ctx.fillStyle = 'white';
  for (let platform of platforms) {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }

  // Draw player
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  ctx.fillStyle = 'red';
  for (let obstacle of obstacles) {
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Start the game
gameLoop();

