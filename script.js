document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameBoard = document.getElementById('game-board');
    const messageContainer = document.getElementById('message-container');
    const vasoScore = document.getElementById('vaso-score');
    const papasScore = document.getElementById('papas-score');
    const burgerScore = document.getElementById('burger-score');
    const gameMusic = document.getElementById('game-music');
    const bombSound = document.getElementById('bomb-sound');
    const prizeSound = document.getElementById('prize-sound');

    let vasos = 0;
    let papas = 0;
    let burgers = 0;

    const boardSize = 25;
    const prizes = [
        {name: 'vaso', count: 3, reward: 'Un vaso gratis'},
        {name: 'papas', count: 3, reward: 'Una porción de papas'},
        {name: 'burger', count: 3, reward: 'Un plato sorpresa'}
    ];

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', resetGame);

    function startGame() {
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameMusic.play().catch(error => console.log('Music autoplay prevented'));
        createBoard();
    }

    function resetGame() {
        gameOverScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        vasos = 0;
        papas = 0;
        burgers = 0;
        vasoScore.textContent = '0';
        papasScore.textContent = '0';
        burgerScore.textContent = '0';
        messageContainer.textContent = '';
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        const items = generateItems();
        
        items.forEach((item, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.type = item;
            
            cell.addEventListener('click', () => revealCell(cell, item));
            
            gameBoard.appendChild(cell);
        });
    }

    function generateItems() {
        const items = new Array(boardSize).fill('empty');
        const bombCount = 5;
        
        // Add bombs
        for (let i = 0; i < bombCount; i++) {
            const randomIndex = Math.floor(Math.random() * boardSize);
            if (items[randomIndex] === 'empty') {
                items[randomIndex] = 'bomb';
            }
        }
        
        // Add prizes
        prizes.forEach(prize => {
            for (let i = 0; i < prize.count; i++) {
                const randomIndex = Math.floor(Math.random() * boardSize);
                if (items[randomIndex] === 'empty') {
                    items[randomIndex] = prize.name;
                }
            }
        });
        
        return items;
    }

    function revealCell(cell, type) {
        if (cell.classList.contains('revealed')) return;
        
        cell.classList.add('revealed');
        
        if (type === 'bomb') {
            cell.classList.add('bomb');
            cell.textContent = '💥';
            bombSound.play();
            gameMusic.pause();
            gameScreen.classList.add('hidden');
            gameOverScreen.classList.remove('hidden');
            return;
        }
        
        cell.textContent = type;
        
        switch(type) {
            case 'vaso':
                vasos++;
                vasoScore.textContent = vasos;
                checkPrize('vaso');
                prizeSound.play();
                break;
            case 'papas':
                papas++;
                papasScore.textContent = papas;
                checkPrize('papas');
                prizeSound.play();
                break;
            case 'burger':
                burgers++;
                burgerScore.textContent = burgers;
                checkPrize('burger');
                prizeSound.play();
                break;
        }
    }

    function checkPrize(type) {
        const prize = prizes.find(p => p.name === type);
        if (prize) {
            const count = type === 'vaso' ? vasos : 
                          type === 'papas' ? papas : 
                          burgers;
            
            if (count === prize.count) {
                messageContainer.textContent = `¡Ganaste ${prize.reward}!`;
                setTimeout(() => {
                    messageContainer.textContent = '';
                }, 3000);
            }
        }
    }
});
