// Scroll Animation Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.3
});

// Observe all elements that need animation
document.querySelectorAll('.hero p, .social-links, .project-card, .cube-container').forEach(element => {
    observer.observe(element);
});

// Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Particle Animation (for all pages with #particles)
if (document.getElementById('particles')) {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    const heroSection = document.querySelector('.hero');
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00e6b8';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    });
}

// Menu Toggle (for all pages)
document.querySelector('.nav-circle').addEventListener('click', () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
});

// Tic-Tac-Toe Demo
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let currentPlayer = 'X';
let gameActive = false;

function createBoard() {
    const tttBoard = document.getElementById('ttt-board');
    tttBoard.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('ttt-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => handleClick(i, j));
            tttBoard.appendChild(cell);
        }
    }
}

function handleClick(row, col) {
    if (!gameActive || board[row][col] !== '') return;

    board[row][col] = currentPlayer;
    updateDisplay();

    if (checkWin()) {
        document.getElementById('status').textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    } else if (checkDraw()) {
        document.getElementById('status').textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'O';
    setTimeout(aiMove, 500); // AI moves after a short delay
}

function aiMove() {
    if (!gameActive) return;

    const bestMove = minimax(board, 'O').move;
    if (bestMove) {
        board[bestMove.row][bestMove.col] = 'O';
        updateDisplay();

        if (checkWin()) {
            document.getElementById('status').textContent = `AI (O) wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            document.getElementById('status').textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = 'X';
        }
    }
}

function minimax(board, player) {
    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') emptyCells.push({ row: i, col: j });
        }
    }

    if (checkWinFor('X')) return { score: -10 };
    if (checkWinFor('O')) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let cell of emptyCells) {
        let move = { row: cell.row, col: cell.col };
        board[cell.row][cell.col] = player;
        let score = player === 'O' ? minimax(board, 'X').score : minimax(board, 'O').score;
        board[cell.row][cell.col] = '';
        move.score = score;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let maxScore = -Infinity;
        for (let move of moves) {
            if (move.score > maxScore) {
                maxScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let minScore = Infinity;
        for (let move of moves) {
            if (move.score < minScore) {
                minScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove ? { move: bestMove, score: bestMove.score } : { score: 0 };
}

function checkWin() {
    return checkWinFor(currentPlayer);
}

function checkWinFor(player) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) return true;
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) return true;
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
    return false;
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== ''));
}

function updateDisplay() {
    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        cell.textContent = board[row][col];
    });
}

function resetGame() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = '';
        }
    }
    currentPlayer = 'X';
    gameActive = true;
    updateDisplay();
    document.getElementById('status').textContent = 'Click a cell to start!';
}

document.getElementById('reset-btn').addEventListener('click', resetGame);
createBoard();
gameActive = true;

// Game of Life Demo
const golCanvas = document.getElementById('gol-canvas');
const ctx = golCanvas.getContext('2d');
const width = 50; // Grid width (cells)
const height = 50; // Grid height (cells)
const cellSize = 10; // Pixel size of each cell
let grid = Array(height).fill().map(() => Array(width).fill(false));
let isRunning = false;

function initializeGrid() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            grid[i][j] = Math.random() < 0.2; // 20% chance of being alive initially
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, golCanvas.width, golCanvas.height);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            ctx.fillStyle = grid[i][j] ? '#00e6b8' : '#333333';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
        }
    }
}

function countNeighbors(i, j) {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            const ni = (i + di + height) % height;
            const nj = (j + dj + width) % width;
            count += grid[ni][nj] ? 1 : 0;
        }
    }
    return count;
}

function nextGeneration() {
    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const neighbors = countNeighbors(i, j);
            if (grid[i][j]) {
                newGrid[i][j] = neighbors === 2 || neighbors === 3;
            } else {
                newGrid[i][j] = neighbors === 3;
            }
        }
    }
    grid = newGrid;
    drawGrid();
}

function toggleCell(e) {
    if (!isRunning) {
        const rect = golCanvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        grid[y][x] = !grid[y][x];
        drawGrid();
    }
}

golCanvas.addEventListener('click', toggleCell);

function gameLoop() {
    if (isRunning) {
        nextGeneration();
        requestAnimationFrame(gameLoop);
    }
}

document.getElementById('play-pause-btn').addEventListener('click', () => {
    isRunning = !isRunning;
    document.getElementById('play-pause-btn').textContent = isRunning ? 'Pause' : 'Play';
    if (isRunning) gameLoop();
});

document.getElementById('clear-btn').addEventListener('click', () => {
    grid = Array(height).fill().map(() => Array(width).fill(false));
    isRunning = false;
    document.getElementById('play-pause-btn').textContent = 'Play';
    drawGrid();
    document.getElementById('gol-status').textContent = 'Click the grid to draw cells!';
});

document.getElementById('random-btn').addEventListener('click', () => {
    initializeGrid();
    isRunning = false;
    document.getElementById('play-pause-btn').textContent = 'Play';
    drawGrid();
    document.getElementById('gol-status').textContent = 'Click the grid to draw cells!';
});

initializeGrid();
drawGrid();
document.getElementById('gol-status').textContent = 'Click the grid to draw cells!';