let celsiusTemperature = null;

function search(city) {
  let apiKey = "e2944bb8c8f7760687db8804f0796b78";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature).catch(handleError);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hour = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${hour}:${minutes}`;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDate(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "e2944bb8c8f7760687db8804f0796b78";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast).catch(handleError);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  if (celsiusTemperature !== null) {
    let temperatureElement = document.querySelector("#temperature");
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  }
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  if (celsiusTemperature !== null) {
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
  }
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("New York");
