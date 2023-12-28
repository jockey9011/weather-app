import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import './App.css';

function App() {
  const [coords, setCoords] = useState();
  const [weather, setWeather] = useState();
  const [temp, setTemp] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundClass, setBackgroundClass] = useState('');

  const success = (pos) => {
    const obj = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    };
    setCoords(obj);
  };

  const error = (err) => {
    console.log(err);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);


  useEffect(() => {
    if (weather && weather.weather[0]) {
      const weatherMain = weather.weather[0].main.toLowerCase();

      if (weatherMain.includes('clear')) {
        setBackgroundClass('clear-sky');
      } else if (weatherMain.includes('cloud')) {
        setBackgroundClass('clouds');
      } else if (weatherMain.includes('rain')) {
        setBackgroundClass('rain');
      } else {
        setBackgroundClass('');
      }
    }
  }, [weather]);

  const handleSearch = (searchTerm) => {
    const API_KEY = '8c4be8ed943b17d62eb96ced0b9ffd0b';
    const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${API_KEY}`;

    axios
      .get(searchUrl)
      .then((res) => {
        setWeather(res.data);
        const obj = {
          celcius: (res.data.main.temp - 273.15).toFixed(1),
          fahrenheit: ((res.data.main.temp - 273.15) * 9 / 5 + 32).toFixed(1),
        };
        setTemp(obj);
      })
      .catch((err) => {
        console.log(err);
        // Manejar errores de búsqueda
      });
  };

  useEffect(() => {
    if (coords) {
      const API_KEY = '8c4be8ed943b17d62eb96ced0b9ffd0b';
      const { lat, lon } = coords;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);
          const obj = {
            celcius: (res.data.main.temp - 273.15).toFixed(1),
            fahrenheit: ((res.data.main.temp - 273.15) * 9 / 5 + 32).toFixed(1),
          };

          setTemp(obj);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  }, [coords]);

  return (
    <div className={`app ${backgroundClass}`}>
      <div className={`app ${weather?.weather[0].main.toLowerCase()}`}>
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <WeatherCard weather={weather} temp={temp} onSearch={handleSearch} />
        )}
      </div>

    </div>
  );
}

export default App;
