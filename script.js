const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const speedSelect = document.getElementById('speedSelect');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const boxSize = 20; // Size of each box
let snake = [{ x: 2 * boxSize, y: 2 * boxSize }]; // Initial snake position
let food = {};
let score = 0;
let direction = { x: 1, y: 0 }; // Initial direction (right)
let gameInterval;
let speed = 100; // Default speed (medium)

// Create initial food
function createFood() {
    food = {
        x: Math.floor(Math.random() * (gameArea.clientWidth / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (gameArea.clientHeight / boxSize)) * boxSize
    };
}

// Draw snake and food
function draw() {
    gameArea.innerHTML = ''; // Clear the game area

    // Draw snake
    snake.forEach(segment => {
        const snakeSegment = document.createElement('div');
        snakeSegment.style.width = boxSize + 'px';
        snakeSegment.style.height = boxSize + 'px';
        snakeSegment.style.left = segment.x + 'px';
        snakeSegment.style.top = segment.y + 'px';
        snakeSegment.classList.add('snake');
        gameArea.appendChild(snakeSegment);
    });

    // Draw food
    const foodElement = document.createElement('div');
    foodElement.style.width = boxSize + 'px';
    foodElement.style.height = boxSize + 'px';
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    gameArea.appendChild(foodElement);
}

// Update snake position and check collisions
function update() {
    const head = { x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize };

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        createFood();
    } else {
        snake.pop(); // Remove the last segment if not eating food
    }

    // Check for wall collisions
    if (
        head.x < 0 || 
        head.x >= gameArea.clientWidth || 
        head.y < 0 || 
        head.y >= gameArea.clientHeight || 
        collisionWithSelf(head)
    ) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
        return;
    }

    snake.unshift(head); // Add new head
    draw();
}

// Check for collision with the snake itself
function collisionWithSelf(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// Handle direction change
function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

// Start the game
function startGame() {
    snake = [{ x: 2 * boxSize, y: 2 * boxSize }];
    direction = { x: 1, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    createFood();
    draw();
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed);
}

// Restart the game
function restartGame() {
    clearInterval(gameInterval);
    startGame();
}

// Set game speed
speedSelect.addEventListener('change', () => {
    speed = parseInt(speedSelect.value);
});

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
document.addEventListener('keydown', changeDirection);

// Initial draw
draw();
