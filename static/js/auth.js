// REGISTER

const regModal = document.getElementById("regModal")
const regMenuBtn = document.getElementById("bt_register")
const closeModalBtn = document.getElementById("closeRegModal")

if (regMenuBtn){
    regMenuBtn.addEventListener('click', () => regModal.style.display = "block")
    closeModalBtn.addEventListener('click', () => regModal.style.display = "none")

    const regUsernameInput = document.querySelector("#regUsername")
    const regUsernameInputErrors = document.querySelector("#regUsernameErrors")
    const regPasswordInput = document.querySelector("#regPassword")
    const regPasswordInputErrors = document.querySelector("#regPasswordErrors")
    const regButton = document.querySelector("#regButton")

    regButton.addEventListener('click', () => {
        let cond1 = regUsernameInputErrors.textContent.length === 0 && regUsernameInput.value.length > 0
        let cond2 = regPasswordInputErrors.textContent.length === 0 && regPasswordInput.value.length > 0
        if (cond1 && cond2) {
            fetch(`/register`, {
                method: "POST",
                body: JSON.stringify({
                    username: regUsernameInput.value,
                    password: regPasswordInput.value
                })
            })
                .then(() => {
                    let userName = regUsernameInput.value
                    regUsernameInput.value = ''
                    regPasswordInput.value = ''
                    regModal.style.display = "none"
                    alert(`Registration successful! You can now log in ${userName}!`)
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            alert("Invalid data provided!")
        }
    })

    regUsernameInput.addEventListener('input', e => {
        checkLength(e.target, 5, regUsernameInputErrors)
        findUser(e.target, regUsernameInputErrors, `${e.target.value} already exists`, "")
    })

    regPasswordInput.addEventListener('input', e => checkLength(e.target, 8, regPasswordInputErrors))
}

// LOGIN / LOGOUT

const loginMenuBtn = document.querySelector("#bt_login")
const loginModal = document.querySelector("#loginModal")
const closeLoginModalBtn = document.querySelector("#closeLoginModal")

if (loginMenuBtn){
    loginMenuBtn.addEventListener("click", () => loginModal.style.display = "block")
    closeLoginModalBtn.addEventListener("click", () => loginModal.style.display = "none")

    const loginUsernameInput = document.querySelector("#logUsername")
    const loginUsernameError = document.querySelector("#logUsernameErrors")
    const loginPasswordInput = document.querySelector("#logPassword")
    const loginPasswordError = document.querySelector("#logPasswordErrors")
    const loginButton = document.querySelector("#logButton")

    loginButton.addEventListener("click", () => {
        let cond1 = loginUsernameInput.value.length > 0 && loginUsernameError.textContent.length === 0
        let cond2 = loginPasswordInput.value.length > 0 && loginPasswordError.textContent.length === 0

        if (cond1 && cond2) {
            fetch("/login", {
                method: "POST",
                body: JSON.stringify({
                    username: loginUsernameInput.value,
                    password: loginPasswordInput.value
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.logged){
                        alert("Successfully logged in!")
                        window.location.reload()
                    } else{
                        loginPasswordError.textContent = "Wrong password"
                    }
                })
                .catch(err => console.log(err))
        }
    })

    loginUsernameInput.addEventListener("input", e => {
        checkLength(e.target, 5, loginUsernameError)
        findUser(e.target, loginUsernameError, "", `Username "${e.target.value}" not found`)
    })

    loginPasswordInput.addEventListener("input", e => checkLength(e.target, 8, loginPasswordError))
} else {
    const logoutButton = document.querySelector("#bt_logout")

    logoutButton.addEventListener("click", () => {
        console.log("got here")
        fetch("/logout", {
            method: "POST"
        })
            .then(res => res.json())
            .then(data => {
                if (data.loggedOut){
                    alert("Logged out!")
                    window.location.reload()
                } else {
                    alert("Something went wrong, you may not be logged in")
                }
            })
            .catch(err => console.log(err))
    })
}

// HELPER FUNCTIONS

const checkLength = (field, length, errorsContainer) => {
    if (field.value.length < length && field.value.length !== 0) {
        errorsContainer.textContent = `This field needs to be at least ${length} characters long`
    } else {
        errorsContainer.textContent = ""
    }
}

const findUser = (inputContainer, errorContainer, messageFound, messageNotFound) => {
    if (errorContainer.textContent.length === 0 && inputContainer.value.length > 0) {
        fetch(`/user/${inputContainer.value}`)
            .then(res => res.json())
            .then(data => {
                if (data && data[0].username){
                    errorContainer.textContent = messageFound
                } else {
                    errorContainer.textContent = messageNotFound
                }
        })
            .catch(err => console.log(err))
    }
}