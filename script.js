const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const notFound = document.querySelector('.not-found');
const searchCity = document.querySelector('.search-city');
const weatherInfo = document.querySelector('.weather-info');

const countryTxt = document.querySelector('.country-txt');
const currentDateTxt = document.querySelector('.current-date-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');

const forcastItemContainer = document.querySelector('.forcast-item-container');

const apiKey = '41612e0c2d0134e2f0b85384b5697921';

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updatedWeatherInfo(cityInput.value);
        cityInput.value = '';
    }
})

cityInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && cityInput.value.trim() != '') {
        updatedWeatherInfo(cityInput.value);
        cityInput.value = '';
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    
    return response.json();
}

async function updatedWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    if (weatherData.cod>199 && weatherData.cod<300) {
        console.log(weatherData);
        searchCity.style.display = 'none';
        notFound.style.display = 'none';
        const {
            name : city,
            sys : {country},
            main : {temp, humidity}, 
            wind : {speed}, 
            weather : [{id, main}]
        } = weatherData
        // JS knows which properties to extract from the JSON object is because of object destructuring, 
        // a feature in JavaScript that allows you to extract properties by matching their names and 
        // structure from a complex object. 

        countryTxt.textContent = `${city}, ${country}`;
        tempTxt.textContent = `${Math.round(temp)} ℃`;
        conditionTxt.textContent = main;
        humidityValueTxt.textContent = `${humidity}%`;
        windValueTxt.textContent = `${speed}M/s`;
        weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
        currentDateTxt.textContent = getCurrentDate();
        await updateWeatherForecast(city);
        

        weatherInfo.style.display = 'flex';
    } else {
        searchCity.style.display = 'none';
        weatherInfo.style.display = 'none';
        notFound.style.display = 'block';
    }
}

function getWeatherIcon(id) {
    // codes are available on openweathermap website
    if (id <= 232) return 'thumderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id == 800) return 'clear.svg'
    if (id > 800) return 'clouds.svg'
}

function getCurrentDate() {
    const date = new Date();
    const completeDate = {
        weekday: 'short', //Displays a short version of the day of the week (e.g., "Tue" for Tuesday)
        day: '2-digit', //Displays the day of the month with two digits (e.g., "04")
        month: 'short' //Displays a short version of the month (e.g., "Sep" for September)
    }
    return date.toLocaleDateString('en-GB', completeDate) //formats the date according to the British English locale (en-GB)
}

function forcastDate(dateString) {
    const date = new Date(dateString);
    const completeDate = {
        day: '2-digit',
        month: 'short'
    }
    return date.toLocaleDateString('en-GB', completeDate);
}

async function updateWeatherForecast(city) {
    const forecastData = await getFetchData('forecast', city);
    
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];
    // here we taking forecast at same time 12:00 for all days, in order to accomplish that we making todayDate a instance of date
    // object were we use toISOString() method to convert a Date object into a string in ISO 8601 format(YYYY-MM-DDTHH:mm:ss.sssZ) 
    // in this data and time is seperated by 'T' so we are spliting it with 'T' and taking the first Element of that array


    forcastItemContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForcastItem(forecastWeather);
        }
    });
    // we write forecastData.list.forEach,becasue the .list in OpenWeatherMap Forecast API returns the forecast data in a specific 
    // format where the list property holds an array of weather forecasts for different time intervals.
    
}

function updateForcastItem(weatherData){
    console.log(weatherData);  
    const {
        dt_txt,
        main: {temp},
        weather: [{id}]
    } = weatherData
    const date = dt_txt.split(" ")[0]
//    console.log(`${date}, ${temp}, ${id}`);

    const forecastItem =`
        <div class="forcast-item">
            <div class="forcast-item-date regualar-txt">${forcastDate(date)}</div>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forcast-item-img">
            <h5 class="forcast-item-temp">${Math.round(temp)} ℃</h5>
        </div>
    `
    forcastItemContainer.insertAdjacentHTML('beforeend', forecastItem)
}

