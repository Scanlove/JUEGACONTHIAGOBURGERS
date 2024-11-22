document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameBoard = document.getElementById('game-board');
    const messageContainer = document.getElementById('message-container');

    const BOARD_SIZE = 5;
    const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
    const BOMB_COUNT = 5;
    const PRIZE_TYPES = ['vaso', 'papas', 'burger'];

    let board = [];
    let revealedCells = 0;
    let prizes = {
        vaso: 0,
        papas: 0,
        burger: 0
    };

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);

    function createBoard() {
        // Inicializar el tablero
        board = Array(TOTAL_CELLS).fill().map(() => ({
            isBomb: false,
            isPrize: null,
            isRevealed: false,
            neighborBombs: 0
        }));

        // Colocar bombas
        let bombsPlaced = 0;
        while (bombsPlaced < BOMB_COUNT) {
            const index = Math.floor(Math.random() * TOTAL_CELLS);
            if (!board[index].isBomb) {
                board[index].isBomb = true;
                bombsPlaced++;
            }
        }

        // Colocar premios
        PRIZE_TYPES.forEach(prize => {
            let prizesPlaced = 0;
            while (prizesPlaced < 3) {
                const index = Math.floor(Math.random() * TOTAL_CELLS);
                if (!board[index].isBomb && !board[index].isPrize) {
                    board[index].isPrize = prize;
                    prizesPlaced++;
                }
            }
        });

        // Calcular bombas vecinas
        board.forEach((cell, index) => {
            if (!cell.isBomb) {
                cell.neighborBombs = countNeighborBombs(index);
            }
        });
    }

    function countNeighborBombs(index) {
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        let bombCount = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;

                if (newRow >= 0 && newRow < BOARD_SIZE && 
                    newCol >= 0 && newCol < BOARD_SIZE) {
                    const neighborIndex = newRow * BOARD_SIZE + newCol;
                    if (board[neighborIndex].isBomb) {
                        bombCount++;
                    }
                }
            }
        }

        return bombCount;
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.index = index;

            cellElement.addEventListener('click', () => revealCell(index));

            if (cell.isRevealed) {
                cellElement.classList.add('revealed');
                if (cell.isBomb) {
                    cellElement.textContent = '💥';
                    cellElement.classList.add('bomb');
                } else if (cell.isPrize) {
                    cellElement.textContent = cell.isPrize;
                } else if (cell.neighborBombs > 0) {
                    cellElement.textContent = cell.neighborBombs;
                }
            }

            gameBoard.appendChild(cellElement);
        });
    }

    function revealCell(index) {
        const cell = board[index];

        // Evitar revelar celdas ya reveladas
        if (cell.isRevealed) return;

        cell.isRevealed = true;
        revealedCells++;

        // Verificar bomba
        if (cell.isBomb) {
            gameOver();
            return;
        }

        // Verificar premio
        if (cell.isPrize) {
            prizes[cell.isPrize]++;
            checkPrizes();
        }

        renderBoard();

        // Ganar el juego si se revelan todas las celdas sin bombas
        if (revealedCells === TOTAL_CELLS - BOMB_COUNT) {
            winGame();
        }
    }

    function checkPrizes() {
        PRIZE_TYPES.forEach(prize => {
            if (prizes[prize] === 3) {
                messageContainer.textContent = `¡Ganaste ${prize === 'vaso' ? 'un vaso gratis' : 
                    prize === 'papas' ? 'una porción de papas' : 
                    'un plato sorpresa'}!`;
                setTimeout(() => {
                    messageContainer.textContent = '';
                }, 3000);
            }
        });
    }

    function gameOver() {
        // Revelar todas las bombas
        board.forEach(cell => {
            if (cell.isBomb) cell.isRevealed = true;
        });
        renderBoard();
        gameScreen.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }

    function winGame() {
        messageContainer.textContent = '¡Ganaste! Has descubierto todos los premios';
        setTimeout(() => {
            messageContainer.textContent = '';
        }, 3000);
    }

    function startGame() {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        createBoard();
        renderBoard();
        // Restablecer contadores
        revealedCells = 0;
        prizes = {
            vaso: 0,
            papas: 0,
            burger: 0
        };
    }

    function resetGame() {
        gameOverScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    }
});
