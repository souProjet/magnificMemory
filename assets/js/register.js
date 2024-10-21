import { hash } from "./hash.js";
let username = document.getElementById("username");
let email = document.getElementById("email");
let password = document.getElementById("password");
let submitButton = document.querySelector(".submit-button");
let strengthSections = document.querySelectorAll('.strength-section');
let emailErrorMessage = document.querySelector(".email-error-message");

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 3) - 1;
}

function updateStrengthDisplay(strength) {
    strengthSections.forEach((section, index) => {
        section.setAttribute('data-active', index <= strength ? 'true' : 'false');
    });
}

password.addEventListener('input', function () {
    const strength = getPasswordStrength(this.value);
    updateStrengthDisplay(strength);
});

function validator(type, value) {
    let usernameRegex = /^[a-zA-Z0-9]+$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = false;
    let message = "";

    switch (type) {
        case "username":
            isValid = usernameRegex.test(value);
            message = isValid ? "" : "Nom d'utilisateur invalide";
            return { isValid, message };
        case "email":
            isValid = emailRegex.test(value);
            message = isValid ? "" : "Email invalide";
            return { isValid, message };
        case "password":
            isValid = getPasswordStrength(value) > -1;
            updateStrengthDisplay(getPasswordStrength(value));
            return { isValid, message };
        default:
            return { isValid: false, message: "Erreur" };
    }
}

function emailExists(email) {
    let users = JSON.parse(localStorage.getItem("users") ?? '[]');
    return users.some(user => user.email === email);
}

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let usernameResult = validator("username", username.value);
    let emailResult = validator("email", email.value);
    let passwordResult = validator("password", password.value);

    if (!usernameResult.isValid) {
        username.parentElement.classList.add("error");
    } else {
        username.parentElement.classList.remove("error");
    }

    if (!emailResult.isValid) {
        emailErrorMessage.textContent = emailResult.message;
        email.parentElement.classList.add("error");
    } else {
        email.parentElement.classList.remove("error");
    }
    if (!passwordResult.isValid) {
        password.parentElement.classList.add("error");
    } else {
        password.parentElement.classList.remove("error");
    }

    if (emailExists(email.value)) {
        email.parentElement.classList.add("error");
        emailErrorMessage.textContent = "Cet email est déjà utilisé";
        return;
    }

    if (usernameResult.isValid && emailResult.isValid && passwordResult.isValid) {
        document.querySelector(".success-message").classList.add("show");
        let currentLocalStorage = JSON.parse(localStorage.getItem("users") ?? '[]');
        try {
            let hashedPassword = await hash(password.value);
            let token = getToken(16);
            let newUser =
            {
                username: username.value,
                email: email.value,
                password: hashedPassword,
                token: token
            }
            currentLocalStorage.push(newUser);
            localStorage.setItem("users", JSON.stringify(currentLocalStorage));
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            document.cookie = `token=${token}; path=/; expires=${expirationDate.toUTCString()}`;
            username.value = "";
            email.value = "";
            password.value = "";

            updateStrengthDisplay(-1);

            setTimeout(() => {
                document.querySelector(".success-message").classList.remove("show");
                window.location.href = "/";
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    } else {
        document.querySelector(".success-message").classList.remove("show");
    }
});

function getToken(length) {
    return Math.random().toString(36).substring(2, length + 2);
}
