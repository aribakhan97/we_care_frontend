document.addEventListener('DOMContentLoaded', () => {
    const moodDiv = document.querySelector("#all-moods-container")
    const moodList = document.createElement("ul")
    const MOODS_URL = "http://localhost:3000/moods/"

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

    // const displayMoodButton = () => {
    //     const moodButtonDiv = document.querySelector('#moodButton')
    //     for (i = 1; i < 11; i++) {
    //         var moodButton = document.createElement('button')
    //         moodButton.innerHTML = i 
    //         moodButton.addEventListener('click', (e) => {
    //             console.log(e.target.innerHTML)
    //             // do post to /mood with button value as a mood level
    //             const data = {mood_level: e.target.innerHTML, user_id: 1}

    //             fetch(MOODS_URL, {
    //                 method: 'POST', 
    //                 headers: {
    //                 'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(data),
    //             })
    //             .then(() => getMoods())
    //         })
    //         moodButtonDiv.append(moodButton)
    //     }
    // }
    
    // function clickHandler({
        
    // })

    function submitHandler(){
        document.addEventListener('submit', e => {
            if (e.target.matches("#new-mood-form")){
                e.preventDefault()
                const form = e.target
                const newMood = {mood_level: parseInt(form.mood.value), user_id: 1}
                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify(newMood)
                }
                fetch(MOODS_URL, options)
                    .then(response => response.json())
                    .then(newMood => renderNewMood(newMood))

                form.reset()
            }
        })
    }

    const renderNewMood = (newMood) => {
        const newMoodList = document.querySelector("#new-moods-list")
        const newMoodLi = document.createElement("li")
        newMoodLi.textContent = `New Mood: ${newMood.mood_level}`
        newMoodList.append(newMoodLi)
    }
    // clickHandler()
    submitHandler()
    getMoods()
})
