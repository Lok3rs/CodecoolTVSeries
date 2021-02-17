const showSelect = document.querySelector("#showSelect")
const showSeasonInput = document.querySelector("#showSeason")
const showEpisodeInput = document.querySelector("#showEpisode")
const showTitleInput = document.querySelector("#showTitle")
const showOverviewInput = document.querySelector("#showOverview")
const submitBtn = document.querySelector("#showEditSubmit")

showSelect.addEventListener("change", e => {
    fetchApiGet(`/get_seasons/${e.target.value}`, selectShowInputChange)
})


showSeasonInput.addEventListener("change", e => {
    fetchApiGet(`/get_episodes/${e.target.value}`, selectSeasonInputChange)
})

showEpisodeInput.addEventListener("change", e => {
    fetchApiGet(`/get_episode/${e.target.value}`, selectEpisodeInputChange)
})

showTitleInput.addEventListener("input", () => unable(submitBtn))
showOverviewInput.addEventListener("input", () => unable(submitBtn))

submitBtn.addEventListener("click", e => {
    e.preventDefault()
    fetchApiPost("/update_episode", checkIfUpdated, {
            episode_id: showEpisodeInput.value,
            title: showTitleInput.value,
            overview: showOverviewInput.value
        })
})

const fetchApiGet = (url, callback) => {
    fetch(url)
        .then(res => res.json())
        .then(data  => callback(data))
        .catch(err => console.log(err))
}

const fetchApiPost = (url, callback, body) => {
    fetch(url, {
        method: "POST",
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.log(err))
}

const selectShowInputChange = data => {
    unable(showSeasonInput)
    showSeasonInput.innerHTML = "<option disabled selected value> -- Select Season -- </option>"
    createOptions(showSeasonInput, data, "seasons")
    disable(showEpisodeInput, showTitleInput, showOverviewInput, submitBtn)
}

const selectSeasonInputChange = data => {
    unable(showEpisodeInput)
    showEpisodeInput.innerHTML = "<option disabled selected value> -- Select Episode -- </option>"
    createOptions(showEpisodeInput, data, "episodes")
    disable(showTitleInput, showOverviewInput, submitBtn)
}

const selectEpisodeInputChange = data => {
    unable(showTitleInput, showOverviewInput)
    showTitleInput.value = data.title
    showOverviewInput.value = data.overview
    disable(submitBtn)
}

const createOptions = (parent, data, type) => {
    data.forEach(el => {
        let new_option = document.createElement("option")
        new_option.setAttribute("value", el.id)
        if (type === "episodes") new_option.innerText = el.episode_number
        else if (type === "seasons") new_option.innerText = el.season_number
        parent.appendChild(new_option)
    })
}


const checkIfUpdated = data => {
    if (data.updated) {
        alert("Episode updated successfully!")
        disable(showSeasonInput, showEpisodeInput, showTitleInput, showOverviewInput, submitBtn)
    } else {
        alert("Something went wrong. Try again.")
    }
}

const disable = (...args) => args.forEach((arg) => arg.disabled = true)

const unable = (...args) => args.forEach((arg) => arg.disabled = false)
