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
        moodDiv.innerHTML = ' '
        moods.forEach(moodObj => {
            renderMood(moodObj)
        })
    }

    const renderMood = (moodObj) => {
        const moodLi = document.createElement("li")
        moodLi.textContent = `Mood: ${moodObj.mood_level} Date: ${moodObj.created_at}`
        moodList.append(moodLi)
        moodDiv.append(moodList)
    }

    const displayMoodButton = () => {
        const moodButtonDiv = document.querySelector('#moodButton')
        for (i = 1; i < 11; i++) {
            var moodButton = document.createElement('button')
            moodButton.innerHTML = i 
            moodButton.addEventListener('click', (e) => {
                console.log(e.target.innerHTML)
                // do post to /mood with button value as a mood level
                const data = {mood_level: e.target.innerHTML, user_id: 1}

                fetch(MOODS_URL, {
                    method: 'POST', 
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(() => getMoods())
            })
            moodButtonDiv.append(moodButton)
        }
    }

    getMoods()
    displayMoodButton()
})
