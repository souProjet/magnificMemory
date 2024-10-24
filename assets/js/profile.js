/**
 * Importe les fonctions nécessaires depuis d'autres modules
 */
import { retrieveUser, logout } from "./user.js";
import { displayMyLastGames } from "./score.js";
import { fillMemorySizeOptions, getAllConfigFromNbItem } from "./utils.js";

/**
 * Éléments du DOM
 */
const logoutButton = document.querySelector(".logout-button");
const username = document.getElementById('username');
const usernameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const memoryChoice = document.getElementById('memoryChoice');
const memorySize = document.getElementById('memorySize');

/**
 * Configuration du bouton de déconnexion
 */
logoutButton.addEventListener("click", logout);

/**
 * Initialise la page de profil au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', initializeProfilePage);

/**
 * Initialise la page de profil
 */
function initializeProfilePage() {
    const user = retrieveUser();
    if (user !== -1) {
        setupUserProfile(user);
    } else {
        redirectToLogin();
    }
}

/**
 * Configure le profil de l'utilisateur
 * @param {Object} user - L'objet utilisateur
 */
function setupUserProfile(user) {
    displayUserInfo(user);
    setupMemoryPreferences();
    displayMyLastGames(user.username);
}

/**
 * Affiche les informations de l'utilisateur
 * @param {Object} user - L'objet utilisateur
 */
function displayUserInfo(user) {
    username.textContent = `Bonjour ${user.username} !`;
    username.classList.remove('hidden');
    usernameInput.value = user.username;
    emailInput.value = user.email;
}

/**
 * Configure les préférences du Memory
 */
function setupMemoryPreferences() {
    memoryChoice.value = localStorage.getItem('memoryType')?.split(';')[0] || "animaux";
    memorySize.value = localStorage.getItem('memorySize') || "3x4";
    memoryChoice.dispatchEvent(new Event('change'));
}

/**
 * Redirige vers la page de connexion
 */
function redirectToLogin() {
    window.location.href = "/login.html";
}

/**
 * Gère le changement de type du Memory
 */
memoryChoice.addEventListener('change', handleMemoryTypeChange);

/**
 * Gère le changement de type du Memory
 */
function handleMemoryTypeChange() {
    const selectedOption = memoryChoice.options[memoryChoice.selectedIndex];
    const nbItem = parseInt(selectedOption.getAttribute('data-nb-item'));
    const imgExtension = selectedOption.getAttribute('data-img-extension');

    updateLocalStorage(selectedOption, imgExtension);
    updateMemorySizeOptions(nbItem);
}

/**
 * Met à jour le localStorage avec les nouvelles préférences
 * @param {HTMLOptionElement} selectedOption - L'option sélectionnée
 * @param {string} imgExtension - L'extension de l'image
 */
function updateLocalStorage(selectedOption, imgExtension) {
    localStorage.setItem('memoryType', `${memoryChoice.value};${selectedOption.textContent}`);
    localStorage.setItem('imgExtension', imgExtension);
}

/**
 * Met à jour les options de taille du Memory
 * @param {number} nbItem - Le nombre d'éléments
 */
function updateMemorySizeOptions(nbItem) {
    memorySize.innerHTML = "";
    const config = getAllConfigFromNbItem(nbItem);
    fillMemorySizeOptions(config, memorySize);
    memorySize.value = localStorage.getItem('memorySize');
}

/**
 * Gère le changement de taille du Memory
 */
memorySize.addEventListener('change', () => {
    localStorage.setItem('memorySize', memorySize.value);
});