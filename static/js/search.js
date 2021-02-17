const searchInput = document.querySelector("#searchMovie")
const resultDiv = document.querySelector("#searchResult")

searchInput.addEventListener("input", function (e) {
    const dbUrl = `http://127.0.0.1:5000/shows/${e.target.value}`
    fetch(dbUrl)
        .then(res => {
            if (!res.ok) throw new Error(`Status Code Error: ${res.status}`)

            return res.json()
        })
        .then(data => {
            resultDiv.innerHTML = ``
            let resultContainer = document.createElement("ul")
            for (let result of data.slice(0, 30)){
                let resLi = document.createElement("li")
                let aTag = document.createElement("a")
                aTag.setAttribute("href", `show/${result.id}`)
                aTag.textContent = result.title
                resLi.appendChild(aTag)
                resultContainer.appendChild(resLi)
            }
            if (data.length === 0){
                console.log("works")
            }
            resultDiv.appendChild(resultContainer)
        })
        .catch(() => {
            resultDiv.innerHTML = ``
        })
})