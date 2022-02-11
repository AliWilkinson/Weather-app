function formattedDate(date) {
  let days = [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ];

  let months = [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ];

  let dayOfTheWeek = days[date.getDay()];
  let dayOfTheMonth = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  return `${dayOfTheWeek} ${dayOfTheMonth} ${month} ${year}`;
}

function formattedTime(date) {
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hour}:${minutes}`;
}
let displayDate = document.querySelector(`#date`);
let date = new Date();
displayDate.innerHTML = formattedDate(date);

let displayTime = document.querySelector(`#time`);
displayTime.innerHTML = formattedTime(date);

function activateUserLocation() {
  navigator.geolocation.getCurrentPosition(getUserLocation);
}
let apiKey = `5c086425194ae4da9c42b9089eab65e7`;

let celsiusTemperature = null;

function getUserLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = `metric`;
  let apiUrlCurrentLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlCurrentLocation).then(showLocationTemp);
}

function showLocationTemp(response) {
  console.log(response);
  document.querySelector(`#temp`).innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector(`#city`).innerHTML = response.data.name;
  document.querySelector(`#feel-like-temp`).innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector(`#humidity`).innerHTML = response.data.main.humidity;
  document.querySelector(`#wind`).innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(`#description`).innerHTML =
    response.data.weather[0].main;
  celsiusTemperature = response.data.main.temp;
  document.querySelector(`#unit`).innerHTML = `C`;
  celsiusLink.classList.add(`active`);
  fahrenheitLink.classList.remove(`active`);
}

let locationButton = document.querySelector(`#location-button`);
locationButton.addEventListener(`click`, activateUserLocation);

function searchCity(city) {
  let units = `metric`;
  let apiUrlSearchedCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrlSearchedCity).then(displayCityAndTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector(`#city-name`).value;
  searchCity(city);
}

function displayCityAndTemp(response) {
  console.log(response);
  document.querySelector(`#city`).innerHTML = response.data.name;
  document.querySelector(`#temp`).innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(`#feel-like-temp`).innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector(`#humidity`).innerHTML = response.data.main.humidity;
  document.querySelector(`#wind`).innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector(`#description`).innerHTML =
    response.data.weather[0].main;

  document.querySelector(`#unit`).innerHTML = `C`;
  celsiusLink.classList.add(`active`);
  fahrenheitLink.classList.remove(`active`);

  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}

let citySearch = document.querySelector(`#city-search`);
citySearch.addEventListener(`submit`, handleSubmit);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(`#forecast`);

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col"> <div calss="weather-forecast-data">
              ${formatDay(forecastDay.dt)} <br />
            
              <span> <img 
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" width="50"</span>
              <div class="temperature">${Math.round(
                forecastDay.temp.max
              )}&deg; ${Math.round(
          forecastDay.temp.min
        )}&deg;<small></small></div>
            </div>
            </div> `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `5c086425194ae4da9c42b9089eab65e7`;
  let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrlForecast);
  axios.get(apiUrlForecast).then(displayForecast);
}

searchCity(`London`);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  document.querySelector(`#temp`).innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
  document.querySelector(`#unit`).innerHTML = `F`;
  celsiusLink.classList.remove(`active`);
  fahrenheitLink.classList.add(`active`);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  document.querySelector(`#temp`).innerHTML = Math.round(celsiusTemperature);
  document.querySelector(`#unit`).innerHTML = `C`;
  fahrenheitLink.classList.remove(`active`);
  celsiusLink.classList.add(`active`);
}

let fahrenheitLink = document.querySelector(`#degreesF`);
fahrenheitLink.addEventListener(`click`, displayFahrenheitTemperature);

let celsiusLink = document.querySelector(`#degreesC`);
celsiusLink.addEventListener(`click`, displayCelsiusTemperature);
