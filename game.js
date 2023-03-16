// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gravity = 0.5;
const lives = 3;

const platforms = [
  { x: 0, y: canvas.height * (3 / 4), width: canvas.width * (3 / 4), height: 10 },
  { x: canvas.width * (1 / 4), y: canvas.height * (2 / 4), width: canvas.width * (3 / 4), height: 10 },
  { x: 0, y: canvas.height * (1 / 4), width: canvas.width * (3 / 4), height: 10 },
];

const player = {
  x: 50,
  y: platforms[0].y - 30,
  width: 30,
  height: 30,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
  jumpHeight: -14,
  lives: lives,
};

const obstacles = [
  { x: platforms[2].x, y: platforms[2].y - 10, radius: 10, velocityX: 2, velocityY: 0 },
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

  // Check if player falls off the bottom of the game area
  if (player.y + player.height > canvas.height) {
    player.lives -= 1;
    player.x = 50;
    player.y = platforms[0].y - player.height;
  }

  // Collision detection with walls
  if (player.x <= 0) {
    player.x = 0;
  } else if (player.x + player.width >= canvas.width) {
    player.x = canvas.width - player.width;
  }

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
    } else if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y > platform.y - player.height + player.velocityY
    ) {
      player.velocityY = 0;
      player.y = platform.y + platform.height;
    }
  }

  // Obstacle movement
  for (let obstacle of obstacles) {
    obstacle.x += obstacle.velocityX;
    obstacle.y += obstacle.velocityY;

    // Reverse direction when hitting a wall
    if (obstacle.x + obstacle.radius < 0 || obstacle.x - obstacle.radius > canvas.width) {
      obstacle.velocityX = -obstacle.velocityX;
    }

    // Despawn obstacle when leaving the bottom of the game area
    if (obstacle.y - obstacle.radius > canvas.height) {
      obstacles.splice(i, 1);
      continue;
    }

    // Apply gravity to the obstacle
    if (!onPlatform(obstacle)) {
      obstacle.velocityY += gravity;
    } else {
      obstacle.velocityY = 0;
    }

    // Move to the lower platform
    for (let i = 0; i < platforms.length; i++) {
      let platform = platforms[i];
      if (
        obstacle.y + obstacle.radius > platform.y &&
        obstacle.y - obstacle.radius < platform.y + platform.height &&
        obstacle.x + obstacle.radius > platform.x &&
        obstacle.x - obstacle.radius < platform.x + platform.width
      ) {
        obstacle.y = platform.y - obstacle.radius;
        break;
      }
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
      // Decrease lives and reset player position
      player.lives -= 1;
      player.x = 50;
      player.y = platforms[0].y - player.height;
      
      if (player.lives <= 0) {
        // Game over, reset lives and player position
        player.lives = lives;
        player.x = 50;
        player.y = platforms[0].y - player.height;
      }
    }
  }
}

function onPlatform(obstacle) {
  for (let platform of platforms) {
    if (
      obstacle.y + obstacle.radius > platform.y &&
      obstacle.y - obstacle.radius < platform.y + platform.height &&
      obstacle.x + obstacle.radius > platform.x &&
      obstacle.x - obstacle.radius < platform.x + platform.width
    ) {
      return true;
    }
  }
  return false;
}

function spawnObstacle() {
  obstacles.push({ x: platforms[2].x, y: platforms[2].y - 10, radius: 10, velocityX: 2, velocityY: 0 });
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

  // Draw lives
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Lives: ' + player.lives, 10, 30);
}

// Start the game
gameLoop();
setInterval(spawnObstacle, 10000);
