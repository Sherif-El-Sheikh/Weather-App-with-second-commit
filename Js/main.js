let searchInput = document.getElementById("inputSearch");

// today
let todayName = document.getElementById("dayName");
let todayDate = document.getElementById("todayDate");
let todayLocation = document.getElementById("todayLocation");
let todayTemp = document.getElementById("todayTemp");
let todayConditionImg = document.getElementById("todayConditionImg");
let todayConditionText = document.getElementById("todayCondition");
// today-deatails
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let windDirection = document.getElementById("windDirection");
let rain = document.getElementById("rain");

// next day
let nextDayName = document.getElementsByClassName("next-day-name");
let nextDate = document.getElementsByClassName("next-date");
let nextMaxTemp = document.getElementsByClassName("next-max-temp");
let nextMinTemp = document.getElementsByClassName("next-min-temp");
let nextConditionImg = document.getElementsByClassName("next-Condition-img");
let nextConditionText = document.getElementsByClassName("next-Condition");


// bg forecast today
let bgForecast = document.querySelector(".forecast");

// bg forecast next day
let forecastBg = document.getElementsByClassName("forecastBg");

// bg forecast after next day
let nextForecastBg = document.getElementsByClassName("nextForecastBg");

// date
let date = new Date();

//The toLocaleString() method returns a Date object as a string, using locale settings.
//Date.toLocaleString(locales, options)
//locales => Optional. Which language specific format to use.
// options => Optional. An object where you can set some properties.
// weekday + timeStyle + dateStyle => "full" "long" "medium" "short"
// month => "2-digit" "long" "narrow" "numeric" "short"

/* console.log(date.getDate());
console.log(date.toLocaleDateString("en-US", {weekday: "long"}));
console.log(date.toLocaleDateString("en-US", {month: "long"})); */

// API
async function getWeather(cityName) {
    let weather = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=e5cc9e364abf42fa861143615241601&q=${cityName}&days=3&aqi=no&alerts=yes`);
    let weatherData = await weather.json();
    return weatherData;
}


// window.navigator object contains information about the visitor's browser.
// Navigator.geolocation Returns a Geolocation object allowing accessing the location of the device
//getCurrentPosition() method of the Geolocation interface is used to get the current position of the device.


// userlocation
function findMyLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const geoApi = `https://api-bdc.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
                // console.log(position.coords.latitude, position.coords.longitude);
                getLoactionApi(geoApi);
            }
        ),
        (err) => {
            alert(err.message)
        }
    }else {
        console.log("Geolocation is not supported by this browser.");
    }
}

findMyLocation();

async function getLoactionApi(geoApi) {
let http = new XMLHttpRequest();
http.open("GET", geoApi);
http.send();
http.addEventListener("readystatechange", async function () {
    if (http.readyState === 4 && http.status === 200) {
    const result = JSON.parse(http.response);
    // console.log(result.locality);
    let weatherData = await getWeather(result.locality);
    displayTodayWeather(weatherData);
    displayNextDay(weatherData);
    }
});
}


// display weather current day
function displayTodayWeather(data) {
    let dayDate = new Date();
    todayName.innerHTML = dayDate.toLocaleDateString("en-US", {weekday: "long"});
    todayDate.innerHTML = dayDate.getDate() + " " + dayDate.toLocaleDateString("en-US", {month: "long"});
    todayLocation.innerHTML = data.location.name;
    todayTemp.innerHTML = data.current.temp_c;
    todayConditionImg.setAttribute("src", "https:" + data.current.condition.icon);
    todayConditionText.innerHTML = data.current.condition.text;

    let conditionText = data.current.condition.text;
    if(conditionText == "Partly cloudy" || conditionText == "Partly Cloudy " || conditionText == "Cloudy" || conditionText == "Overcast" || conditionText == "Mist" || conditionText == "Patchy rain possible" || conditionText == "Light rain" || conditionText == "Light rain shower" || conditionText == "Heavy rain shower" || conditionText == "Light drizzle" || conditionText == "Heavy drizzle" || conditionText == "Drizzle" || conditionText == "Moderate rain" || conditionText == "Moderate or heavy snow showers" || conditionText == "Light freezing rain" || conditionText == "Moderate snow" || conditionText == "Freezing fog" || conditionText == "Blizzard" || conditionText == "Light snow" || conditionText == "Blowing snow" || conditionText == "Heavy rain" || conditionText == "Heavy snow" || conditionText == "Patchy rain nearby") {
        bgForecast.classList.add("frosty_bg", "text-white");
        bgForecast.classList.remove("night_bg");
        bgForecast.classList.remove("sunny_bg", "text-black");
    }else if (conditionText === "Clear") {
        bgForecast.classList.add("night_bg", "text-white");
        bgForecast.classList.remove("frosty_bg");
        bgForecast.classList.remove("sunny_bg", "text-black");
    } else if(conditionText == "Sunny") {
        bgForecast.classList.add("sunny_bg", "text-black");
        bgForecast.classList.remove("frosty_bg", "text-white");
        bgForecast.classList.remove("night_bg", "text-white");
    }
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + "km/h";
    windDirection.innerHTML = data.current.wind_dir;
    rain.innerHTML = data.forecast.forecastday[0].day.daily_chance_of_rain + "%";
}

// display next days
function displayNextDay(data) {
    let forecast = data.forecast.forecastday;
    for (let i = 0; i < 2; i++) {
        let nextDayDate = new Date(forecast[i + 1].date);
        nextDayName[i].innerHTML = nextDayDate.toLocaleDateString("en-US", {weekday: "long"});
        nextDate[i].innerHTML = nextDayDate.getDate() + " " + nextDayDate.toLocaleDateString("en-US", {month: "long"});

        nextMaxTemp[i].innerHTML = forecast[i + 1].day.maxtemp_c;
        nextMinTemp[i].innerHTML = forecast[i + 1].day.mintemp_c;
        nextConditionImg[i].setAttribute("src", "https:" + forecast[i + 1].day.condition.icon);
        nextConditionText[i].innerHTML = forecast[i + 1].day.condition.text;

        let conditionText = forecast[i + 1].day.condition.text;
        if(conditionText == "Partly cloudy" || conditionText == "Cloudy" || conditionText == "Overcast" || conditionText == "Mist" || conditionText == "Patchy rain possible" || conditionText == "Light rain" || conditionText == "Light rain shower" || conditionText == "Heavy rain shower" || conditionText == "Light drizzle"|| conditionText == "Heavy drizzle" || conditionText == "Drizzle"|| conditionText == "Moderate rain" || conditionText == "Moderate or heavy snow showers" || conditionText == "Light freezing rain" || conditionText == "Moderate snow" || conditionText == "Freezing fog" || conditionText == "Blizzard" || conditionText == "Light snow" || conditionText == "Blowing snow" || conditionText == "Heavy rain" || conditionText == "Heavy snow" || conditionText == "Patchy rain nearby" || conditionText == "Partly Cloudy " ) {
            forecastBg[i].classList.remove("sunny_bg", "text-black");
            forecastBg[i].classList.add("frosty_bg", "text-white");
            forecastBg[i].classList.remove("night_bg");
        }else if (conditionText === "Clear") {
            forecastBg[i].classList.add("night_bg", "text-white");
            forecastBg[i].classList.remove("frosty_bg");
            forecastBg[i].classList.remove("sunny_bg", "text-black");
        } else if(conditionText == "Sunny") {
            forecastBg[i].classList.add("sunny_bg", "text-black");
            forecastBg[i].classList.remove("frosty_bg", "text-white");
            forecastBg[i].classList.remove("night_bg", "text-white");
        }
    }
}

// call All
async function callAll(city="cairo") {
    let weatherData = await getWeather(city);
    if(!weatherData.error) {
        displayTodayWeather(weatherData);
        displayNextDay(weatherData)
    }
}

callAll();

// Events
searchInput.addEventListener("input", function(){
    callAll(searchInput.value)
})

