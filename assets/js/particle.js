let canvas, ctx;
let particles = [];

export function initParticlesSystem() {
    createCanvas();
}

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


class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

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
