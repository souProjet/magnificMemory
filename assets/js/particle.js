/**
 * Le canvas et le contexte 2D pour dessiner les particules.
 * @type {HTMLCanvasElement|null}
 */
let canvas;

/**
 * Le contexte 2D du canvas.
 * @type {CanvasRenderingContext2D|null}
 */
let ctx;

/**
 * Tableau contenant toutes les particules actives.
 * @type {Particle[]}
 */
let particles = [];

/**
 * Initialise le système de particules en créant le canvas.
 */
export function initParticlesSystem() {
    createCanvas();
}

/**
 * Crée le canvas pour le système de particules et l'ajoute au DOM.
 */
function createCanvas() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);
}

/**
 * Représente une particule dans le système.
 */
class Particle {
    /**
     * Crée une nouvelle particule.
     * @param {number} x - La position x initiale de la particule.
     * @param {number} y - La position y initiale de la particule.
     * @param {string} color - La couleur de la particule.
     */
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    /**
     * Met à jour la position et la taille de la particule.
     */
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
    }

    /**
     * Dessine la particule sur le canvas.
     */
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Crée des particules de succès basées sur l'image de la carte.
 * @param {HTMLElement} card - L'élément de carte à partir duquel créer les particules.
 */
export function createSuccessParticles(card) {
    const rect = card.getBoundingClientRect();
    const frontElement = card.querySelector('.front');
    const computedStyle = window.getComputedStyle(frontElement);
    const backgroundImage = computedStyle.getPropertyValue('background-image');
    const img = new Image();
    img.src = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

    img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = rect.width;
        tempCanvas.height = rect.height;
        tempCtx.drawImage(img, 0, 0, rect.width, rect.height);

        const imageData = tempCtx.getImageData(0, 0, rect.width, rect.height);
        for (let y = 0; y < rect.height; y += 5) {
            for (let x = 0; x < rect.width; x += 5) {
                const index = (y * rect.width + x) * 4;
                const r = imageData.data[index];
                const g = imageData.data[index + 1];
                const b = imageData.data[index + 2];
                const color = `rgb(${r},${g},${b})`;
                particles.push(new Particle(rect.left + x, rect.top + y, color));
            }
        }
        animateParticles();
    };
}

/**
 * Crée des particules d'erreur autour de la carte.
 * @param {HTMLElement} card - L'élément de carte à partir duquel créer les particules.
 */
export function createErrorParticles(card) {
    const rect = card.getBoundingClientRect();
    const errorColors = ['#FF0000', '#FF3333', '#FF6666', '#FF9999']; // Nuances de rouge

    // Créer un effet de "flash" rouge
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.left = `${rect.left}px`;
    flash.style.top = `${rect.top}px`;
    flash.style.width = `${rect.width}px`;
    flash.style.height = `${rect.height}px`;
    flash.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    flash.style.zIndex = '1000';
    document.body.appendChild(flash);

    // Animation du flash
    setTimeout(() => {
        flash.style.transition = 'opacity 0.5s';
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 500);
    }, 100);

    // Créer des particules qui "explosent" depuis le centre de la carte
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const x = centerX + Math.cos(angle) * 10; // Commencer légèrement à l'extérieur du centre
        const y = centerY + Math.sin(angle) * 10;
        const color = errorColors[Math.floor(Math.random() * errorColors.length)];
        const particle = new Particle(x, y, color);
        particle.speedX = Math.cos(angle) * speed;
        particle.speedY = Math.sin(angle) * speed;
        particles.push(particle);
    }
}

/**
 * Anime toutes les particules actives.
 */
export function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.1) {
            particles.splice(i, 1);
            i--;
        }
    }
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}


/**
 * Réinitialise le système de particules en vidant le tableau de particules.
 * Cette fonction est utilisée pour nettoyer toutes les particules existantes,
 * généralement appelée lors du redémarrage du jeu ou du changement de niveau.
 */
export function resetParticlesSystem() {
    particles = [];
}