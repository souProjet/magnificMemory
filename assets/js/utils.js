/**
 * Formate une date en chaîne de caractères lisible.
 * @param {Date|string} date - La date à formater.
 * @returns {string} La date formatée (ex: "1 janvier 2024 à 12:00").
 */
export function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
}

/**
 * Remplit les options de taille de mémoire dans un élément select.
 * @param {string[]} config - Tableau des configurations de taille disponibles.
 * @param {HTMLSelectElement} memorySize - L'élément select à remplir.
 */
export function fillMemorySizeOptions(config, memorySize) {
    memorySize.innerHTML = "";
    for (let i = 0; i < config.length; i++) {
        memorySize.innerHTML += `<option value="${config[i]}">${config[i]}</option>`;
    }
}

/**
 * Génère toutes les configurations de grille possibles pour un nombre donné d'éléments.
 * @param {number} nbItem - Nombre d'éléments uniques dans le jeu.
 * @returns {string[]} Tableau des configurations de grille possibles.
 */
export function getAllConfigFromNbItem(nbItem) {
    let config = [];
    for (let n = 3; n * n <= nbItem * 2; n++) {
        if (n * n <= nbItem * 2 && (n * n) % 2 === 0) {
            config.push(`${n}x${n}`);
        }
        if (n * (n + 1) <= nbItem * 2 && (n * (n + 1)) % 2 === 0) {
            config.push(`${n}x${n+1}`);
            config.push(`${n+1}x${n}`);
        }
    }
    let lastConfig = localStorage.getItem('memorySize');
    let newActiveSize = config.includes(lastConfig) ? lastConfig : config[0];

    localStorage.setItem('memorySize', newActiveSize);
    return config;
}

/**
 * Génère un token aléatoire de la longueur spécifiée.
 * @param {number} length - La longueur du token à générer.
 * @returns {string} Le token généré.
 */
export function getToken(length) {
    return Math.random().toString(36).substring(2, length + 2);
}


/**
 * Applique un effet de tremblement au corps du document.
 * Ajoute la classe 'wizz' au corps, puis la retire après 500 millisecondes.
 */
export function applyWizzEffect() {
    const body = document.body;
    body.classList.add('wizz');
    setTimeout(() => {
        body.classList.remove('wizz');
    }, 500);
}