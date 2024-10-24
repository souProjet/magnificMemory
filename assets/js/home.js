import { logout, retrieveUser } from "./user.js";

const logoutButton = document.querySelector(".logout-button");
const username = document.getElementById('username');

/**
 * Initialise l'affichage du nom d'utilisateur et ajoute l'écouteur d'événement pour la déconnexion.
 */
function init() {
    logoutButton.addEventListener("click", logout);

    document.addEventListener('DOMContentLoaded', () => {
        const user = retrieveUser();
        if (user !== -1) {
            afficherNomUtilisateur(user.username);
        }
    });
}

/**
 * Affiche le nom d'utilisateur et rend l'élément visible.
 * @param {string} nomUtilisateur - Le nom de l'utilisateur à afficher.
 */
function afficherNomUtilisateur(nomUtilisateur) {
    username.textContent = "Bonjour " + nomUtilisateur + " !";
    username.classList.remove('hidden');
}

init();
