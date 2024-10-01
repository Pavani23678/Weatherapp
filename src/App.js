import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import WeatherToday from './components/WeatherToday';
import WeatherWeekly from './components/WeatherWeekly';
import SearchBar from './components/SearchBar';
import HourlyWeather from './components/HourlyWeather';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Import Leaflet components
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import Leaflet for marker icon

import './App.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]); // State for hourly weather data
  const [city, setCity] = useState('Kakinada');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isMobile, setIsMobile] = useState(false);
  const [cityCoordinates, setCityCoordinates] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(2); // Set a default zoom level

  // Function to fetch weather data using city name
  const fetchWeatherDataByCity = async (cityName) => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      const apiKey = 'cbb4cbcd3a35d7abddd827cf13751700'; // Replace with your API key

      // Fetch current weather data
      const currentWeatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
      );
      setWeatherData(currentWeatherRes.data);
      const lat = currentWeatherRes.data.coord.lat;
      const lon = currentWeatherRes.data.coord.lon;
      setCityCoordinates([lat, lon]); // Set city coordinates

      // Set zoom level based on city coordinates
      setMapZoom(8); // Set higher zoom level for the city

      // Fetch 5-day forecast data
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
      );

      // Process 3-hourly forecast data for hourly display (first 24 hours)
      const hourlyForecast = forecastRes.data.list.slice(0, 8).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
        weather: item.weather[0].main,
        icon: item.weather[0].icon
      }));
      setHourlyData(hourlyForecast); // Store hourly data in state

      // Process forecast data to extract daily forecast
      const dailyForecast = forecastRes.data.list
        .filter((item) => item.dt_txt.includes('12:00:00')) // Filter for mid-day forecasts
        .map((item) => {
          const date = new Date(item.dt_txt);
          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            temp: item.main.temp,
            weather: item.weather[0].main,
            icon: item.weather[0].icon,
          };
        });

      setWeeklyData(dailyForecast);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Please check the city name.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Get the user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude); // Fetch weather by current location
        },
        (error) => {
          console.error('Error getting location:', error);
          fetchWeatherDataByCity(city); // Fall back to default city if location access is denied
        }
      );
    } else {
      fetchWeatherDataByCity(city); // Fall back to default city if Geolocation is not supported
    }
  }, [city]);

  // Function to fetch weather data using latitude and longitude
  const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      const apiKey = 'cbb4cbcd3a35d7abddd827cf13751700'; // Replace with your API key

      // Fetch current weather data using coordinates
      const currentWeatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeatherData(currentWeatherRes.data);
      setCityCoordinates([lat, lon]); // Set coordinates to current location

      // Set zoom level for current location
      setMapZoom(8); // Higher zoom for better clarity

      // Fetch 5-day forecast data
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      // Process 3-hourly forecast data for hourly display (first 24 hours)
      const hourlyForecast = forecastRes.data.list.slice(0, 8).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: item.main.temp,
        weather: item.weather[0].main,
        icon: item.weather[0].icon
      }));
      setHourlyData(hourlyForecast); // Store hourly data in state

      // Process forecast data to extract daily forecast
      const dailyForecast = forecastRes.data.list
        .filter((item) => item.dt_txt.includes('12:00:00')) // Filter for mid-day forecasts
        .map((item) => {
          const date = new Date(item.dt_txt);
          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            temp: item.main.temp,
            weather: item.weather[0].main,
            icon: item.weather[0].icon,
          };
        });

      setWeeklyData(dailyForecast);
    } catch (error) {
      console.error('Error fetching weather data by coordinates:', error);
      setError('Failed to get weather for your location.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch weather data when the component mounts
  useEffect(() => {
    getUserLocation(); // Try fetching location first
  }, [getUserLocation]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Consider mobile if screen width <= 768px
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial screen size on load

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (cityName) => {
    setCity(cityName); // Update the city state
    fetchWeatherDataByCity(cityName); // Fetch weather data based on city search
  };

  return (
    <div className="weather-app"
      style={{
        height: isMobile ? '230vh' : '130vh', // Different height for mobile and desktop
        background: 'linear-gradient(180deg, #1C3F94 0%, #87CEFA 100%)', // Background gradient
        padding: '20px', // Optional: padding around content
      }}>
      <SearchBar onSearch={handleSearch} /> {/* Search bar is here */}
      
      {loading && <p>Loading...</p>} {/* Display loading state */}
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      
      {weatherData && <WeatherToday weatherData={weatherData} isMobile={isMobile} />}
      
      {hourlyData.length > 0 && <HourlyWeather hourlyData={hourlyData} isMobile={isMobile} />} {/* Display hourly weather above weekly */}
      
      {weeklyData.length > 0 && <WeatherWeekly weeklyData={weeklyData} isMobile={isMobile} />} {/* Display weekly weather */}
      
      {/* Leaflet Map Component */}
      <MapContainer
        center={cityCoordinates}
        zoom={mapZoom} // Use dynamic zoom level
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false} // Disable scroll wheel zoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={cityCoordinates}>
          <Popup>{city}</Popup> {/* Display the city name in the popup */}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default App;
