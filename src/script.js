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
  document
    .querySelector(`#icon`)
    .setAttribute(`src`, ` http://openweathermap.org/img/wn/10d@2x.png`);

  celsiusTemperature = response.data.main.temp;
}

let citySearch = document.querySelector(`#city-search`);
citySearch.addEventListener(`submit`, handleSubmit);

searchCity(`London`);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  document.querySelector(`#temp`).innerHTML = Math.round(
    (celsiusTemperature * 9) / 5 + 32
  );
  document.querySelector(`#unit`).innerHTML = `F`;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  document.querySelector(`#temp`).innerHTML = Math.round(celsiusTemperature);
  document.querySelector(`#unit`).innerHTML = `C`;
}

let fahrenheitLink = document.querySelector(`#degreesF`);
fahrenheitLink.addEventListener(`click`, displayFahrenheitTemperature);

let celsiusLink = document.querySelector(`#degreesC`);
celsiusLink.addEventListener(`click`, displayCelsiusTemperature);
