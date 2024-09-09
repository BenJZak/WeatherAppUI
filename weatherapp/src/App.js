import './App.css';

function App() {
  function getWeather() {
    const apiKey = 'your-api-here';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°F</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById('hourly-forecast');

  const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

  next24Hours.forEach(item => {
      const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
      let hour = dateTime.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';

      // Convert 24-hour time to 12-hour format
      hour = hour % 12;
      hour = hour ? hour : 12; // If hour is 0, make it 12 (for midnight)

      const temperature = Math.round(item.main.temp);
      const iconCode = item.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

      const hourlyItemHtml = `
          <div class="hourly-item">
              <span>${hour}:00 ${ampm}</span>
              <img src="${iconUrl}" alt="Hourly Weather Icon">
              <span>${temperature}°F</span>
          </div>
      `;

      hourlyForecastDiv.innerHTML += hourlyItemHtml;
  });
}


function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
  return (
    <div id="weather-container">
      <h2>Weather App</h2>
        <input type="text" id="city" placeholder="Enter city"></input>
        <button onClick={getWeather}>Search</button>

        <img id="weather-icon" alt="Weather Icon"></img>

        <div id="temp-div"></div>

        <div id="weather-info"></div>

        <div id="hourly-forecast"></div>
    </div>
  );
}

export default App;