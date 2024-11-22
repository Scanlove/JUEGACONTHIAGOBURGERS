document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');

    const BOARD_SIZE = 5;
    const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

    const ITEMS = [
        { type: '💣', chance: 0.3, action: 'bomb' },
        { type: '🥤', chance: 0.2, action: 'vaso' },
        { type: '🍔', chance: 0.2, action: 'burger' },
        { type: '🍟', chance: 0.2, action: 'papas' },
        { type: '✨', chance: 0.1, action: 'bonus' }
    ];

    let score = {
        vaso: 0,
        burger: 0,
        papas: 0
    };

    function createBoard() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

        for (let i = 0; i < TOTAL_CELLS; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => revealCell(cell));
            gameBoard.appendChild(cell);
        }
    }

    function revealCell(cell) {
        if (cell.classList.contains('revealed')) return;

        const item = selectRandomItem();
        cell.textContent = item.type;
        cell.classList.add('revealed');

        if (item.action === 'bomb') {
            gameOver();
            return;
        }

        if (['vaso', 'burger', 'papas'].includes(item.action)) {
            score[item.action]++;
            checkPrizes(item.action);
        }
    }

    function selectRandomItem() {
        const rand = Math.random();
        let cumulativeChance = 0;

        for (let item of ITEMS) {
            cumulativeChance += item.chance;
            if (rand <= cumulativeChance) {
                return item;
            }
        }

        return ITEMS[0]; // Default to bomb if something goes wrong
    }

    function checkPrizes(type) {
        if (score[type] === 3) {
            alert(`¡Ganaste un premio de ${type}!`);
        }
    }

    function gameOver() {
        alert('¡Boom! Juego Terminado');
        resetGame();
    }

    function resetGame() {
        score = { vaso: 0, burger: 0, papas: 0 };
        createBoard();
    }

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        createBoard();
    });
});
