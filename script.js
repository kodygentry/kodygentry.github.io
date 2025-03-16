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
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            // Calculate position to scroll to (accounting for mobile bottom nav)
            const bottomNavHeight = document.querySelector('.bottom-nav') ? 
                                    document.querySelector('.bottom-nav').offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - bottomNavHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close menu if open
            document.getElementById('nav-menu').style.display = 'none';
        }
    });
});

// Particle Animation (for all pages with #particles)
if (document.getElementById('particles')) {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    const heroSection = document.querySelector('.hero');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    
    resizeCanvas();

    const particles = [];
    // Adjust number of particles based on screen size
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3
        });
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = '#00e6b8';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Boundary check
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();

    // Resize canvas on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
        }, 200);
    });
}

// Menu Toggle (for all pages)
document.querySelector('.nav-circle').addEventListener('click', (e) => {
    e.stopPropagation();
    const navMenu = document.getElementById('nav-menu');
    const isCurrentlyHidden = navMenu.style.display !== 'block';
    navMenu.style.display = isCurrentlyHidden ? 'block' : 'none';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navMenu = document.getElementById('nav-menu');
    const navCircle = document.querySelector('.nav-circle');
    
    if (navMenu.style.display === 'block' && e.target !== navCircle && !navMenu.contains(e.target)) {
        navMenu.style.display = 'none';
    }
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
    if (!tttBoard) return; // Skip if not on the right page
    
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

    const statusElement = document.getElementById('status');
    if (checkWin()) {
        statusElement.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    } else if (checkDraw()) {
        statusElement.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = 'O';
    statusElement.textContent = "AI is thinking...";
    
    // Add slight delay for better UX
    setTimeout(aiMove, 500);
}

function aiMove() {
    if (!gameActive) return;

    const bestMove = minimax(board, 'O').move;
    if (bestMove) {
        board[bestMove.row][bestMove.col] = 'O';
        updateDisplay();

        const statusElement = document.getElementById('status');
        if (checkWin()) {
            statusElement.textContent = `AI (O) wins!`;
            gameActive = false;
        } else if (checkDraw()) {
            statusElement.textContent = "It's a draw!";
            gameActive = false;
        } else {
            currentPlayer = 'X';
            statusElement.textContent = "Your turn!";
        }
    }
}

function minimax(board, player, depth = 0, alpha = -Infinity, beta = Infinity) {
    // Implement alpha-beta pruning for better performance
    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') emptyCells.push({ row: i, col: j });
        }
    }

    if (checkWinFor('X', board)) return { score: -10 + depth };
    if (checkWinFor('O', board)) return { score: 10 - depth };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let cell of emptyCells) {
        let move = { row: cell.row, col: cell.col };
        
        // Try this move
        board[cell.row][cell.col] = player;
        
        // Recursively evaluate
        let score;
        if (player === 'O') {
            score = minimax(board, 'X', depth + 1, alpha, beta).score;
            alpha = Math.max(alpha, score);
        } else {
            score = minimax(board, 'O', depth + 1, alpha, beta).score;
            beta = Math.min(beta, score);
        }
        
        // Undo move
        board[cell.row][cell.col] = '';
        move.score = score;
        moves.push(move);
        
        // Alpha-beta pruning
        if (beta <= alpha) break;
    }

    // Find best move
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
    return checkWinFor(currentPlayer, board);
}

function checkWinFor(player, boardState = board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (boardState[i][0] === player && boardState[i][1] === player && boardState[i][2] === player) return true;
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
        if (boardState[0][i] === player && boardState[1][i] === player && boardState[2][i] === player) return true;
    }
    
    // Check diagonals
    if (boardState[0][0] === player && boardState[1][1] === player && boardState[2][2] === player) return true;
    if (boardState[0][2] === player && boardState[1][1] === player && boardState[2][0] === player) return true;
    
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
        
        // Add css classes for better styling
        if (board[row][col] === 'X') {
            cell.classList.add('x-cell');
        } else if (board[row][col] === 'O') {
            cell.classList.add('o-cell');
        }
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
    
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = 'Click a cell to start!';
    }
    
    document.querySelectorAll('.ttt-cell').forEach(cell => {
        cell.classList.remove('x-cell', 'o-cell');
    });
}

// Setup reset button
const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
}

// Game of Life Demo
const golCanvas = document.getElementById('gol-canvas');
if (golCanvas) {
    const ctx = golCanvas.getContext('2d');
    
    // Adjust for mobile screens
    let width, height, cellSize;
    
    function setupGolCanvas() {
        // Responsive adjustment
        if (window.innerWidth < 480) {
            width = 30;
            height = 30;
            cellSize = golCanvas.width / width;
        } else if (window.innerWidth < 768) {
            width = 40;
            height = 40;
            cellSize = golCanvas.width / width;
        } else {
            width = 50;
            height = 50;
            cellSize = 10;
        }
        
        // Reset grid with new dimensions
        grid = Array(height).fill().map(() => Array(width).fill(false));
    }
    
    setupGolCanvas();
    let grid = Array(height).fill().map(() => Array(width).fill(false));
    let isRunning = false;
    let animationFrame;

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
                // Use a glowing effect for alive cells
                if (grid[i][j]) {
                    ctx.fillStyle = '#00e6b8';
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
                    
                    // Add glow effect
                    ctx.shadowColor = '#00e6b8';
                    ctx.shadowBlur = 5;
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = '#333333';
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize - 1, cellSize - 1);
                }
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
            
            // Check bounds
            if (x >= 0 && x < width && y >= 0 && y < height) {
                grid[y][x] = !grid[y][x];
                drawGrid();
            }
        }
    }

    // Handle both click and touch for mobile
    golCanvas.addEventListener('click', toggleCell);
    golCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        toggleCell({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    });

    function gameLoop() {
        if (isRunning) {
            nextGeneration();
            animationFrame = requestAnimationFrame(gameLoop);
        }
    }

    // Setup play-pause button
    const playPauseBtn = document.getElementById('play-pause-btn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isRunning = !isRunning;
            playPauseBtn.textContent = isRunning ? 'Pause' : 'Play';
            
            if (isRunning) {
                gameLoop();
                document.getElementById('gol-status').textContent = 'Game is running...';
            } else {
                cancelAnimationFrame(animationFrame);
                document.getElementById('gol-status').textContent = 'Game paused. Click to edit.';
            }
        });
    }

    // Setup clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            grid = Array(height).fill().map(() => Array(width).fill(false));
            isRunning = false;
            if (playPauseBtn) playPauseBtn.textContent = 'Play';
            cancelAnimationFrame(animationFrame);
            drawGrid();
            document.getElementById('gol-status').textContent = 'Grid cleared! Click to draw cells.';
        });
    }

    // Setup random button
    const randomBtn = document.getElementById('random-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            initializeGrid();
            isRunning = false;
            if (playPauseBtn) playPauseBtn.textContent = 'Play';
            cancelAnimationFrame(animationFrame);
            drawGrid();
            document.getElementById('gol-status').textContent = 'Random pattern generated!';
        });
    }

    // Handle window resize for Game of Life canvas
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrame);
        isRunning = false;
        if (playPauseBtn) playPauseBtn.textContent = 'Play';
        
        setupGolCanvas();
        initializeGrid();
        drawGrid();
    });

    // Initialize Game of Life
    initializeGrid();
    drawGrid();
}

// Initialize board when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    
    // Add active state for bottom navigation based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.bottom-nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});