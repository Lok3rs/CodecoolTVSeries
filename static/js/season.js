const addEpisodeBtn = document.querySelector(".add-icon")
const addEpisodeFormWrapper = document.querySelector("#addEpisodeFormWrapper")
const closeAddEpisodeBtn = document.querySelector("#closeAddEpisodeBtn")
addEpisodeFormWrapper.style.display = "none"

addEpisodeBtn.addEventListener("click", e => {
    addEpisodeBtn.style.display = "none"
    addEpisodeFormWrapper.style.display = "block"
})

closeAddEpisodeBtn.addEventListener("click", () => {
    addEpisodeBtn.style.display = "block"
    addEpisodeFormWrapper.style.display = "none"
})