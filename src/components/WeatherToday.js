import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun,faWind,faTint} from '@fortawesome/free-solid-svg-icons';


const WeatherToday = ({ weatherData, isMobile }) => {
  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Function to determine the background style based on temperature
  const getBackgroundStyle = () => {
    const temp = weatherData ? weatherData.main.temp : 0; // Default to 0 if no weather data
    if (temp < 0) {
      return 'background-cold'; // Background for cold weather
    } else if (temp >= 0 && temp < 15) {
      return 'background-cool'; // Background for cool weather
    } else if (temp >= 15 && temp < 25) {
      return 'background-mild'; // Background for mild weather
    } else {
      return 'background-warm'; // Background for warm weather
    }
  };

  return (
    <div
      className={`weather-today ${getBackgroundStyle()}`} // Add dynamic background class
      style={{
        width: isMobile ? '90%' : '300px', // Adjust width for mobile view
        margin: isMobile ? '10px auto' : '20px auto', // Center with margin adjustments
        padding: '20px', // Add some padding
        borderRadius: '8px', // Rounded corners
        color: 'white', // Text color for better contrast
        transition: 'background 0.5s', // Smooth transition for background changes
      }}
    >
      {weatherData ? (
        <div>
          <h1>{weatherData.name}</h1>
          <h3>{currentDate}</h3> {/* Display current date */}
          <h3>TEMPERATURE</h3>
          <h2>{ Math.round(weatherData.main.temp)} °C</h2>
          <p>{weatherData.weather[0].description}</p>
          <FontAwesomeIcon icon={faCloudSun} />
          <p>
            <FontAwesomeIcon icon={faWind} /> Wind: {weatherData.wind.speed} mph
          </p>
          <p>
            <FontAwesomeIcon icon={faTint} /> Humidity: {weatherData.main.humidity}%
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherToday;