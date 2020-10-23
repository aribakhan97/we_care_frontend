document.addEventListener('DOMContentLoaded', () => {
    const moodDiv = document.querySelector("#all-moods-container")
    const moodList = document.createElement("ul")
    const MOODS_URL = "http://localhost:3000/moods/"
    const ACTIVITIES_URL = 'http://localhost:3000/activities/'
    const MAIN_USER_URL = "http://localhost:3000/users/1"
    let actArr = []
    

    // const background = document.body
    // background.classList.add("background-image")

    function getMoods(){
        const moodsDiv = document.querySelector('#all-moods-container')
        moodsDiv.innerHTML = ""
        fetch(MAIN_USER_URL)
            .then(response => response.json())
            .then(user => renderMoods(user.moods))
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
                    .then(_activity =>
                        makeChart()
                        )
    
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
        let moods = fetch(MAIN_USER_URL)
            .then(response => response.json())
            .then(user => {
                let moodsArr = user.moods
                let activitiesArr = user.activities
                let moodData = populateData(moodsArr)
                let activityData = populateData(activitiesArr)
                var ctx = document.getElementById('myChart');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Mood Level',
                            fill: false,
                            borderColor: 'blue',
                            data: moodData,
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
                            borderWidth: 2
                        }, 
                        {
                                label: 'Activities',
                                fill: false,
                                borderColor: 'blue',
                                data: activityData,
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
                                borderWidth: 2
                        }
                    ]
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

            const populateData = (arr) => {
                let actData = []
                if (arr[0].mood_level) {
                    let data = []
                    for (const mood of arr) {
                        let date = new Date(mood.date)
                        data.push({ x: date, y: mood.mood_level, id: mood.id })
                    }
                    const sortedData = data.sort((a, b) => b.x - a.x)
                    return sortedData
                } else if (arr[0].name) {
                    for (const activity of arr){
                        let result
                        let date = new Date(activity.date)
                        let goodDate = date.toLocaleDateString()
                        if ((actData.find((obj) => obj.x == goodDate)) == undefined) {
                            actData.push({ x: goodDate, y: 1, id: activity.id })
                        } else {
                            result = actData.find((obj) => obj.x == goodDate)
                            result.y++
                        }
                    }
                    for (const act of actData){
                        act.x = new Date(act.x)
                    }
                    const sortedActData = actData.sort((a, b) => b.x-a.x)
                    return sortedActData
                    // const sortByYear = data.sort((a, b) =>{
                    //     return parseInt(b.x.split("/")[2]) - parseInt(a.x.split("/")[2])
                    // })
                    // const sortByMonth = sortByYear.sort((a, b) =>{
                    //     return parseInt(b.x.split("/")[0]) - parseInt(a.x.split("/")[0])
                    // })
                    // const sortByDay = sortByMonth.sort((a, b) => {
                    //     return parseInt(b.x.split("/")[1]) - parseInt(a.x.split("/")[1])
                    // })
                    // console.log(sortByDay)
                    // const sortedData = data.sort(function (a, b) {
                    //     parseInt(b.x.split("/")[2] + b.x.split("/")[0] + b.x.split("/")[1]) -
                    //     parseInt(a.x.split("/")[2] + a.x.split("/")[0] + a.x.split("/")[1])
                    // })
                    // console.log(parseInt(data[0].x.split("/")[2] + data[0].x.split("/")[0] + data[0].x.split("/")[1]))
                    // console.log(sortedData)
                    // return sortedData
                }
            }
        
    }
    function dateToNum(d) {
        d = d.split("/"); return Number(d[2] + d[0] + d[1])
    }

    function getOccurrence(array, value) {
        let counter = 0
        for (i = 0; i < array.length; i++) {
            if (array[i].date == value) { counter++ }
        }
        return counter
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
        actArr = []
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

    const createLogin = () => {
        const loginDiv = document.querySelector('#login-container')
        const loginTitle = document.createElement('h1')
        loginTitle.innerHTML = 'Welcome to WeCare!'
        const loginSubtitle = document.createElement('h4')
        loginSubtitle.innerHTML = 'We aspire to help individuals of all backgrounds to achieve wellness of the mind, body, and soul. It is never too late to start taking care of yourself. Please login to continue.'


        var form = document.createElement("form");

        var user = document.createElement("input");
        user.setAttribute("type", "text");
        user.setAttribute("name", "Username");
        user.setAttribute("placeholder", "Username");


        var pwd = document.createElement("input");
        pwd.setAttribute("type", "text");
        pwd.setAttribute("name", "Password");
        pwd.setAttribute("placeholder", "Password");

        var s = document.createElement("input");
        s.setAttribute("type", "submit");
        s.setAttribute("value", "Submit");

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            handleLogin(e)
        })

        form.append(user, pwd, s)

        loginDiv.append(loginTitle, loginSubtitle, form)

    }
    const handleLogin = (e) => {
        const username = e.target.elements.Username.value
        const password = e.target.elements.Password.value
        if (username === 'Sean_Padden' && password === '1234') {
            isUserLoggedIn = true
            const LoginDiv = document.querySelector('#login-container')
            LoginDiv.innerHTML = ' '
            renderApp()
        }
    }
    const getQuotes = () => {
        const quotesUrl = 'https://type.fit/api/quotes'
        return fetch(quotesUrl)
            .then(response => response.json())
            .then(data => {
                const rand = Math.floor(Math.random() * data.length)
                return data[rand]
            })
    }
    const displayQuotes = async () => {
        const quote = await getQuotes()
        const quoteDiv = document.createElement('div')
        quoteDiv.id = 'quote-div'
        const quoteText = document.createElement('h2')
        quoteText.innerHTML = quote.text

        const authorText = document.createElement('h3')
        authorText.innerHTML = '-' + quote.author

        quoteDiv.append(quoteText, authorText)
        moodDiv.append(quoteDiv)
    }

    const getMoodBoosterPic = () => {
        return fetch('https://random.dog/woof.json')
            .then(response => response.json())
    }

    const showPic = () => {
        getMoodBoosterPic()
            .then(data => {
                const imgDiv = document.querySelector('#mood-booster-img')
                imgDiv.innerHTML = ' '
                const dataUrl = data.url.toLowerCase()
                if (dataUrl.endsWith('jpg') || dataUrl.endsWith('gif') || dataUrl.endsWith('png') || dataUrl.endsWith('jpeg')) {
                    const img = document.createElement('img')
                    img.src = data.url
                    img.width = 500
                    img.height = 600
                    imgDiv.append(img)
                }
                else {
                    const video = document.createElement('video')
                    video.width = 500
                    video.height = 600
                    video.autoplay = true
                    const videoSrc = document.createElement('source')
                    videoSrc.src = data.url
                    video.appendChild(videoSrc)
                    imgDiv.append(video)
                }
            })
    }

    const instantMoodBoost = () => {
        const mbDiv = document.createElement('div')
        mbDiv.id = 'mood-booster-div'
        const imgDiv = document.createElement('div')
        imgDiv.id = 'mood-booster-img'
        const moodBoostButton = document.createElement('button')
        moodBoostButton.innerHTML = 'Click Here for an INSTANT MOOD BOOST!'
        moodBoostButton.addEventListener('click', e => {
            showPic()
        })
        mbDiv.append(moodBoostButton, imgDiv)

        moodDiv.appendChild(mbDiv)

    }

    var isUserLoggedIn = false
    const renderApp = () => {
        if (isUserLoggedIn === true) {
            instantMoodBoost()
            //getMoods()
            // displayMoodButton()
            displayQuotes()
            // activityButton()
            hotlineButton()
        }
        else {
            createLogin()
        }
    }
    const hotlineButton = () => {
        const rendenrHotButton = document.querySelector('#hotline-container')
        const hotlineList = document.createElement('div')
        const hotButton = document.createElement('button')
        hotButton.innerHTML = 'Emergency? Click Here for Immediate Help.'
        hotButton.addEventListener('click', e => {

            const emergency = document.createElement('h4')
            emergency.innerHTML = 'The Nationwide Emergency Number in the U.S. is 911'

            const suicideHotline = document.createElement('h4')
            suicideHotline.innerHTML = 'National Suicide Prevention Lifeline: 800-273-8255'

            const crisisText = document.createElement('h4')
            crisisText.innerHTML = 'Crisis Text Line Text “HELLO” to 741741'

            hotlineList.append(emergency, xsuicideHotline, crisisText)
            rendenrHotButton.append(hotlineList)

        })
        rendenrHotButton.append(hotButton)
    }
    const modalTriggers = document.querySelectorAll('.popup-trigger')
    const modalCloseTrigger = document.querySelector('.popup-modal__close')
    const bodyBlackout = document.querySelector('.body-blackout')
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const { popupTrigger } = trigger.dataset
            const popupModal = document.querySelector(`[data-popup-modal="${popupTrigger}"]`)
            popupModal.classList.add('is--visible')
            bodyBlackout.classList.add('is-blacked-out')

            popupModal.querySelector('.popup-modal__close').addEventListener('click', () => {
                popupModal.classList.remove('is--visible')
                bodyBlackout.classList.remove('is-blacked-out')
            })
        })
    })

    clickHandler()
    submitHandler()
    getMoods()
    getActivities()
    renderApp()
})
