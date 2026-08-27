import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Time states
  const [timezoneOffset, setTimezoneOffset] = useState(0); 
  const [localTime, setLocalTime] = useState(new Date());

  const API_KEY = 'f5d199387d78a2804e88dee3158c9c01';

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      setLocalTime(new Date(utcTime + timezoneOffset * 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [timezoneOffset]);

  const fetchWeatherAndForecast = useCallback(async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setForecastData([]);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error('City not found');
      }

      const currentData = await currentRes.json();
      const forecastJson = await forecastRes.json();

      const dailyForecast = forecastJson.list.filter(item => item.dt_txt.includes('12:00:00'));

      setWeatherData(currentData);
      setForecastData(dailyForecast);
      setTimezoneOffset(currentData.timezone);
      
      const now = new Date();
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
      setLocalTime(new Date(utcTime + currentData.timezone * 1000));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, API_KEY]);

  useEffect(() => {
    fetchWeatherAndForecast();
  }, [fetchWeatherAndForecast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchTerm(city.trim());
    }
  };

  const formatDateTime = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-GB', options);
    const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${dateString} | ${timeString}`;
  };

  const formatUnixTime = (timestamp, offset) => {
    const d = new Date((timestamp + offset) * 1000);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const minString = m < 10 ? '0' + m : m;
    return `${hour12 < 10 ? '0' + hour12 : hour12}:${minString} ${ampm}`;
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round((deg % 360) / 45)];
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  };

  const themeClass = useMemo(() => {
    if (!weatherData) return 'theme-default';
    const main = weatherData.weather[0].main.toLowerCase();
    const hour = localTime.getHours();
    
    let timeOfDay = 'day';
    if (hour >= 5 && hour < 11) timeOfDay = 'morning';
    else if (hour >= 11 && hour < 17) timeOfDay = 'day';
    else if (hour >= 17 && hour < 20) timeOfDay = 'evening';
    else timeOfDay = 'night';

    if (main === 'thunderstorm') return 'theme-thunderstorm';
    if (main === 'drizzle' || main === 'rain') return 'theme-rain';
    if (main === 'snow') return 'theme-snow';
    if (main === 'fog' || main === 'mist' || main === 'haze') return 'theme-fog';
    if (main === 'dust' || main === 'sand') return 'theme-dust';
    if (main === 'clouds') return `theme-clouds-${timeOfDay === 'night' ? 'night' : 'day'}`;
    
    return `theme-clear-${timeOfDay}`;
  }, [weatherData, localTime]);

  const isLightText = !['theme-snow', 'theme-fog', 'theme-clear-day'].includes(themeClass);
  const textColorClass = isLightText ? 'text-light' : 'text-dark';

  const renderBackgroundElements = () => {
    const elements = [];
    
    if (themeClass.includes('thunderstorm')) {
      elements.push(<div key="lightning" className="lightning"></div>);
      for (let i = 0; i < 30; i++) {
        elements.push(<div key={`rain-${i}`} className="rain-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${0.5 + Math.random() * 0.5}s`, animationDelay: `${Math.random() * 2}s` }}></div>);
      }
    } else if (themeClass.includes('rain')) {
      for (let i = 0; i < 40; i++) {
        elements.push(<div key={`rain-${i}`} className="rain-drop" style={{ left: `${Math.random() * 100}%`, animationDuration: `${0.6 + Math.random() * 0.4}s`, animationDelay: `${Math.random() * 2}s` }}></div>);
      }
      elements.push(<div key="ripple" className="ripple-container"></div>);
    } else if (themeClass.includes('snow')) {
      for (let i = 0; i < 40; i++) {
        elements.push(<div key={`snow-${i}`} className="snowflake" style={{ left: `${Math.random() * 100}%`, animationDuration: `${3 + Math.random() * 5}s`, animationDelay: `${Math.random() * 5}s`, width: `${3 + Math.random() * 8}px`, height: `${3 + Math.random() * 8}px` }}></div>);
      }
    } else if (themeClass.includes('fog')) {
      elements.push(<div key="fog-1" className="fog-layer fog-1"></div>);
      elements.push(<div key="fog-2" className="fog-layer fog-2"></div>);
      elements.push(<div key="fog-3" className="fog-layer fog-3"></div>);
    } else if (themeClass.includes('dust')) {
      for (let i = 0; i < 30; i++) {
        elements.push(<div key={`dust-${i}`} className="dust-particle" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDuration: `${2 + Math.random() * 3}s`, animationDelay: `${Math.random() * 2}s` }}></div>);
      }
    } else if (themeClass.includes('clouds')) {
      elements.push(<div key="cloud-1" className={`cloud cloud-1 ${themeClass.includes('night') ? 'cloud-dark' : 'cloud-grey'}`}></div>);
      elements.push(<div key="cloud-2" className={`cloud cloud-2 ${themeClass.includes('night') ? 'cloud-dark' : 'cloud-grey'}`}></div>);
      elements.push(<div key="cloud-3" className={`cloud cloud-3 ${themeClass.includes('night') ? 'cloud-dark' : 'cloud-grey'}`}></div>);
    } else {
      // Clear sky variations
      if (themeClass.includes('morning')) {
        elements.push(<div key="sun" className="sun sun-morning"></div>);
        elements.push(<div key="cloud-1" className="cloud cloud-1"></div>);
        for(let i=0; i<3; i++) elements.push(<div key={`bird-${i}`} className="bird" style={{ top: `${15 + Math.random()*10}%`, animationDelay: `${i * 2}s` }}></div>);
      } else if (themeClass.includes('day')) {
        elements.push(<div key="sun" className="sun sun-day"></div>);
        elements.push(<div key="cloud-1" className="cloud cloud-1"></div>);
        elements.push(<div key="cloud-2" className="cloud cloud-2"></div>);
      } else if (themeClass.includes('evening')) {
        elements.push(<div key="sun" className="sun sun-evening"></div>);
        elements.push(<div key="cloud-1" className="cloud cloud-1 orange-cloud"></div>);
        elements.push(<div key="cloud-2" className="cloud cloud-2 orange-cloud"></div>);
      } else if (themeClass.includes('night') || themeClass === 'theme-default') {
        elements.push(<div key="moon" className="moon"></div>);
        for (let i = 0; i < 50; i++) {
          elements.push(<div key={`star-${i}`} className="star" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s` }}></div>);
        }
        elements.push(<div key="shooting-star" className="shooting-star"></div>);
      }
    }
    return elements;
  };

  return (
    <div className={`app-container ${themeClass} ${textColorClass}`}>
      <div className="background-animations">
        {renderBackgroundElements()}
      </div>

      <div className={`glass-card ${error ? 'error-shake' : 'fade-in'}`}>
        
        {/* 1. Live Date and Time */}
        <div className="live-clock">
          {formatDateTime(localTime)}
        </div>

        {/* 2. Search Bar */}
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search for a city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        {loading && (
          <div className="status-container">
            <div className="spinner"></div>
            <p className="status-text">Fetching weather...</p>
          </div>
        )}
        
        {error && (
          <div className="status-container error-state fade-in">
            <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <p>City not found</p>
          </div>
        )}

        {weatherData && !loading && !error && (
          <div className="weather-content fade-in-up">
            
            {/* 3. Weather icon + city name + country */}
            <div className="weather-header">
              <img 
                className="weather-main-icon"
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} 
                alt={weatherData.weather[0].description}
              />
              <h2 className="city-name">
                {weatherData.name} <span className="country-code">{weatherData.sys.country}</span>
              </h2>
            </div>
            
            {/* 4. Huge temperature + feels like */}
            <div className="temperature-container">
              <div className="temperature">
                {Math.round(weatherData.main.temp)}°
              </div>
              <div className="feels-like">
                Feels like {Math.round(weatherData.main.feels_like)}°C
              </div>
            </div>
            
            {/* 5. Weather condition */}
            <div className="weather-condition">
              {weatherData.weather[0].description}
            </div>

            <hr className="divider" />

            {/* 6. Sunrise / Sunset row */}
            <div className="sun-times">
              <div className="sun-time">
                <span className="sun-icon">🌅</span> 
                Sunrise {formatUnixTime(weatherData.sys.sunrise, weatherData.timezone)}
              </div>
              <div className="sun-time">
                <span className="sun-icon">🌇</span> 
                Sunset {formatUnixTime(weatherData.sys.sunset, weatherData.timezone)}
              </div>
            </div>

            {/* 7. Six detail boxes (2 rows of 3) */}
            <div className="weather-details-grid">
              <div className="detail-box">
                <div className="detail-icon-emoji">💧</div>
                <div className="detail-value">{weatherData.main.humidity}%</div>
                <div className="detail-label">Humidity</div>
              </div>
              <div className="detail-box">
                <div className="detail-icon-emoji">🔽</div>
                <div className="detail-value">{weatherData.main.pressure} hPa</div>
                <div className="detail-label">Pressure</div>
              </div>
              <div className="detail-box">
                <div className="detail-icon-emoji">👁️</div>
                <div className="detail-value">{weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : 'N/A'} km</div>
                <div className="detail-label">Visibility</div>
              </div>
              <div className="detail-box">
                <div className="detail-icon-emoji">💨</div>
                <div className="detail-value">{weatherData.wind.speed} m/s</div>
                <div className="detail-label">Wind Speed</div>
              </div>
              <div className="detail-box">
                <div className="detail-icon-emoji">🌪️</div>
                <div className="detail-value">{weatherData.wind.gust ? weatherData.wind.gust + ' m/s' : 'N/A'}</div>
                <div className="detail-label">Wind Gust</div>
              </div>
              <div className="detail-box">
                <div className="detail-icon-emoji">🧭</div>
                <div className="detail-value">{getWindDirection(weatherData.wind.deg)}</div>
                <div className="detail-label">Wind Dir</div>
              </div>
            </div>

            {/* 8. 7 day forecast horizontal scroll */}
            {forecastData.length > 0 && (
              <div className="forecast-container">
                <h3 className="forecast-title">Forecast</h3>
                <div className="forecast-scroll">
                  {forecastData.map((day, idx) => (
                    <div key={idx} className="forecast-card">
                      <div className="forecast-day">{getDayName(day.dt_txt)}</div>
                      <img 
                        className="forecast-icon"
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
                        alt="icon"
                      />
                      <div className="forecast-temps">
                        <span className="high-temp">{Math.round(day.main.temp_max)}°</span>
                        <span className="low-temp">{Math.round(day.main.temp_min)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
