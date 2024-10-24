import { compareHash } from "./hash.js";
import { getUserByEmail, setCookie } from "./user.js";

/**
 * Éléments du DOM
 */
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitButton = document.querySelector(".submit-button");
const userNotFound = document.querySelector(".user-not-found");

/**
 * Affiche un message d'erreur
 * @param {string} message - Le message d'erreur à afficher
 */
function showError(message) {
    userNotFound.textContent = message;
    userNotFound.classList.add("show");
}

/**
 * Réinitialise le message d'erreur
 */
function resetError() {
    userNotFound.textContent = "";
    userNotFound.classList.remove("show");
}

/**
 * Gère la soumission du formulaire de connexion
 * @param {Event} e - L'événement de soumission
 */
async function handleSubmit(e) {
    e.preventDefault();

    if (!email.value || !password.value) {
        showError("Veuillez remplir tous les champs");
        return;
    }

    const user = getUserByEmail(email.value);
    if (!user) {
        showError("Email ou mot de passe incorrect");
        return;
    }

    try {
        if (await compareHash(password.value, user.password)) {
            setCookie("token", user.token, 365);
            window.location.href = "/profile.html";
        } else {
            showError("Email ou mot de passe incorrect");
        }
    } catch (error) {
        console.error(error);
        showError("Une erreur est survenue, veuillez réessayer");
    }
}

/**
 * Initialise les écouteurs d'événements
 */
function initializeEventListeners() {
    submitButton.addEventListener("click", handleSubmit);
    email.addEventListener("input", resetError);
    password.addEventListener("input", resetError);
}

// Initialisation des écouteurs d'événements
initializeEventListeners();
