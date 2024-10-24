/**
 * Importe les constantes et fonctions nécessaires depuis d'autres modules
 */
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from './constants.js';
import { initParticlesSystem, createSuccessParticles, createErrorParticles, animateParticles } from './particle.js';
import { saveScore, displayBestScores } from './score.js';
import { retrieveUser, logout } from './user.js';

/**
 * Configuration initiale du jeu
 */
const gameConfig = {
    memoryType: localStorage.getItem('memoryType')?.split(';')[0] || "animaux",
    memoryTypeName: localStorage.getItem('memoryType')?.split(';')[1] || "Animaux",
    memorySize: localStorage.getItem('memorySize') || "3x4",
    imgExtension: localStorage.getItem('imgExtension') || "webp"
};

/**
 * Variables globales du jeu
 */
let imgPath = `../assets/img/ressources/${gameConfig.memoryType}/`;
let gridSize = calculateGridSize(gameConfig.memorySize);
let blockClick = false;
let returnedCards = [];
let gameFinished = false;
let nbRounds = 0;

/**
 * Éléments du DOM
 */
const userMessage = document.getElementById('user-message');
const username = document.getElementById('username');
const memoryChoice = document.getElementById('memoryChoice');
const memorySize = document.getElementById('memorySize');

/**
 * Initialise le jeu au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', initializeGame);

/**
 * Gère le changement de type de mémoire
 */
memoryChoice.addEventListener('change', handleMemoryTypeChange);

/**
 * Gère le changement de taille de la grille
 */
memorySize.addEventListener('change', handleMemorySizeChange);

/**
 * Initialise le jeu
 */
function initializeGame() {
    initParticlesSystem();
    setupUser();
    setupMemoryChoice();
    generateGrid();
    displayBestScores();
}

/**
 * Configure l'affichage de l'utilisateur
 */
function setupUser() {
    const user = retrieveUser();
    if (user !== -1) {
        username.textContent = `Bonjour ${user.username} !`;
        username.classList.remove('hidden');
    }
}

/**
 * Configure les options de choix de mémoire
 */
function setupMemoryChoice() {
    memoryChoice.value = gameConfig.memoryType;
    const config = getAllConfigFromNbItem(gridSize);
    fillMemorySizeOptions(config);
    memorySize.value = gameConfig.memorySize;
}

/**
 * Gère le changement de type de mémoire
 */
function handleMemoryTypeChange() {
    updateGameConfig();
    initializeGame();
}

/**
 * Gère le changement de taille de la grille
 */
function handleMemorySizeChange() {
    gameConfig.memorySize = memorySize.value;
    gridSize = calculateGridSize(gameConfig.memorySize);
    initializeGame();
}

/**
 * Met à jour la configuration du jeu
 */
function updateGameConfig() {
    const selectedOption = memoryChoice.options[memoryChoice.selectedIndex];
    gameConfig.memoryType = memoryChoice.value;
    gameConfig.memoryTypeName = selectedOption.textContent;
    gameConfig.imgExtension = selectedOption.getAttribute('data-img-extension');
    imgPath = `../assets/img/ressources/${gameConfig.memoryType}/`;
    
    const maxItems = parseInt(selectedOption.getAttribute('data-nb-item'));
    const config = getAllConfigFromNbItem(maxItems);
    const lastMemorySize = memorySize.value;
    
    fillMemorySizeOptions(config);
    memorySize.value = config.includes(lastMemorySize) ? lastMemorySize : config[0];
    
    gameConfig.memorySize = memorySize.value;
    gridSize = calculateGridSize(gameConfig.memorySize);
}

/**
 * Calcule la taille de la grille à partir de la chaîne de taille
 * @param {string} size - La taille de la grille (ex: "3x4")
 * @returns {number} La taille totale de la grille
 */
function calculateGridSize(size) {
    const [rows, cols] = size.split('x').map(Number);
    return rows * cols;
}

/**
 * Génère la grille de jeu
 */
function generateGrid() {
    const [rows, cols] = gameConfig.memorySize.split('x').map(Number);
    const gameGrid = document.getElementById('gamegrid');
    const gridWidth = Math.min(500, window.innerWidth * 0.7);
    const cardSize = Math.floor(gridWidth / cols) - 8;
   
    gameGrid.style.cssText = `
        grid-template-columns: repeat(${cols}, 1fr);
        grid-template-rows: repeat(${rows}, 1fr);
        width: ${gridWidth}px;
        height: ${(cardSize + 8) * rows}px;
    `;
    gameGrid.innerHTML = '';

    const imgTab = genRandomGrid(gridSize);
    console.log(imgTab)
    const cards = Array.from({length: gridSize}, () => createCard(cardSize));
    console.log(cards)
    cards.forEach((card, i) => {
        card.querySelector('.front').style.backgroundImage = `url(${imgPath}${imgTab[i]}.${gameConfig.imgExtension})`;
        gameGrid.appendChild(card);
    });

    addCardEventListeners(cards);
}

/**
 * Crée une carte de jeu
 * @param {number} size - La taille de la carte
 * @returns {HTMLElement} L'élément de carte créé
 */
function createCard(size) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.style.width = card.style.height = `${size}px`;
    card.innerHTML = '<div class="front"></div><div class="back"></div>';
    return card;
}

/**
 * Ajoute les écouteurs d'événements aux cartes
 * @param {HTMLElement[]} cards - Les cartes de jeu
 */
function addCardEventListeners(cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });
}

/**
 * Gère le clic sur une carte
 * @param {HTMLElement} card - La carte cliquée
 */
function handleCardClick(card) {
    if (blockClick || gameFinished || card.classList.contains('matched')) return;
    card.classList.toggle('flipped');
    returnedCards.push(card);
    if (returnedCards.length % 2 === 0) {
        blockClick = true;
        nbRounds++;
        checkIfPair(returnedCards.slice(-2));
    }
}

/**
 * Remplit les options de taille de mémoire
 * @param {string[]} config - Les configurations possibles
 */
function fillMemorySizeOptions(config) {
    memorySize.innerHTML = config.map(size => `<option value="${size}">${size}</option>`).join('');
}

/**
 * Obtient toutes les configurations possibles pour un nombre d'éléments donné
 * @param {number} nbItem - Le nombre d'éléments
 * @returns {string[]} Les configurations possibles
 */
function getAllConfigFromNbItem(nbItem) {
    let config = [];
    for (let n = 3; n * n <= nbItem * 2; n++) {
        if (n * n <= nbItem * 2 && (n * n) % 2 === 0) {
            config.push(`${n}x${n}`);
        }
        if (n * (n + 1) <= nbItem * 2 && (n * (n + 1)) % 2 === 0) {
            config.push(`${n}x${n + 1}`);
            config.push(`${n + 1}x${n}`);
        }
    }
    return config;
}

/**
 * Vérifie si les deux cartes retournées forment une paire
 * @param {HTMLElement[]} cards - Les deux cartes à vérifier
 */
function checkIfPair(cards) {
    const [card1, card2] = cards;
    const isMatch = card1.querySelector('.front').style.backgroundImage === card2.querySelector('.front').style.backgroundImage;
    isMatch ? matchFound(cards) : matchNotFound(cards);
}

/**
 * Gère le cas où une paire est trouvée
 * @param {HTMLElement[]} cards - Les cartes formant la paire
 */
function matchFound(cards) {
    blockClick = false;
    userMessage.textContent = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];

    cards.forEach(card => {
        card.classList.add('matched');
        createSuccessParticles(card);
    });
    animateParticles();

    if (returnedCards.length === gridSize) {
        endGame();
    }

    setTimeout(() => {
        if (returnedCards.length !== gridSize) {
            userMessage.textContent = '';
        }
    }, 1000);
}

/**
 * Gère la fin du jeu
 */
function endGame() {
    gameFinished = true;
    userMessage.textContent = `Bravo ! Tu as trouvé toutes les paires en ${nbRounds} tours !`;
    const user = retrieveUser();
    saveScore(user, nbRounds, gameConfig.memorySize, gameConfig.memoryTypeName);
}

/**
 * Gère le cas où les cartes ne forment pas une paire
 * @param {HTMLElement[]} cards - Les cartes qui ne forment pas une paire
 */
function matchNotFound(cards) {
    userMessage.textContent = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
    
    cards.forEach(card => createErrorParticles(card));
    animateParticles();
    
    setTimeout(() => {
        cards.forEach(card => card.classList.toggle('flipped'));
        returnedCards.splice(0, 2);
        blockClick = false;
        userMessage.textContent = '';
    }, 1000);
}

/**
 * Génère une grille aléatoire
 * @param {number} gridSize - La taille de la grille
 * @returns {number[]} La grille générée
 */
function genRandomGrid(gridSize) {
    const maxItems = parseInt(memoryChoice.options[memoryChoice.selectedIndex].getAttribute('data-nb-item'));
    let imgTab = [];
    let usedIds = new Set();

    while (imgTab.length < gridSize) {
        const randomId = Math.floor(Math.random() * maxItems) + 1;
        if (!usedIds.has(randomId)) {
            imgTab.push(randomId, randomId);
            usedIds.add(randomId);
        }
    }

    return fisherYatesAlgo(imgTab);
}

/**
 * Implémente l'algorithme de Fisher-Yates pour mélanger un tableau
 * @param {any[]} tab - Le tableau à mélanger
 * @returns {any[]} Le tableau mélangé
 */
function fisherYatesAlgo(tab) {
    for (let i = tab.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tab[i], tab[j]] = [tab[j], tab[i]];
    }
    return tab;
}

// Écouteur d'événement pour réinitialiser le jeu avec la touche espace
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        initializeGame();
    }
});

// Configuration du bouton de déconnexion
const logoutButton = document.querySelector(".logout-button");
logoutButton.addEventListener("click", logout);
