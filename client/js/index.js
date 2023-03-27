const regForm = document.querySelector("#regForm");
const loginForm = document.querySelector("#loginForm");
const regEmail = document.querySelector("#regForm .email");
const regPass = document.querySelector("#regForm .pass");
const loginEmail = document.querySelector("#loginForm .email");
const loginPass = document.querySelector("#loginForm .pass");
const navLoginBtn = document.querySelector("a[data-target='login']")

const prevToken = JSON.parse(localStorage.getItem("token"));
let currLang = "en"

let userToken = ""
let fetchedNotes = [];

if (prevToken) {
    userToken = prevToken
}

if (userToken) {
    navLoginBtn.dataset.target = "";
    navLoginBtn.dataset.lang = "logout_label";

    navLoginBtn.textContent = "Log Out";
}

function errorHandler(message = 'Please fill out all the inputs!') {
    const errorMsg = document.querySelector('.errorMsg');
    if (errorMsg) {
        errorMsg.remove();
    }
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorMsg');
    errorContainer.textContent = message;
    regForm.parentElement.appendChild(errorContainer);
}

regForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let regEmailVal = regEmail.value;
    let regPassVal = regPass.value;

    if (!regEmailVal || !regPassVal) {
        errorHandler();
        return;
    }

    fetch("https://notifly-api-pzft.onrender.com/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: regEmailVal, password: regPassVal })
    })
        .then(res => res.json())
        .then(data => {
            if (data.hasOwnProperty("message")) {
                errorHandler(data.message)
                return;
            }

            userToken = data.token;
            localStorage.setItem("token", JSON.stringify(userToken))
            navLoginBtn.dataset.target = "";
            navLoginBtn.dataset.lang = "logout_label";

            loadTranslations(currLang)
                .then(translateElements)
                .catch(err => console.error(err));
            const notesNavBtn = document.querySelector("a[data-target='notes']");
            notesNavBtn.click();
            fetchNotes();
            // setTimeout(() => successContainer.remove(), 5000)
        })
        .catch(e => console.log(e))
})


loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let loginEmailVal = loginEmail.value;
    let loginPassVal = loginPass.value;

    if (!loginEmailVal || !loginPassVal) {
        errorHandler();
        return;
    }

    fetch("https://notifly-api-pzft.onrender.com/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: loginEmailVal, password: loginPassVal })
    })
        .then(res => res.json())
        .then(data => {
            if (data.hasOwnProperty("message")) {
                errorHandler(data.message)
                return;
            }
            userToken = data.token;

            localStorage.setItem("token", JSON.stringify(userToken))

            navLoginBtn.dataset.target = "";
            navLoginBtn.dataset.lang = "logout_label";

            loadTranslations(currLang)
                .then(translateElements)
                .catch(err => console.error(err));
            const notesNavBtn = document.querySelector("a[data-target='notes']");
            notesNavBtn.click();
            fetchNotes();
            console.log(data)
            // setTimeout(() => successContainer.remove(), 5000)
        })
})

