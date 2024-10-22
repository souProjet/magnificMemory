const MEMORY_TYPE = localStorage.getItem('memoryType') || "animaux";
const MEMORY_SIZE = localStorage.getItem('memorySize') || "3x4";
const IMG_EXTENSION = localStorage.getItem('imgExtension') || "webp";

const IMG_PATH = '../assets/img/ressources/' + MEMORY_TYPE + '/'; // constante temporaire, par la suite la catégorie du mémoire sera dynamique
const GRID_SIZE = parseInt(MEMORY_SIZE.split('x')[0]) * parseInt(MEMORY_SIZE.split('x')[1]); // nombre de cartes (3 x 4)

let block_click = false;
let returned_cards = [];
const user_message = document.getElementById('user-message');
const reset_btn = document.getElementById('reset-btn');
let nbRounds = 0;
const username = document.getElementById('username');

const successMessageList = [
    "Bien joué !",
    "C'est une paire !",
    "Trouvé !",
    "C'est une paire !",
    "Bien joué !"
]

const errorMessageList = [
    "Non, ce n'est pas une paire",
    "Dommage !",
    "Ce n'est pas une paire",
    "Aïe ! Retente ta chance !"
]

document.addEventListener('DOMContentLoaded', () => {

    const user = retrieveUser();
    if (user !== -1){
        username.textContent = "Bonjour " + user.username + " !";
        username.classList.remove('hidden');
    }
    const memory_cards = document.querySelectorAll('.memory-card');

    memory_cards.forEach(card => {
        card.addEventListener('click', () => {
            if (block_click) return;
            card.classList.toggle('flipped');
            returned_cards.push(card);
            if (returned_cards.length % 2 === 0) {
                block_click = true;
                nbRounds++;
                checkIfPair(returned_cards.slice(-2));
            }
        });
    });
    // l'idée est de gérer le positionnement aléatoire des images pour GRID_SIZE cartes 
    // il y a donc GRID_SIZE/2 paires d'images identiques 
    // les images sont placées dans un tableau qui est mélangé grâce à l'algorithme de Fisher-Yates
    const img_tab = genRandomGrid(GRID_SIZE);
    // on remplit les cartes avec les images
    fillBackgroundImg(img_tab, IMG_PATH, memory_cards);
});

function checkIfPair(cards) {
    if (cards[0].querySelector('.front').style.backgroundImage === cards[1].querySelector('.front').style.backgroundImage) {
        //l'utilisateur a trouvé une paire
        matchFound(cards);
    } else {
        //l'utilisateur a trouvé une mauvaise paire
        matchNotFound(cards);
    }
}

function matchFound(cards) {
    block_click = false;
    user_message.textContent = successMessageList[Math.floor(Math.random() * successMessageList.length)];

    cards[0].classList.add('matched');
    cards[1].classList.add('matched');

    if (returned_cards.length === GRID_SIZE) {
        user_message.textContent = `Bravo ! Tu as trouvé toutes les paires en ${nbRounds} tours !`;
    }

    setTimeout(() => {
        cards[0].classList.remove('matched');
        cards[1].classList.remove('matched');
        if (returned_cards.length !== GRID_SIZE) {
            user_message.textContent = '';
        }
    }, 1000);
}

function matchNotFound(cards) {
    user_message.textContent = errorMessageList[Math.floor(Math.random() * errorMessageList.length)];
    setTimeout(() => {
        cards[0].classList.toggle('flipped');
        cards[1].classList.toggle('flipped');
        returned_cards.splice(0, 2);
        block_click = false;
        user_message.textContent = '';
    }, 1000);
}

function genRandomGrid(grid_size) {
    let img_tab = [];
    for (let i = 1; i <= grid_size / 2; i++) {
        img_tab.push(i);
        img_tab.push(i);
    }
    img_tab = fisherYatesAlgo(img_tab);
    return img_tab;
}

function fisherYatesAlgo(tab) {
    for (let i = tab.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tab[i], tab[j]] = [tab[j], tab[i]];
    }
    console.log(tab);
    return tab;
}

function fillBackgroundImg(img_tab, img_path, memory_cards) {
    let i = 0;
    memory_cards.forEach((card) => {
        card.querySelector('.front').style.backgroundImage = `url(${img_path}${img_tab[i]}.${IMG_EXTENSION})`;
        i++;
    });
}

reset_btn.addEventListener('click', () => {
    window.location.reload();
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        window.location.reload();
    }
});

const logoutButton = document.querySelector(".logout-button");

logoutButton.addEventListener("click", () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
});

function retrieveUser() {
    const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
    const token = tokenCookie ? tokenCookie.split('=')[1] : null;
    if (!token) {
        return -1;
    }

    //search user by token in localStorage
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(user => user.token === token);

    if (!user) {
        return -1;
    }

    return user;
}
