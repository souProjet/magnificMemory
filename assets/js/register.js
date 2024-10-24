import { hash } from "./hash.js";
import { validateUsername, validateEmail, validatePassword } from "./validator.js";
import { emailOrUsernameExists, addUser } from "./user.js";
import { getToken, applyWizzEffect } from "./utils.js";

/**
 * Éléments du DOM
 */
const username = document.getElementById("username-input");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitButton = document.querySelector(".submit-button");
const strengthSections = document.querySelectorAll('.strength-section');
const emailErrorMessage = document.querySelector(".email-error-message");
const usernameErrorMessage = document.querySelector(".username-error-message");

/**
 * Calcule la force du mot de passe.
 * @param {string} password - Le mot de passe à évaluer.
 * @returns {number} La force du mot de passe (-1: invalide, 0: faible, 1: moyen, 2: fort).
 */
function getPasswordStrength(password) {
    if (!password) return -1;
    if (password.length < 6) return 0; // Faible
    if (password.length >= 9 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 2; // Fort
    if (password.length >= 6 && (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password))) return 1; // Moyen
    return -1;
}

/**
 * Met à jour l'affichage de la force du mot de passe.
 * @param {number} strength - La force du mot de passe.
 */
function updateStrengthDisplay(strength) {
    strengthSections.forEach((section, index) => {
        section.setAttribute('data-active', index <= strength ? 'true' : 'false');
    });
}

/**
 * Écouteur d'événement pour la saisie du mot de passe.
 */
password.addEventListener('input', () => {
    const strength = getPasswordStrength(password.value);
    updateStrengthDisplay(strength);
});

/**
 * Écouteur d'événement pour le clic sur le bouton de soumission.
 */
submitButton.addEventListener("click", handleSubmit);

/**
 * Gère la soumission du formulaire d'inscription.
 * @param {Event} e - L'événement de soumission.
 */
async function handleSubmit(e) {
    e.preventDefault();

    const usernameResult = validateUsername(username.value);
    const emailResult = validateEmail(email.value);
    const passwordResult = validatePassword(password.value);

    let hasError = false;

    hasError = updateFieldStatus(username, usernameErrorMessage, usernameResult) || hasError;
    hasError = updateFieldStatus(email, emailErrorMessage, emailResult) || hasError;
    hasError = updateFieldStatus(password, null, passwordResult) || hasError;

    const emailOrUsernameExistsResult = emailOrUsernameExists(email.value, username.value);
    if (emailOrUsernameExistsResult !== -1) {
        hasError = true;
        const errorMessage = emailOrUsernameExistsResult === 1 ? "Cet email est déjà utilisé" : "Ce nom d'utilisateur est déjà pris";
        const errorField = emailOrUsernameExistsResult === 1 ? email : username;
        const errorElement = emailOrUsernameExistsResult === 1 ? emailErrorMessage : usernameErrorMessage;
        updateFieldStatus(errorField, errorElement, { isValid: false, message: errorMessage });
    }

    if (hasError) {
        applyWizzEffect();
        return;
    }

    if (usernameResult.isValid && emailResult.isValid && passwordResult.isValid) {
        await registerUser();
    }
}

/**
 * Met à jour l'état du champ de formulaire.
 * @param {HTMLElement} field - Le champ de formulaire à mettre à jour.
 * @param {HTMLElement} errorMessage - L'élément de message d'erreur associé.
 * @param {Object} validationResult - Le résultat de la validation.
 * @returns {boolean} True si le champ est invalide, false sinon.
 */
function updateFieldStatus(field, errorMessage, validationResult) {
    const isValid = validationResult.isValid;
    field.parentElement.classList.toggle("error", !isValid);
    if (errorMessage) errorMessage.textContent = isValid ? "" : validationResult.message;
    return !isValid;
}

/**
 * Enregistre un nouvel utilisateur.
 */
async function registerUser() {
    document.querySelector(".success-message").classList.add("show");
    try {
        const hashedPassword = await hash(password.value);
        const token = getToken(16);
        const newUser = {
            username: username.value,
            email: email.value,
            password: hashedPassword,
            token: token
        };
        addUser(newUser);
        resetForm();
        setTimeout(() => {
            document.querySelector(".success-message").classList.remove("show");
            window.location.href = "/login.html";
        }, 3000);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Réinitialise le formulaire d'inscription.
 */
function resetForm() {
    username.value = "";
    email.value = "";
    password.value = "";
    updateStrengthDisplay(-1);
}
