/**
 * Sauvegarde le score d'un joueur dans le stockage local.
 * @param {Object|number} user - L'objet utilisateur ou -1 si anonyme.
 * @param {number} nbRounds - Le nombre de tours effectués.
 * @param {string} memory_size - La taille de la grille (ex: "3x4").
 * @param {string} memory_type_name - Le type de mémoire joué.
 */
export function saveScore(user, nbRounds, memory_size, memory_type_name) {
    const pseudo = user !== -1 ? user.username : "Anonyme";
    const score = nbRounds;
    const gridSize = memory_size;
    const gridType = memory_type_name;
    const date = new Date().toISOString();

    const scoreData = { pseudo, score, gridSize, gridType, date };

    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(scoreData);
    localStorage.setItem('scores', JSON.stringify(scores));
}

/**
 * Affiche les 5 meilleurs scores dans l'interface utilisateur.
 * Les scores sont triés selon un ratio calculé (taille de la grille / score).
 */
export function displayBestScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    // Calculer le ratio pour chaque score
    scores.forEach(score => {
        const [rows, cols] = score.gridSize.split('x').map(Number);
        const gridSize = rows * cols;
        score.ratio = gridSize / score.score;
    });

    // Trier les scores du plus grand ratio au plus petit (meilleur au pire)
    scores.sort((a, b) => b.ratio - a.ratio);

    // Prendre les 5 meilleurs scores
    const topScores = scores.slice(0, 5);

    const scoreList = document.querySelector('#best-scores');
    scoreList.innerHTML = ''; // Vider la liste existante

    topScores.forEach(score => {
        const li = document.createElement('li');
        li.className = 'border-b pb-2';
        li.innerHTML = `
            <p class="font-semibold">${score.pseudo}</p>
            <p class="text-sm">Score: ${score.score} | Grille: ${score.gridSize}</p>
            <p class="text-sm">Type: ${score.gridType} | <date>${formatDate(score.date)}</date></p>
        `;
        scoreList.appendChild(li);
    });

    // Si moins de 5 scores, ajouter des éléments vides
    for (let i = topScores.length; i < 5; i++) {
        const li = document.createElement('li');
        li.className = 'border-b pb-2';
        li.innerHTML = '<p class="font-semibold">-</p><p class="text-sm">-</p><p class="text-sm">-</p><p class="text-sm">-</p>';
        scoreList.appendChild(li);
    }
}

/**
 * Formate une date en chaîne de caractères lisible.
 * @param {string} date - La date au format ISO à formater.
 * @returns {string} La date formatée (ex: "le 1er janvier 2024 à 12h00").
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
}