import React from 'react';

const HourlyWeather = ({ hourlyData, isMobile }) => {
    return (
        <div className="hourly-weather">
            <h3>               </h3>
            <div className="hourly-container" style={{ display: 'flex', overflowX: 'auto' }}>
                {hourlyData.map((hour, index) => (
                    <div key={index} className="hourly-forecast" style={{
                        width: isMobile ? '60px' : '100px', // Adjust width for mobile
                        textAlign: 'center', // Center text
                    }}>
                        <p className="time">{hour.time}</p>
                        <img
                            src={`http://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                            alt={hour.weather}
                            className="weather-icon"
                        />
                        <p className="temp">{hour.temp}°C</p>
                        <p className="weather">{hour.weather}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HourlyWeather;