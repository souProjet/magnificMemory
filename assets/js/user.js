/**
 * Récupère les informations de l'utilisateur à partir du token stocké dans les cookies.
 * @returns {Object|number} L'objet utilisateur si trouvé, -1 sinon.
 */
export function retrieveUser() {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    if (!token) {
        return -1;
    }

    // Recherche l'utilisateur par token dans le localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.token === token);

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