import React from 'react';

const WeatherWeekly = ({ weeklyData, isMobile }) => {
  return (
    <div className="weather-weekly" style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row', // Stack items vertically on mobile
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px', // Add space between forecast cards
    }}>
      
      <div className="weekly-container" style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row', // Adjust direction for mobile/desktop
        justifyContent: isMobile ? 'center' : 'space-between',
        alignItems: 'center',
        gap: isMobile ? '20px' : '10px', // Space between days
      }}>
        {weeklyData.map((day, index) => (
          <div key={index} className="daily-forecast" style={{
            width: isMobile ? '100%' : '150px', // Adjust width for mobile and desktop
            padding: '10px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
            borderRadius: '8px',
          }}>
            <p className="day">{day.day}</p>
            <p className="date">{day.date}</p> {/* Displaying the date */}
            <img
              src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.weather}
              className="weather-icon"
              style={{
                width: '50px', // Adjust icon size
                height: '50px',
              }}
            />
            <p className="temp">{Math.round(day.temp)}°C</p>
            <p className="weather">{day.weather}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWeekly;