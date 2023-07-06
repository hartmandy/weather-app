const API_KEY = "4e20o35b3taa72e3d42ec2471cbaf099";
const BASE_URL = "https://api.shecodes.io/weather/v1";

let celsiusTemperature = null;

function search(city) {
  let apiUrl = `${BASE_URL}/current?query=${city}&key=${API_KEY}&units=metric`;
  axios.get(apiUrl).then(displayTemperature).catch(handleError);
}

function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function formatDateTime(timestamp) {
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
  return `${days[date.getDay()]} ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function getForecast(city) {
  let apiUrl = `${BASE_URL}/forecast?query=${city}&key=${API_KEY}&units=metric`;
  axios.get(apiUrl).then(displayForecast).catch(handleError);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  response.data.daily.forEach((forecastDay) => {
    let date = new Date(forecastDay.time * 1000);
    let isToday = date.getDate() === new Date().getDate();

    if (!isToday) {
      forecastHTML += `
        <div class="col-2">
        <div class="weather-forecast-date">${formatDate(forecastDay.time)}</div>
        <img src="${forecastDay.condition.icon_url}" alt="" width="42" />
        <div class="weather-forecast-temperature">
        <span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temperature.maximum
        )}° </span>
        <span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temperature.minimum
        )}° </span>
        </div>
        </div>
        `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayTemperature(response) {
  let {
    temperature: { current, humidity },
    city,
    condition: { description, icon, icon_url },
    wind: { speed },
    time,
  } = response.data;

  celsiusTemperature = current;

  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#city").innerHTML = city;
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = Math.round(speed * 3.6);
  document.querySelector("#date").innerHTML = formatDateTime(time);

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", icon_url);
  iconElement.setAttribute("alt", icon);

  getForecast(city);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  if (celsiusTemperature !== null) {
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    document.querySelector("#temperature").innerHTML = Math.round(
      fahrenheitTemperature
    );
  }
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  if (celsiusTemperature !== null) {
    document.querySelector("#temperature").innerHTML =
      Math.round(celsiusTemperature);
  }
}

function handleSubmit(event) {
  event.preventDefault();
  search(document.querySelector("#city-input").value);
}

document.querySelector("#search-form").addEventListener("submit", handleSubmit);

document
  .querySelector("#fahrenheit-link")
  .addEventListener("click", displayFahrenheitTemperature);

document
  .querySelector("#celsius-link")
  .addEventListener("click", displayCelsiusTemperature);

search("Asheville");
