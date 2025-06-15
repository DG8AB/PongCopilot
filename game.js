const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PADDLE_MARGIN = 15;
const PLAYER_Y_SPEED = 7; // Not used (mouse controls)
const AI_SPEED = 4;
const FPS = 60;

// Paddle positions
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

// Ball properties
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() * 2 - 1);

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp to canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle net
    ctx.fillStyle = "#fff";
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.fillRect(canvas.width / 2 - 1, y, 2, 18);
    }

    // Paddles
    ctx.fillStyle = "#fff";
    // Left paddle (player)
    ctx.fillRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    // Right paddle (AI)
    ctx.fillRect(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Score
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width / 2 - 50, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 50, 50);
}

// Update game logic
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
    }

    // Paddle collision (player)
    if (
        ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY + BALL_SIZE >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where it hits the paddle
        let impact = ((ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += impact * 2;
        ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where it hits the paddle
        let impact = ((ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        ballSpeedY += impact * 2;
        ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement: follow the ball with some smoothing
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= AI_SPEED;
    }
    // Clamp to canvas
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > canvas.height) aiY = canvas.height - PADDLE_HEIGHT;
}

// Reset ball position and direction
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() * 2 - 1);
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();
