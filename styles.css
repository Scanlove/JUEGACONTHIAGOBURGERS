body, html {
    margin: 0;
    padding: 0;
    font-family: 'Comic Sans MS', cursive;
    background-color: #FF6B6B;
    height: 100%;
    overflow: hidden;
}

#start-screen, #game-screen, #game-over-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
}

.start-container, .game-over-container {
    background-color: #FFD93D;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
    max-width: 90%;
    width: 350px;
}

.start-logo, #game-logo {
    max-width: 200px;
    margin: 20px 0;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

#game-rules ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
}

#start-button, #restart-button {
    background-color: #6BCB77;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s;
}

#start-button:active, #restart-button:active {
    transform: scale(0.95);
}

#game-board {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    margin: 20px 0;
}

.cell {
    background-color: #4ECDC4;
    height: 70px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
}

.cell:active {
    transform: scale(0.95);
}

.cell.revealed {
    background-color: #45B7D1;
}

.cell.bomb {
    background-color: #FF6B6B;
}

.hidden {
    display: none !important;
}

#score-container {
    display: flex;
    justify-content: space-around;
    color: white;
    font-weight: bold;
}

#message-container {
    color: white;
    font-size: 18px;
    margin-top: 10px;
}
