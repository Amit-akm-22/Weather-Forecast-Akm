import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState } from 'react';
import './search.css';

function SearchBox() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_URL = "https://api.weatherapi.com/v1/current.json";
  const API_KEY = "2d33ccbf7b3d4e0988142916250607";

  const getWeatherInfo = async (city) => {
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}`);
      if (!response.ok) {
        throw new Error("City not found or invalid API key");
      }

      const jsonResponse = await response.json();

      const weatherData = {
        location: `${jsonResponse.location.name}, ${jsonResponse.location.country}`,
        temp: jsonResponse.current.temp_c,
        condition: jsonResponse.current.condition.text,
        icon: jsonResponse.current.condition.icon,
        humidity: jsonResponse.current.humidity,
        wind: jsonResponse.current.wind_kph,
        feelslike: jsonResponse.current.feelslike_c,
        pressure: jsonResponse.current.pressure_mb,
        visibility: jsonResponse.current.vis_km,
        uv: jsonResponse.current.uv,
        gust: jsonResponse.current.gust_kph,
        code: jsonResponse.current.condition.code,
        isDay: jsonResponse.current.is_day,
        localtime: jsonResponse.location.localtime
      };

      setWeather(weatherData);
      setError('');
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  const handleChange = (evt) => {
    setCity(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (city.trim()) {
      getWeatherInfo(city.trim());
      setCity('');
    }
  };

  const getWeatherTheme = () => {
    if (!weather) return 'default';
    
    const { temp, code, isDay } = weather;
    
    // Snow conditions
    if ([1063, 1066, 1069, 1072, 1114, 1117, 1204, 1207, 
         1210, 1213, 1216, 1219, 1222, 1225, 1237, 1240, 
         1243, 1246, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) {
      return 'snow';
    }
    
    // Rain conditions
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1201, 
         1240, 1243, 1246].includes(code)) {
      return 'rain';
    }
    
    // Thunderstorm conditions
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
      return 'thunder';
    }
    
    // Clear/sunny
    if (code === 1000) {
      return isDay ? 'sunny' : 'clear-night';
    }
    
    // Cloudy
    if ([1003, 1006, 1009, 1030, 1135, 1147].includes(code)) {
      return 'cloudy';
    }
    
    // Temperature-based themes
    if (temp > 30) return 'hot';
    if (temp > 25) return 'warm';
    if (temp > 15) return 'mild';
    if (temp > 5) return 'cool';
    return 'cold';
  };

  const weatherTheme = weather ? getWeatherTheme() : 'default';

  // Format local time
  const formatTime = (localtime) => {
    if (!localtime) return '';
    const date = new Date(localtime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`weather-app ${weatherTheme}`}>
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <h2 className="app-title">Weather Forecast</h2>
          <div className="search-controls">
            <TextField
              id="outlined-basic"
              label="Enter city name"
              variant="outlined"
              required
              value={city}
              onChange={handleChange}
              className="search-input"
              size="small"
              fullWidth
            />
            <Button 
              variant="contained" 
              disableElevation 
              type="submit"
              className="search-button"
              size="large"
            >
              Get Weather
            </Button>
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <Card className="weather-card">
            <CardContent>
              <div className="weather-header">
                <div>
                  <h3 className="location">{weather.location}</h3>
                  <p className="local-time">{formatTime(weather.localtime)}</p>
                </div>
                <div className="condition">
                  <img src={weather.icon} alt={weather.condition} className="weather-icon" />
                  <span className="condition-text">{weather.condition}</span>
                </div>
              </div>
              
              <div className="weather-main">
                <div className="temperature-section">
                  <div className="temperature">
                    <span className="temp-value">{weather.temp}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                  <p className="feels-like">Feels like: {weather.feelslike}°C</p>
                </div>

                <div className="weather-details-grid">
                  <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <div>
                      <span className="detail-label">Humidity</span>
                      <span className="detail-value">{weather.humidity}%</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🌬️</span>
                    <div>
                      <span className="detail-label">Wind</span>
                      <span className="detail-value">{weather.wind} km/h</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🌀</span>
                    <div>
                      <span className="detail-label">Pressure</span>
                      <span className="detail-value">{weather.pressure} mb</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">👁️</span>
                    <div>
                      <span className="detail-label">Visibility</span>
                      <span className="detail-value">{weather.visibility} km</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">☀️</span>
                    <div>
                      <span className="detail-label">UV Index</span>
                      <span className="detail-value">{weather.uv}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <div>
                      <span className="detail-label">Gust</span>
                      <span className="detail-value">{weather.gust} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SearchBox;