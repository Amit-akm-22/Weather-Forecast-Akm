import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './search.css';

function SearchBox() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const API_URL = "https://api.weatherapi.com/v1/current.json";
  const API_KEY = "2d33ccbf7b3d4e0988142916250607";

  // Background images for different weather conditions
  const backgroundImages = {
    sunny: 'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    hot: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    warm: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    mild: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    cool: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    cold: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    rain: 'https://images.unsplash.com/photo-1438449805896-28a666819a20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    snow: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    thunder: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    cloudy: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    'clear-night': 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    default: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  };

  const getWeatherInfo = async (city) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}`);
      if (!response.ok) {
        throw new Error("City not found. Please check the spelling and try again.");
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
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
    } catch (err) {
      setWeather(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (evt) => {
    setCity(evt.target.value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (city.trim()) {
      getWeatherInfo(city.trim());
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

  // Set background image based on weather theme
  useEffect(() => {
    setBackgroundImage(backgroundImages[weatherTheme]);
  }, [weatherTheme]);

  // Format local time
  const formatTime = (localtime) => {
    if (!localtime) return '';
    const date = new Date(localtime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get weather description based on conditions
  const getWeatherDescription = () => {
    if (!weather) return '';
    
    const { temp, condition } = weather;
    let description = condition.toLowerCase();
    
    if (temp > 30) {
      description += " and very hot";
    } else if (temp > 25) {
      description += " and warm";
    } else if (temp < 5) {
      description += " and freezing";
    }
    
    return description.charAt(0).toUpperCase() + description.slice(1);
  };

  // Get UV index description
  const getUVDescription = (uv) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div 
      className={`weather-app ${weatherTheme}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="search-container">
        <motion.form 
          onSubmit={handleSubmit} 
          className="search-form"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="app-title">
            <span className="app-title-main">Weather</span>
            <span className="app-title-sub">Forecast</span>
          </h2>
          
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
              InputProps={{
                style: {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            />
            <Button 
              variant="contained" 
              disableElevation 
              type="submit"
              className="search-button"
              size="large"
              disabled={loading}
            >
              {loading ? (
                <span className="button-loading">
                  <span className="loading-dot">.</span>
                  <span className="loading-dot">.</span>
                  <span className="loading-dot">.</span>
                </span>
              ) : 'Get Weather'}
            </Button>
          </div>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="error-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {weather && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="weather-card">
                <CardContent>
                  <div className="weather-header">
                    <div>
                      <h3 className="location">
                        <svg className="location-icon" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                        </svg>
                        {weather.location}
                      </h3>
                      <p className="local-time">
                        <svg className="time-icon" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                        </svg>
                        {formatTime(weather.localtime)}
                      </p>
                    </div>
                    <div className="condition">
                      <img 
                        src={weather.icon} 
                        alt={weather.condition} 
                        className="weather-icon"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://cdn.weatherapi.com/weather/64x64/day/113.png";
                        }}
                      />
                      <span className="condition-text">{weather.condition}</span>
                    </div>
                  </div>
                  
                  <div className="weather-description">
                    {getWeatherDescription()}
                  </div>
                  
                  <div className="weather-main">
                    <div className="temperature-section">
                      <div className="temperature">
                        <span className="temp-value">{weather.temp}</span>
                        <span className="temp-unit">°C</span>
                      </div>
                      <div className="secondary-temps">
                        <p className="feels-like">
                          <span className="feels-like-label">Feels like</span>
                          <span className="feels-like-value">{weather.feelslike}°C</span>
                        </p>
                      </div>
                    </div>

                    <div className="weather-details-grid">
                      <div className="detail-item">
                        <div className="detail-icon-wrapper humidity">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z" />
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">Humidity</span>
                          <span className="detail-value">{weather.humidity}%</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon-wrapper wind">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13,5.5C13,3.57 11.43,2 9.5,2C7.57,2 6,3.57 6,5.5C6,7.43 7.57,9 9.5,9H11V12H4V15H11V19H6V22H11V23H13V19H18V22H23V19H13V15H19C20.66,15 22,13.66 22,12C22,10.34 20.66,9 19,9H13V5.5M9.5,7C8.67,7 8,6.33 8,5.5C8,4.67 8.67,4 9.5,4C10.33,4 11,4.67 11,5.5C11,6.33 10.33,7 9.5,7Z" />
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">Wind</span>
                          <span className="detail-value">{weather.wind} km/h</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon-wrapper pressure">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7C14.1,7.7 15.8,9.4 15.8,11.5C15.8,14.5 12,18 12,18C12,18 8.2,14.5 8.2,11.5C8.2,9.4 9.9,7.7 12,7.7M12,10A1.5,1.5 0 0,0 10.5,11.5A1.5,1.5 0 0,0 12,13A1.5,1.5 0 0,0 13.5,11.5A1.5,1.5 0 0,0 12,10Z" />
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">Pressure</span>
                          <span className="detail-value">{weather.pressure} mb</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon-wrapper visibility">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">Visibility</span>
                          <span className="detail-value">{weather.visibility} km</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon-wrapper uv">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,18C8.7,18 6,15.3 6,12C6,8.7 8.7,6 12,6C15.3,6 18,8.7 18,12C18,15.3 15.3,18 12,18M12,4C7.6,4 4,7.6 4,12C4,16.4 7.6,20 12,20C16.4,20 20,16.4 20,12C20,7.6 16.4,4 12,4M12,2C17.5,2 22,6.5 22,12C22,17.5 17.5,22 12,22C6.5,22 2,17.5 2,12C2,6.5 6.5,2 12,2M11,7H13V11H11V7M11,13H13V17H11V13Z" />
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">UV Index</span>
                          <span className="detail-value">
                            {weather.uv} <span className="uv-description">({getUVDescription(weather.uv)})</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <div className="detail-icon-wrapper gust">
                          <svg className="detail-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13,5.5C13,3.57 11.43,2 9.5,2C7.57,2 6,3.57 6,5.5C6,7.43 7.57,9 9.5,9H11V12H4V15H11V19H6V22H11V23H13V19H18V22H23V19H13V15H19C20.66,15 22,13.66 22,12C22,10.34 20.66,9 19,9H13V5.5M9.5,7C8.67,7 8,6.33 8,5.5C8,4.67 8.67,4 9.5,4C10.33,4 11,4.67 11,5.5C11,6.33 10.33,7 9.5,7Z" />
                          </svg>
                        </div>
                        <div className="detail-text">
                          <span className="detail-label">Wind Gust</span>
                          <span className="detail-value">{weather.gust} km/h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="weather-footer">
                    <p className="last-updated">Last updated: {lastUpdated}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SearchBox;