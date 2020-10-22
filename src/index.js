document.addEventListener('DOMContentLoaded', () => {
    const moodDiv = document.querySelector("#all-moods-container")
    const moodList = document.createElement("ul")
    const MOODS_URL = "http://localhost:3000/moods/"
    const ACTIVITIES_URL = 'http://localhost:3000/activities/'
    let actArr = []

    // const background = document.body
    // background.classList.add("background-image")

    function getMoods(){
        const moodsDiv = document.querySelector('#all-moods-container')
        moodsDiv.innerHTML = ""
        fetch(MOODS_URL)
            .then(response => response.json())
            // .then(moods => renderMoods(moods))
            .then(makeChart)
    }

    const renderMoods = (moods) => {
        moodDiv.innerHTML = ' '
        moods.forEach(moodObj => {
            renderMood(moodObj)
        })
    }

    const renderMood = (moodObj) => {
        const moodLi = document.createElement("li")
        const newDate = new Date(moodObj.date)
        const date = newDate.toDateString()
        // let cleanDate = (new Date(date)).toLocaleDateString("en-US", options)
        moodLi.textContent = `Mood: ${moodObj.mood_level} Date: ${date}`
        moodList.append(moodLi)
        moodDiv.append(moodList)
    }


    function submitHandler(){
        document.addEventListener('submit', e => {
            if (e.target.matches("#new-mood-form")){
                e.preventDefault()
                const nowDate = new Date(Date.now())
                const date = nowDate.toISOString()
                const jDate = nowDate.toJSON()
                const form = e.target
                const newMood = {mood_level: parseInt(form.mood.value), date: nowDate, user_id: 1}
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
                    .then(_newMood => 
                        makeChart())

                form.reset()
            } else if (e.target.matches("#new-activity-form")) {
                e.preventDefault()
                const nowDate = new Date(Date.now())
                const form = e.target
                const newAct = {name: form.activity.value, date: nowDate, user_id: 1}

                const options = {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify(newAct)
                }
                fetch(ACTIVITIES_URL, options)
                    .then(response => response.json())
                    .then(getActivities())
                    .then(console.log(actArr[actArr.length]))
                form.reset()
            }
        })
    }

    const renderNewMood = (newMood) => {
        const nowDate = new Date(newMood.date)
        const date = nowDate.toDateString()
        const newMoodList = document.querySelector("#new-moods-list")
        const newMoodLi = document.createElement("li")
        newMoodLi.textContent = `New Mood: ${newMood.mood_level}, Date: ${date}`
        newMoodList.append(newMoodLi)
    }

    const makeChart = () => {
        let moods = fetch(MOODS_URL)
            .then(response => response.json())
            .then(moods => {
                let data = populateData(moods)
                var ctx = document.getElementById('myChart');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Mood Level',
                            fill: false,
                            borderColor: 'blue',
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'time',
                                time: {
                                    displayFormats: {month: "MMM YY"},
                                    unit: "month",
                                    distribution: 'linear',
                                    bounds: "data",
                                    min: "September, 2019",
                                    max: "December, 2020"
                                    },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Time'
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Mood Level'
                                }
                            }]
                        }
                    }
                });
                document.getElementById("myChart").onclick = e => {
                    let activePoints = myChart.getElementsAtEvent(e)
                    if (activePoints.length > 0) {
                        let clickedElementIndex = activePoints[0]["_index"]
                        let label = myChart.data.labels[clickedElementIndex]
                        let value = myChart.data.datasets[0].data[clickedElementIndex]
                        const button = document.createElement("button")
                        button.textContent = "Delete Mood"
                        button.dataset.id = myChart.data.datasets[0].data[clickedElementIndex].id
                        button.classList.add("delete-mood-btn")
                        const editMoodDiv = document.querySelector("#edit-mood-div")
                        editMoodDiv.append(button)
                    }   
                }
            } )

            const populateData = (moods) => {
                let data = []
                for (const mood of moods) {
                    let date = new Date(mood.date)
                    data.push({x: date, y: mood.mood_level, id: mood.id})
                }
                const sortedData = data.sort((a, b) => b.x - a.x)
                return sortedData
            }
        
    }

    function clickHandler(){
        document.addEventListener("click", e => {
            if (e.target.matches(".delete-mood-btn")){
                const button = e.target
                const moodId = button.dataset.id
                const options = {
                    method: "DELETE"
                }
                fetch(MOODS_URL + moodId, options)
                    .then(_data => makeChart())
                button.remove()
            } else if (e.target.matches("#new-act-btn")) {
                const actText = document.querySelector('#random-act-text')
                actText.textContent = actArr[getRandomInt(actArr.length)]
            }
        })
    }
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    const getActivities = () => {
        fetch(ACTIVITIES_URL)
            .then(response => response.json())
            .then(activities => renderActivities(activities))

    }

    const renderActivities = (activities) => {
        const activitiesContainer = document.querySelector('#activities-container')
        const actList = document.createElement("ul")
        for (const activity of activities) {
            actArr.push(activity.name)
        }
        const actText = document.querySelector('#random-act-text')
        actText.textContent = actArr[getRandomInt(actArr.length)]
    }

    // const renderActivity = (activities) => {
    //     // const activitiesContainer = document.querySelector('#activities-container')
    //     // const actList = document.createElement("ul")
    //     // for (const activity in activities){
    //     //     const activityItem = document.createElement('li')
    //     //     console.log(activity)
    //     //     // activityItem.textContent = activity.name
    //     //     // actList.append(activityItem)
    //     // }
    //     //     activitiesContainer.append(actList)
    // }
    // const activityButton = () => {
    //     const renderActButton = document.querySelector('#activity-container')
    //     const activityList = document.createElement('div')
    //     activityList.id = 'activity-list'
    //     const actButton = document.createElement('button')
    //     actButton.innerHTML = 'Click Here to see Activities!'
    //     actButton.addEventListener('click', e => {
    //         getActivities()
    //     })
    //     renderActButton.append(actButton, activityList)
    // }

    clickHandler()
    submitHandler()
    getMoods()
    getActivities()
})
