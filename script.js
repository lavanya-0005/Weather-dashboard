const apiKey = "612e043cc6eb4324873d0f4bdb1013f6";

// Search Weather
async function getWeather() {
const city = document.getElementById("city").value;

if (!city) {
    alert("Please enter a city name");
    return;
}

document.getElementById("weather").innerHTML =
"<h3>Loading...</h3>";

const url =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

try {

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod != 200) {
        document.getElementById("weather").innerHTML =
        `<p>${data.message}</p>`;
        return;
    }

    displayWeather(data);
getForecast(city);

} catch (error) {

    console.error(error);

    document.getElementById("weather").innerHTML =
    "<p>Error fetching weather data.</p>";
}

}

// Enter Key Search
document.getElementById("city").addEventListener("keypress", function(event) {

if (event.key === "Enter") {
    getWeather();
}

});

// Dark / Light Mode
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

document.body.classList.toggle("dark");

if (document.body.classList.contains("dark")) {
    themeBtn.innerHTML = "☀️ Light Mode";
} else {
    themeBtn.innerHTML = "🌙 Dark Mode";
}

});

// My Location Weather
function getLocationWeather() {

if (!navigator.geolocation) {

    alert("Geolocation is not supported by your browser.");
    return;
}

document.getElementById("weather").innerHTML =
"<h3>Getting your location...</h3>";

navigator.geolocation.getCurrentPosition(

    async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {

            const response = await fetch(url);
            const data = await response.json();

            displayWeather(data);
getForecast(data.name);

        } catch (error) {

            console.error(error);

            document.getElementById("weather").innerHTML =
            "<p>Unable to fetch location weather.</p>";
        }
    },

    () => {

        document.getElementById("weather").innerHTML =
        "<p>Location access denied.</p>";
    }
);


}

// Display Weather
function displayWeather(data) {
const weather = data.weather[0].main;

const icon = data.weather[0].icon;

const iconUrl =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

// Dynamic Backgrounds
if (weather === "Clear") {

    document.body.style.background =
    "linear-gradient(135deg,#f6d365,#fda085)";

} else if (weather === "Clouds") {

    document.body.style.background =
    "linear-gradient(135deg,#bdc3c7,#2c3e50)";

} else if (weather === "Rain") {

    document.body.style.background =
    "linear-gradient(135deg,#4b79a1,#283e51)";

} else {

    document.body.style.background = "#f5f5f5";
}

document.getElementById("weather").innerHTML = `

    <h2>${data.name}</h2>

    <img src="${iconUrl}" alt="Weather Icon">

    <p>🌡 Temperature: ${data.main.temp} °C</p>

    <p>💧 Humidity: ${data.main.humidity}%</p>

    <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>

    <p>☁ Weather: ${weather}</p>
`;

}
async function getForecast(city) {

    const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(forecastUrl);
        const data = await response.json();

        let forecastHTML = "";

        for(let i = 0; i < data.list.length; i += 8){

            const day = data.list[i];

            const date = new Date(day.dt_txt);

            forecastHTML += `
            <div class="forecast-card">
                <h4>${date.toLocaleDateString("en-US",{weekday:"short"})}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
            `;
        }

        document.getElementById("forecast").innerHTML = forecastHTML;

    } catch(error){

        console.error(error);
    }
}
