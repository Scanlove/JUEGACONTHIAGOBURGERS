let score = 0;
let level = 1;
let gameActive = true;
let playerPos = { x: window.innerWidth / 2, y: window.innerHeight - 80 };
let items = [];
let lastSpawn = 0;
let spawnInterval = 1000;
let scoreRecords = JSON.parse(localStorage.getItem('scoreRecords')) || [];

const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const gameMusic = document.getElementById('gameMusic');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');


startButton.addEventListener('click', () => {
    startScreen.style.display = 'none'; // Oculta la pantalla de inicio
    startNewGame(); // Inicia el juego
});



function updatePlayerPosition(x) {
    x = Math.max(30, Math.min(x, window.innerWidth - 30));
    playerPos.x = x;
    player.style.left = (x - 30) + 'px';
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    updatePlayerPosition(touch.clientX);
}

function handleMouse(e) {
    if (e.buttons === 1) {
        updatePlayerPosition(e.clientX);
    }
}

gameArea.addEventListener('touchmove', handleTouch, { passive: false });
gameArea.addEventListener('touchstart', handleTouch, { passive: false });
gameArea.addEventListener('mousemove', handleMouse);

function spawnItem() {
    if (!gameActive) return;

    const now = Date.now();
    if (now - lastSpawn < spawnInterval) return;
    lastSpawn = now;

    const isBomb = Math.random() < 0.2;
    const item = document.createElement('div');
    item.className = isBomb ? 'bomb' : 'burger';
    item.textContent = isBomb ? '💣' : '🍔';
    item.style.left = Math.random() * (window.innerWidth - 40) + 'px';
    item.style.top = '-50px';
    gameArea.appendChild(item);

    const speed = 2 + Math.floor(score / 300);
    items.push({
        element: item,
        x: parseFloat(item.style.left),
        y: -50,
        speed: speed,
        isBomb
    });
}

function updateGame() {
    if (!gameActive) return;

    spawnItem();

    const playerBounds = {
        left: playerPos.x - 30,
        right: playerPos.x + 30,
        top: playerPos.y - 30,
        bottom: playerPos.y + 30
    };

    items = items.filter(item => {
        item.y += item.speed;
        item.element.style.top = item.y + 'px';

        const itemBounds = {
            left: item.x,
            right: item.x + 40,
            top: item.y,
            bottom: item.y + 40
        };

        if (checkCollision(playerBounds, itemBounds)) {
            gameArea.removeChild(item.element);
            if (item.isBomb) {
                gameOver();
            } else {
                score += 10;
                updateScore();
                updateDifficulty();
            }
            return false;
        }

        if (item.y > window.innerHeight) {
            gameArea.removeChild(item.element);
            if (!item.isBomb) {
                gameOver();
            }
            return false;
        }

        return true;
    });

    requestAnimationFrame(updateGame);
}

function checkCollision(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

function updateScore() {
    document.getElementById('score').textContent = `Puntos: ${score}`;
}

function updateDifficulty() {
    const newLevel = Math.floor(score / 300) + 1;
    if (newLevel !== level) {
        level = newLevel;
        document.getElementById('difficultyLevel').textContent = `Nivel: ${level}`;
        spawnInterval = Math.max(300, 1000 - (level * 100));
        document.getElementById('difficultyLevel').classList.add('shake');
        setTimeout(() => {
            document.getElementById('difficultyLevel').classList.remove('shake');
        }, 500);
    }
}

function gameOver() {
    gameActive = false;
    gameMusic.pause(); // Detiene la música
    gameMusic.currentTime = 0; // Reinicia la música al principio para el próximo juego
    const record = {
        score: score,
        date: new Date().toLocaleString(),
        level: level
    };
    scoreRecords.unshift(record);
    if (scoreRecords.length > 10) scoreRecords.pop();
    localStorage.setItem('scoreRecords', JSON.stringify(scoreRecords));

    document.getElementById('finalScore').textContent = score;
    const rewards = document.getElementById('rewards');
    rewards.innerHTML = '';
    if (score >= 2500) rewards.innerHTML += '<p>¡Ganaste 10% de Descuento! 🎉</p>';
    if (score >= 2000) rewards.innerHTML += '<p>¡Ganaste Papas Gratis! 🍟</p>';
    if (score >= 1000) rewards.innerHTML += '<p>¡Ganaste un Refresco! 🥤</p>';

    document.getElementById('gameOverModal').style.display = 'flex';
}


function startNewGame() {
    items.forEach(item => gameArea.removeChild(item.element));
    items = [];
    score = 0;
    level = 1;
    gameActive = true;
    updateScore();
    document.getElementById('difficultyLevel').textContent = 'Nivel: 1';
    document.getElementById('gameOverModal').style.display = 'none';
    spawnInterval = 1000;
    gameMusic.play(); // Inicia la música
    requestAnimationFrame(updateGame);
}


document.getElementById('detailsButton').addEventListener('click', showDetails);

function showDetails() {
    const records = document.getElementById('scoreRecords');
    records.innerHTML = scoreRecords.map(record => `
        <div class="score-record">
            <div>Fecha: ${record.date}</div>
            <div>Puntos: ${record.score}</div>
            <div>Nivel: ${record.level}</div>
        </div>
    `).join('');
    document.getElementById('detailsModal').style.display = 'block';
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// Iniciar juego
// startNewGame(); 
