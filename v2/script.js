const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');
const messageDisplay = document.getElementById('message');
const gameStatus = document.getElementById('game-status');

// Using simple emojis for high visibility
const items = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isLocked = false;

function initGame() {
    // Duplicate items to create pairs
    cards = [...items, ...items];
    shuffle(cards);
    renderBoard();

    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = `手数: ${moves}`;
    messageDisplay.classList.add('hidden');
    flippedCards = [];

    // Instant Memory Mode: Show all cards
    startInstantMemoryPhase();
}

function startInstantMemoryPhase() {
    isLocked = true;
    gameStatus.textContent = "記憶タイム！";

    // Flip all cards
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped'));

    let timeLeft = 3;
    gameStatus.textContent = `記憶タイム: ${timeLeft}`;

    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            gameStatus.textContent = `記憶タイム: ${timeLeft}`;
        } else {
            clearInterval(timer);
            endInstantMemoryPhase(allCards);
        }
    }, 1000);
}

function endInstantMemoryPhase(allCards) {
    gameStatus.textContent = "";
    allCards.forEach(card => card.classList.remove('flipped'));
    isLocked = false;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    cards.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.value = item;

        // We put the content directly in the div, but control visibility via CSS color
        card.textContent = item;

        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    });
}

function handleCardClick(e) {
    const card = e.currentTarget;

    // Ignore clicks if locked, already flipped, or matched
    if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    flipCard(card);
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = `手数: ${moves}`;
        checkForMatch();
    }
}

function flipCard(card) {
    card.classList.add('flipped');
}

function unflipCard(card) {
    card.classList.remove('flipped');
}

function checkForMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.value === card2.dataset.value;

    if (isMatch) {
        disableCards();
    } else {
        // Wait a bit before flipping back so user can see the card
        setTimeout(unflipCards, 1000);
    }
}

function disableCards() {
    flippedCards.forEach(card => {
        card.classList.remove('flipped');
        card.classList.add('matched');
    });
    flippedCards = [];
    matchedPairs++;
    isLocked = false;

    if (matchedPairs === items.length) {
        setTimeout(() => {
            messageDisplay.classList.remove('hidden');
        }, 500);
    }
}

function unflipCards() {
    flippedCards.forEach(card => unflipCard(card));
    flippedCards = [];
    isLocked = false;
}

restartBtn.addEventListener('click', initGame);

// Start game on load
initGame();
