const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const condition = document.getElementById("condition");

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

async function getWeather() {
  const city = cityInput.value.trim();

  message.textContent = "";
  weatherResult.classList.add("hidden");

  if (city === "") {
    message.textContent = "Please enter a city name";
    return;
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Geocoding request failed");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      message.textContent = "City not found";
      return;
    }

    const location = geoData.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;
    const displayName = `${location.name}${location.country ? ", " + location.country : ""}`;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Weather request failed");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    cityName.textContent = `📍 ${displayName}`;
    temperature.textContent = `🌡 Temperature: ${current.temperature_2m} °F`;
    humidity.textContent = `💧 Humidity: ${current.relative_humidity_2m}%`;
    windSpeed.textContent = `💨 Wind Speed: ${current.wind_speed_10m} mph`;

    const weatherDetails = getWeatherDetails(current.weather_code);
    condition.textContent = `Condition: ${weatherDetails.text}`;
    weatherIcon.textContent = weatherDetails.icon;

    weatherResult.classList.remove("hidden");
  } catch (error) {
    message.textContent = "Unable to fetch weather data";
  }
}

function getWeatherDetails(code) {
  if (code === 0) {
    return { text: "Clear", icon: "☀️" };
  } 
  else if (code === 1) {
    return { text: "Mainly Clear", icon: "🌤️" };
  } 
  else if (code === 2) {
    return { text: "Partly Cloudy", icon: "⛅" };
  } 
  else if (code === 3) {
    return { text: "Overcast", icon: "☁️" };
  } 
  else if (code === 45 || code === 48) {
    return { text: "Fog", icon: "🌫️" };
  } 
  else if (
    code === 51 || code === 53 || code === 55 ||
    code === 61 || code === 63 || code === 65 ||
    code === 80 || code === 81 || code === 82
  ) {
    return { text: "Rain", icon: "🌧️" };
  } 
  else if (
    code === 71 || code === 73 || code === 75 ||
    code === 77 || code === 85 || code === 86
  ) {
    return { text: "Snow", icon: "❄️" };
  } 
  else if (code === 95 || code === 96 || code === 99) {
    return { text: "Thunderstorm", icon: "⛈️" };
  } 
  else {
    return { text: "Unknown", icon: "🌤️" };
  }
}
