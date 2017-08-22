(function() {
    const locationsAPIEnpoint = `https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json`
    const locationInput = document.getElementsByName("location")[0]
    const listOfLocations = document.getElementsByClassName("list")[0]
    let locationQuery = ""

    locationInput.addEventListener("keyup", handleLocationInputChange)

    function handleLocationInputChange(e) {
        locationQuery = locationInput.value.toLowerCase()

        if (locationQuery === "") {
            renderDefaultListView()
            return
        }

        fetchLocations()
            .then(res => res.json())
            .then(locations => locations.filter(filterLocations))
            .then(locations => locations.map(location => createListItem(location)))
            .then(list => createList(list))
            .catch(err => console.log(err))
    }

    function fetchLocations() {
        return fetch(locationsAPIEnpoint)
    }

    function filterLocations(location) {
        let city = location.city.toLowerCase()
        let state = location.state.toLowerCase()

        return city.startsWith(locationQuery) || state.startsWith(locationQuery)
    }

    function createListItem(location) {
        let listItem = document.createElement("li")
        let city = hightlightText(location.city)
        let state = hightlightText(location.state)
        let population = addCommas(location.population)

        listItem.classList.add("list-item")
        listItem.innerHTML = `
            ${city}, ${state} <span class="population">${population}</span>
        `

        return listItem
    }

    function addCommas(number) {
        number = Array.from(number)
        console.log("NUMBER:", number)
        return number.reduce((newNum, curNum, index) => {
            console.log(index, index % 3, newNum, curNum)
            return (index > 0 && index % 3 === 0) ? newNum += `,${curNum}` : newNum += curNum
        }, "")
    }

    function hightlightText(text) {
        let textToMatch = new RegExp(locationQuery, "gi")
        return text.replace(textToMatch, `<span class="highlight">${locationQuery}</span>`)
    }

    function createList(locations) {
        listOfLocations.innerHTML = ""
        locations.forEach(location => listOfLocations.appendChild(location))
    }

    function renderDefaultListView() {
        listOfLocations.innerHTML = `
            <li class="list-item">Enter A City</li>
            <li class="list-item">Or State</li>
        `
    }
})()
