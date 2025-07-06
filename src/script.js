// Function to format the current time
function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}

// Function to format the day for the forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

// Function to refresh current weather details
function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let currentDateElement = document.querySelector("#current-date");
  let iconElement = document.querySelector("#icon");

  let date = new Date(response.data.time * 1000);

  cityElement.innerHTML = response.data.city;
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;

  let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayName = daysOfWeek[date.getDay()];
  currentDateElement.innerHTML = dayName;

  timeElement.innerHTML = formatDate(date);

  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" alt="${response.data.condition.description}"/>`;

  // Get and display the 5-day forecast
  getForecast(response.data.city);
}

// Function to display the 5-day forecast
function displayForecast(response) {
  // console.log(response.data);

  let forecast = document.querySelector("#forecast");
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index > 0 && index <= 5) {
      forecastHtml += `
      <div class="forecast-item">
        <div class="forecast-day">${formatDay(day.time)}</div>
        <div class="forecast-icon-container">
        <img src="${day.condition.icon_url}" class="forecast-image"/>
        </div>
        <div class="forecast-temp">
          <strong><span class="max">${Math.round(
            day.temperature.maximum
          )}°</span></strong>
          <span class="min">${Math.round(day.temperature.minimum)}°</span>
        </div>
      </div>
    `;
    }
  });

  forecast.innerHTML = forecastHtml;
}

// Function to fetch current weather data
function searchCity(city) {
  let apiKey = "bc892e6f8cb423o2f786c3ctf8a06c3a";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

// Function to fetch forecast data (called by refreshWeather)
function getForecast(city) {
  let apiKey = "bc892e6f8cb423o2f786c3ctf8a06c3a";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Event listener for search form submission
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Handler for search form submission
function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchCity(searchInput.value);
}

// Initial call to display weather for a default city
searchCity("Pretoria");
