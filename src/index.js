document.addEventListener('DOMContentLoaded', () => {
    const moodDiv = document.querySelector("#moods-container")
    const moodList = document.createElement("ul")
    const MOODS_URL = "http://localhost:3000/moods"

    function getMoods(){
        fetch(MOODS_URL)
            .then(response => response.json())
            .then(moods => renderMoods(moods))
    }

    const renderMoods = (moods) => {
        moods.forEach(moodObj => {
            renderMood(moodObj)
        })
    }

    const renderMood = (moodObj) => {
        const moodLi = document.createElement("li")
        moodLi.textContent = `Mood: ${moodObj.mood_level}, User: ${moodObj.user.name}`
        moodList.append(moodLi)
        moodDiv.append(moodList)
    }

    getMoods()
})
