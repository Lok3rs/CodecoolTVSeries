const addEpisodeBtn = document.querySelector(".add-icon")
const addEpisodeFormWrapper = document.querySelector("#addEpisodeFormWrapper")
const closeAddEpisodeBtn = document.querySelector("#closeAddEpisodeBtn")
const seasonIdHiddenInput = document.querySelector("#seasonNumber")
const episodeNumberInput = document.querySelector("#episodeNumber")
const episodeTitleInput = document.querySelector("#episodeTitle")
const episodeOverviewInput = document.querySelector("#episodeOverview")
const episodeSubmitBtn = document.querySelector("#episodeSubmit")
addEpisodeFormWrapper.style.display = "none"

addEpisodeBtn.addEventListener("click", e => {
    setDisplay("block", addEpisodeFormWrapper)
    setDisplay("none", addEpisodeBtn)
})

closeAddEpisodeBtn.addEventListener("click", () => {
    setDisplay("block", addEpisodeBtn)
    setDisplay("none", addEpisodeFormWrapper)
})

episodeNumberInput.addEventListener("input", e => {
    const minInputValue = e.target.attributes.min.value
    const maxInputValue = e.target.attributes.max.value

    if (e.target.value < minInputValue) e.target.value = minInputValue
    else if (e.target.value > maxInputValue) e.target.value = maxInputValue
})

episodeSubmitBtn.addEventListener("click", e => {
    e.preventDefault()
    checkTitleLength()
    fetch("/add_episode", {
        method: "POST",
        body: JSON.stringify({
            season_id: seasonIdHiddenInput.value,
            episode_number: episodeNumberInput.value,
            title: episodeTitleInput.value,
            overview: episodeOverviewInput.value
        })
    })
        .then(res => res.json())
        .then(data => {
            const episodesList = document.querySelector(".episodes-list")
            if (data.added) {
                let newEpisodeLi = document.createElement("li")
                let newEpisodeA = document.createElement("a")
                newEpisodeA.setAttribute("href", "#")
                newEpisodeLi.appendChild(newEpisodeA)
                episodesList.appendChild(newEpisodeLi)
            }
        })
})


const setDisplay = (display, ...elements) => elements.forEach(el => el.style.display = display)


const checkTitleLength = () => {
    const titleErrorContainer = document.querySelector("#episodeTitleErrors")
    const minTitleLength = 5

    if (episodeTitleInput.value.length < minTitleLength)
        titleErrorContainer.innerHTML = "Too short, at least 5 characters"
    else
        titleErrorContainer.innerHTML = ''
}
