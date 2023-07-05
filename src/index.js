let apiKey = "e2944bb8c8f7760687db8804f0796b78";

// Formats the date for h2 display
function formatDate(date) {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let hour = now.getHours();
  let minutes = now.getMinutes().toString().padStart(2, "0");
  return `${day} ${hour}:${minutes}`;
}

// When clicking search, displays city name in h1 and date and time in h2
function handleFormSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city").value;
  let displayTime = document.querySelector(".date-time");
  let displayInput = document.querySelector("h1");
  displayTime.innerHTML = formatDate(new Date());
  displayInput.textContent = city;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Fetch weather conditions for the city
  axios.get(apiUrl).then(function (response) {
    showTemperature(response, city);
  });
}

// Grabs temperature data and displays
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let showTemp = document.querySelector(`#temperature`);
  showTemp.innerHTML = `${temperature}`;
}

let form = document.querySelector("form");
form.addEventListener("submit", handleFormSubmit);
