import { useState } from 'react';
import '../styles/weather-style.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = ''; // Add your OpenWeatherMap API key here

  const getWeather = async () => {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    setLoading(true);
    try {
      // Current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
        
        // Forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();
        
        if (forecastResponse.ok) {
          setForecast(forecastData.list.slice(0, 5));
        }
      } else {
        alert(data.message || 'City not found');
      }
    } catch (error) {
      console.error('Weather fetch failed:', error);
      alert('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div id="backgroundWrapper">
      <div id="backgroundOverlay"></div>
      <div className="container">
        <header>
          <h1>
            <i className="fas fa-cloud-sun"></i> Weather Explorer
          </h1>
          <div className="search-container">
            <input
              type="text"
              id="cityInput"
              placeholder="Search for a city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={getWeather}>
              <i className="fas fa-search"></i> Search
            </button>
          </div>
        </header>

        <main>
          <div className="weather-card" id="currentWeather">
            {loading ? (
              <div className="loading">Loading weather data...</div>
            ) : weatherData ? (
              <div className="weather-info">
                <h2>{weatherData.name}, {weatherData.sys.country}</h2>
                <div className="temperature">{Math.round(weatherData.main.temp)}°C</div>
                <div className="description">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                  />
                  <p>{weatherData.weather[0].description}</p>
                </div>
                <div className="details">
                  <div>
                    <i className="fas fa-tint"></i> Humidity: {weatherData.main.humidity}%
                  </div>
                  <div>
                    <i className="fas fa-wind"></i> Wind: {weatherData.wind.speed} m/s
                  </div>
                  <div>
                    <i className="fas fa-compress-arrows-alt"></i> Pressure: {weatherData.main.pressure} hPa
                  </div>
                </div>
              </div>
            ) : (
              <div className="weather-info">
                <p>Search for a city to see weather information</p>
              </div>
            )}
          </div>

          {forecast.length > 0 && (
            <div className="forecast-container">
              <h3>5-Day Forecast</h3>
              <div className="forecast-items">
                {forecast.map((item, index) => (
                  <div key={index} className="forecast-item">
                    <div>{new Date(item.dt * 1000).toLocaleDateString()}</div>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                    />
                    <div>{Math.round(item.main.temp)}°C</div>
                    <div>{item.weather[0].description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer>
          <p>© 2023 Weather Explorer | Data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
};

export default Weather;
