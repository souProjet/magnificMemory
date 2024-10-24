/**
 * Valide le nom d'utilisateur.
 * @param {string} username - Le nom d'utilisateur à valider.
 * @returns {Object} Un objet contenant la validité et le message d'erreur.
 */
export function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return {
        isValid: usernameRegex.test(username),
        message: usernameRegex.test(username) ? "" : "Nom d'utilisateur invalide"
    };
}

/**
 * Valide l'email.
 * @param {string} email - L'email à valider.
 * @returns {Object} Un objet contenant la validité et le message d'erreur.
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
        isValid: emailRegex.test(email),
        message: emailRegex.test(email) ? "" : "Email invalide"
    };
}

/**
 * Valide le mot de passe.
 * @param {string} password - Le mot de passe à valider.
 * @returns {Object} Un objet contenant la validité et le message d'erreur.
 */
export function validatePassword(password) {
    const isValid = password.length >= 6 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) && /[A-Za-z]/.test(password);
    return {
        isValid,
        message: isValid ? "" : "Le mot de passe doit contenir au moins 6 caractères, un chiffre, un symbole et des lettres"
    };
}

/**
 * Valide la confirmation du mot de passe.
 * @param {string} password - Le mot de passe original.
 * @param {string} confirmPassword - Le mot de passe de confirmation.
 * @returns {Object} Un objet contenant la validité et le message d'erreur.
 */
export function validateConfirmPassword(password, confirmPassword) {
    return {
        isValid: password === confirmPassword,
        message: password === confirmPassword ? "" : "Les mots de passe ne correspondent pas"
    };
}