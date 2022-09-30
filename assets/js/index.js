function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords)
            const cords = position.coords
            // gets the wether condition based on the latitude and longitude of a particular location provided that the request was succeasful
            getTemperatureByLocation(cords.latitude, cords.longitude)

            // if error encountered use the ip address of the user to get the weather condition
        }, (error) => {
            console.log(error);
            getuserIpAddress()

        })
        // if  navigator.geolocation.getCurrentPosition is not suppoerted by the browser use user ip address
    } else {
        console.error('Geolocation is not supported by this browser.')
        getuserIpAddress()
    }
}
getUserLocation()


function getTemperatureByLocation(latitude, longitude) {
    const appId = 'fd0d7efdc4c3cb9bf410455b180b7479'
    const url = 'https://api.openweathermap.org/data/2.5/weather';

    // axios returns a Promise
    axios({
        method: 'get',
        url, //the same url as stated in url
        params: {
            lat: latitude, //value gotten from getcuurentloation
            lon: longitude, //value gotten from getcuurentloation
            appid: appId, //the same url as stated in appId
            units: 'metric' //get value in deg celsuis
        }
    })
        .then((value) => {
            console.log(value)
            if (value) {
                hideSpinner()
                displayTemperature(value.data)
                capitalizeInitials(value.data)
            }

        })
        .catch((error) => console.log(error))
}
// get users ip Address
function getuserIpAddress() {
    axios({
        url: 'https://ipinfo.io',
        method: 'get',
        params: {
            token: '5781164cd4b58b' //from ipinfo.io
        }
    })
        .then(value => {
            console.log(value);
            const location = value.data.loc //the 'data.loc' grts the location of  auser from their ip address


            const latAndLong = location.split(',') //split it so we can access lat and long separatly
            getTemperatureByLocation(latAndLong[0], latAndLong[1])
        })
        .catch(error => console.log(error))
}


function displayTemperature(tempDetails) {
    const weatherimage = document.querySelector('.weather-image i');
    const city = document.querySelector('.city-name')
    const country = document.querySelector('.country')
    const desc = document.querySelector('.description')
    const temperature = document.querySelector('.temp-data')


    let tempDescription = tempDetails.weather[0].description;

    const weatherIcon = tempDetails.weather[0].icon;
    const isDay = weatherIcon.includes('d') //returns a boolean true if letter 'd 'is contained in the icon name



    city.textContent = `${tempDetails.name},`
    country.textContent = tempDetails.sys.country
    // desc.textContent = tempDescription
    temperature.textContent = Math.round(tempDetails.main.temp)



    switch (tempDescription) {
        case 'clear sky':
            if (isDay) {
                weatherimage.classList.add('wi-day-sunny')
            } else {
                weatherimage.classList.add('wi-night-clear')
            }
            break;
        case 'few clouds':
            if (isDay) {
                weatherimage.classList.add('wi-day-cloudy')
            } else {
                weatherimage.classList.add('wi-night-alt-cloudy')
            }
            break;
        case 'scattered clouds':
            weatherimage.classList.add('wi-cloud')
            break;
        case 'broken clouds':
        case 'overcast clouds':
            weatherimage.classList.add('wi-cloudy')
            break;

        case 'light rain':
        case 'very heavy rain':
        case 'extreme rain':
        case 'moderate rain':
            if (isDay) {
                weatherimage.classList.add('wi-day-showers')
            } else {
                weatherimage.classList.add('wi-night-alt-showers')
            }
            break;

        case 'shower rain':
            weatherimage.classList.add('wi-showers')
            break;

        case 'thunderstorm':
        case 'heavy thunderstorm':
            if (isDay) {
                weatherimage.classList.add('wi-day-lightning')
            } else {
                weatherimage.classList.add('wi-night-alt-lightning')
            }
            break;

        case 'thunderstorm with light rain':
        case 'thunderstorm with rain':
        case 'thunderstorm with heavy rain':
            weatherimage.classList.add('wi-storm-showers')
            break;

        default:
            break;
    }
}


function convertCelsuisToFahrenheit() {
    let initialDegreeCelsuis = ''

    document.querySelector('.description-wrap-2 .temp-unit').addEventListener('click', (event) => {
        const tempData = document.querySelector('.temp-data');
        const degCelsuisInt = parseInt(tempData.textContent)

        event.target.classList.toggle('temp-convert')

        if (event.target.classList.contains('temp-convert')) {
            event.target.textContent = 'F';
            const fahrenheitresult = Math.round(((degCelsuisInt * 9) / 5) + 32);
            initialDegreeCelsuis = tempData.textContent;
            tempData.textContent = fahrenheitresult;

        } else {
            event.target.textContent = 'C'
            tempData.textContent = initialDegreeCelsuis
        }
    })
}
convertCelsuisToFahrenheit()



function capitalizeInitials(capital) {
    const descriptionCapitalize = document.querySelector('.description');

    // we fetch the description from the api and store it here
    let temdescription = capital.weather[0].description;

    // we split the weather description into an array of subsring
    let wordSplit = temdescription.split(' ')

    for (let index = 0; index < wordSplit.length; index++) {
        // capitalize the first word in the array and concatenate the other words using substring method
        wordSplit[index] = wordSplit[index][0].toUpperCase() + wordSplit[index].substr(1)

        // use join method to convert an array into a string with space between .join(' ')
        descriptionCapitalize.textContent = wordSplit.join(' ')
        console.log(wordSplit)
        console.log(wordSplit[index])

        
        
        
    }
}


function hideSpinner() {
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.weather-content-wrap').style.display ='block'
}
    