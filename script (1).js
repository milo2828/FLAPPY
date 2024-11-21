// script.js

// Get the canvas element and set its context for 2D rendering
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = 320;
canvas.height = 480;

// Game variables
let bird;
let pipes = [];
let gravity = 0.6;
let birdLift = -15;
let pipeWidth = 50;
let pipeGap = 120;
let pipeSpeed = 2;
let gameOver = false;
let score = 0;

// Bird object
bird = {
    x: 50,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    velocity: 0,
    jump: function () {
        this.velocity = birdLift;
    },
    update: function () {
        this.velocity += gravity;
        this.y += this.velocity;

        // Prevent the bird from going off the canvas
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) {
            gameOver = true;
        }
    },
    draw: function () {
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
};

// Pipe object
function Pipe(x, y) {
    this.x = x;
    this.y = y;
    this.width = pipeWidth;
    this.height = Math.floor(Math.random() * (canvas.height - pipeGap));
}

// Update and draw pipes
function updatePipes() {
    if (gameOver) return;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push(new Pipe(canvas.width, pipeHeight));
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Remove pipes that go off-screen
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            score++;
        }

        // Draw pipes
        ctx.fillStyle = '#228B22';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.height); // Top pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipe.width, canvas.height); // Bottom pipe

        // Check for collisions
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipe.width &&
            (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap)
        ) {
            gameOver = true;
        }
    });
}

// Game Loop
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', 80, canvas.height / 2 - 20);
        ctx.fillText('Score: ' + score, 120, canvas.height / 2 + 20);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw everything
    bird.update();
    bird.draw();

    updatePipes();

    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Repeat the game loop
    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        bird.jump();
    }
});

// Start the game loop
gameLoop();
