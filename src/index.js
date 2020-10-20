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
    const createLogin = () => {
        const loginDiv =  document.querySelector('#login-container')
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
            if(username === 'Sean_Padden' && password === '1234'){
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
            console.log(quote)
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
                console.log(data)
                const imgDiv = document.querySelector('#mood-booster-div')
                const img = document.createElement('img')
                img.src = data.url
                img.width = 500
                img.height = 6000
                imgDiv.append(img)
            })
        }

    const instantMoodBoost = () =>{
        const imgDiv = document.createElement('div')
        imgDiv.id = 'mood-booster-div'

        const moodBoostButton = document.createElement('button')
        moodBoostButton.innerHTML = 'Click Here for an INSTANT MOOD BOOST!'
        moodBoostButton.addEventListener('click', e => {
            showPic()
        })
        imgDiv.appendChild(moodBoostButton)

        moodDiv.appendChild(imgDiv)

    }

    var isUserLoggedIn = false 
    const renderApp = () => {
        if(isUserLoggedIn === true) {
            instantMoodBoost()
            //getMoods()
            displayMoodButton()
            displayQuotes()
        }
        else{
            createLogin()
        }
    }
    renderApp()
})
