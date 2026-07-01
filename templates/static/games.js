// ---------- Navegação entre telas ----------
function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');

    if (name === 'memory') startMemoryGame();
    if (name === 'tictactoe') startTicTacToe();
}

// ========== JOGO DA MEMÓRIA ==========
const memorySymbols = ['🐱', '🐾', '💻', '⌨️', '🖱️', '🐈‍⬛', '🔐', '🌐'];
let memoryState = [];
let flippedCards = [];
let lockBoard = false;
let moves = 0;
let matchedCount = 0;

function startMemoryGame() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    document.getElementById('memory-win').textContent = '';
    moves = 0;
    matchedCount = 0;
    flippedCards = [];
    lockBoard = false;
    document.getElementById('memory-moves').textContent = 'Jogadas: 0';

    memoryState = [...memorySymbols, ...memorySymbols]
        .sort(() => Math.random() - 0.5);

    memoryState.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = '';
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memory-moves').textContent = 'Jogadas: ' + moves;
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    lockBoard = true;

    if (first.dataset.symbol === second.dataset.symbol) {
        first.classList.add('matched');
        second.classList.add('matched');
        matchedCount += 2;
        flippedCards = [];
        lockBoard = false;

        if (matchedCount === memoryState.length) {
            document.getElementById('memory-win').textContent =
                `🎉 Você venceu em ${moves} jogadas!`;
        }
    } else {
        setTimeout(() => {
            first.classList.remove('flipped');
            second.classList.remove('flipped');
            first.textContent = '';
            second.textContent = '';
            flippedCards = [];
            lockBoard = false;
        }, 800);
    }
}

// ========== JOGO DA VELHA ==========
let tttBoard = [];
let tttTurn = 'X';
let tttActive = true;

const winLines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function startTicTacToe() {
    tttBoard = Array(9).fill('');
    tttTurn = 'X';
    tttActive = true;
    document.getElementById('ttt-win').textContent = '';
    document.getElementById('ttt-turn').textContent = 'Vez de: X';

    const board = document.getElementById('ttt-board');
    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => playTttMove(i, cell));
        board.appendChild(cell);
    }
}

function playTttMove(index, cell) {
    if (!tttActive || tttBoard[index] !== '') return;

    tttBoard[index] = tttTurn;
    cell.textContent = tttTurn;
    cell.disabled = true;

    const winner = checkTttWinner();
    if (winner) {
        document.getElementById('ttt-win').textContent = `🎉 Jogador ${winner} venceu!`;
        tttActive = false;
        return;
    }

    if (!tttBoard.includes('')) {
        document.getElementById('ttt-win').textContent = '🤝 Empate!';
        tttActive = false;
        return;
    }

    tttTurn = tttTurn === 'X' ? 'O' : 'X';
    document.getElementById('ttt-turn').textContent = 'Vez de: ' + tttTurn;
}

function checkTttWinner() {
    for (const [a, b, c] of winLines) {
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            return tttBoard[a];
        }
    }
    return null;
}