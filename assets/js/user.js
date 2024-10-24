/**
 * Récupère les informations de l'utilisateur à partir du token stocké dans les cookies.
 * @returns {Object|number} L'objet utilisateur si trouvé, -1 sinon.
 */
export function retrieveUser() {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    if (!token) {
        updateAuthButtons(-1);
        return -1;
    }

    // Recherche l'utilisateur par token dans le localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.token === token);

    updateAuthButtons(user);

    if (!user) {
        return -1;
    }

    return user;
}

/**
 * Déconnecte l'utilisateur en supprimant le token des cookies et redirige vers la page d'accueil.
 */
export function logout(){
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
}


/**
 * Vérifie si un email ou un nom d'utilisateur existe déjà dans le localStorage.
 * @param {string} email - L'email à vérifier.
 * @param {string} username - Le nom d'utilisateur à vérifier.
 * @returns {number} 1 si l'email existe, 2 si le nom d'utilisateur existe, -1 sinon.
 */
export function emailOrUsernameExists(email, username) {
    let users = JSON.parse(localStorage.getItem("users") ?? '[]');
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        return 1;
    }
    if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
        return 2;
    }
    return -1;
}

/**
 * Ajoute un nouvel utilisateur dans le localStorage.
 * @param {Object} newUser - L'objet utilisateur à ajouter.
 */
export function addUser(newUser) {
    let users = JSON.parse(localStorage.getItem("users") ?? '[]');
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
}

/**
 * Récupère un utilisateur par son email depuis le localStorage.
 * @param {string} email - L'email de l'utilisateur à rechercher.
 * @returns {Object|undefined} L'utilisateur correspondant à l'email, ou undefined s'il n'est pas trouvé.
 */
export function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem("users") ?? '[]');
    return users.find(user => user.email === email);
}

/**
 * Définit un cookie avec un nom, une valeur et une durée d'expiration en jours.
 * @param {string} name - Le nom du cookie.
 * @param {string} value - La valeur du cookie.
 * @param {number} days - Le nombre de jours avant l'expiration du cookie.
 */
export function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${name}=${value}; path=/; expires=${expirationDate.toUTCString()}`;
}

/**
 * Met à jour l'affichage des boutons de connexion et de déconnexion en fonction de l'état de connexion de l'utilisateur.
 * @param {number} user - L'utilisateur à vérifier.
 */
export function updateAuthButtons(user) {
    const loginButton = document.querySelector(".nav-button[href='/login.html']");
    const registerButton = document.querySelector(".nav-button[href='/register.html']");
    const logoutButton = document.querySelector(".logout-button");
    if (user !== -1) {
        // L'utilisateur est connecté
        if (loginButton) loginButton.style.display = 'none';
        if (registerButton) registerButton.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        // L'utilisateur n'est pas connecté
        if (loginButton) loginButton.style.display = 'block';
        if (registerButton) registerButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}
