// Weather API utilities

const WEATHER_API_KEY = '7eee27b2db5b867e0c753f2ab5231d67'; // OpenWeatherMap API key

export const fetchWeather = async (city) => {
  if (!city) return null;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      console.error('Weather fetch failed');
      return null;
    }

    const data = await response.json();
    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  // Check if API key is configured
  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    console.warn('⚠️ Weather API key not configured. Add your key in src/utils/weather.js');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    return null;
  }
};
