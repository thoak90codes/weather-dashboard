var APIKey = '47638e5ce4e889ab7f93e80381f9d50f'
var searchedCity = document.getElementById('searched-cities')
var searchBtn = document.querySelector('.search-btn')
var searchInput = document.querySelector('.search-input')
// var city, lat, lon, queryUrl, forecastUrl

//Parametor "city" = the value of searchInput. This function will fetch information from the API based on the city searched.
async function getWeatherAPI(city) {

  //if not a city, return.
  if (!city) {
    return
  }
  //variables for api url that provides the location of the city searched, weather, and forecast.
  var geoResponse = await fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey)
  var [{ lat, lon }] = await geoResponse.json()
  var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey
  var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey
  //fetch current weather for city searched and return as an object
  fetch(queryUrl)
    .then(function (response) {
      return response.json()
    })
    //then grab the data and place them in the following elements
    .then(function (data) {
      console.log(data)
      var cityNameEl = document.getElementById('city-name')
      var currentDateEl = document.getElementById('current-date')
      var weatherIconEl = document.getElementById('weather-icon')
      var tempEl = document.getElementById('temp')
      var windEl = document.getElementById('wind')
      var humidityEl = document.getElementById('humidity')

      cityNameEl.textContent = data.name
      currentDateEl.textContent = dayjs().format('M/D/YYYY')
      weatherIconEl.src = 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
      weatherIconEl.alt = data.weather[0].description
      tempEl.textContent = 'temperature: ' + data.main.temp
      windEl.textContent = 'wind: ' + data.wind.speed
      humidityEl.textContent = 'humidity: ' + data.main.humidity

      //Add city to cities array. Store cities with the storeCities function and then run the createButtons function.
      cities.push(city)
      storeCities()
      createButtons()
    })
    //Fetch the forecastUrl and return a response from the server and parse into an object.
    .then(() => {
      fetch(forecastUrl)
        .then(function (response) {
          return response.json()
        })
        //create elements for 5-day forecast with data from forecastUrl. use dayjs to format the dates
        .then(function (data) {
          console.log(data)

          document.querySelector('.row').innerHTML = ''

          for (var i = 0; i < data.list.length; i++) {
            var testTime = data.list[i].dt_txt.split(' ')[1]

            if (testTime === '12:00:00') {
              var cardDiv = document.createElement('div')
              var dateEl = document.createElement('p')
              var forecastIcon = document.createElement('img')
              var tempEl = document.createElement('p')
              var windEl = document.createElement('p')
              var humidityEl = document.createElement('p')

              dateEl.textContent = dayjs(data.list[i].dt_txt).format('M/D/YYYY')
              forecastIcon.src = 'https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png'
              forecastIcon.alt = data.list[i].weather[0].description
              tempEl.textContent = 'temperature: ' + data.list[i].main.temp
              windEl.textContent = 'wind: ' + data.list[i].wind.speed
              humidityEl.textContent = 'humidity: ' + data.list[i].main.humidity

              cardDiv.setAttribute('class', 'card')
              dateEl.setAttribute('class', 'forecast-icon')
              forecastIcon.setAttribute('class', 'forecast-icon')

              cardDiv.appendChild(dateEl)
              cardDiv.appendChild(forecastIcon)
              cardDiv.appendChild(tempEl)
              cardDiv.appendChild(windEl)
              cardDiv.appendChild(humidityEl)
              document.querySelector('.row').appendChild(cardDiv)
            }
          }
        })
    })
}

//each city searched will be stored in local storage or be an empty array
var cities = []

function init() {

  var storedCities = JSON.parse(localStorage.getItem('cities')) || []

  if (storedCities !== null) {
    cities = storedCities
  }
  createButtons()
}

//when window is done loading, init function will run.
window.onload = init

//a button will be created for each city searched
function createButtons() {

  searchedCity.innerHTML = ''

  for (var i = 0; i < cities.length; i++) {
    var city = cities[i]

    if (cities.indexOf(city) === i) {

      var li = document.createElement('li')
      li.setAttribute('class', 'buttonLi')

      var button = document.createElement('button')
      button.setAttribute('class', 'search-btn')
      button.setAttribute('data-index', i)
      button.textContent = city

      button.addEventListener('click', function (event) {
        var cityName = event.target.textContent
        if (cityName) {
          getWeatherAPI(cityName)
        }
      })
      li.appendChild(button)
      searchedCity.appendChild(li)
    }
  }
}

//each city will be a string in the array
function storeCities() {
  localStorage.setItem('cities', JSON.stringify(cities))
}

//When search button is clicked, the getWeatherAPI function will run based on what is being searched.
searchBtn.addEventListener('click', function () {
  getWeatherAPI(searchInput.value.trim())
})