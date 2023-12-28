import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
import WeatherCard from './components/WeatherCard';

function App() {

  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temp, setTemp] = useState()
  const [isLoading, setIsLoading] = useState(true)


  const success = pos => {
    const obj = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
    }
    setCoords(obj)
  }

  useEffect(() => {
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(success)
  }, [])

  useEffect(() => {
    if (coords) {
      const API_KEY = '8c4be8ed943b17d62eb96ced0b9ffd0b'
      const { lat, lon } = coords

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`

      axios.get(url)
        .then(res => {
          setWeather(res.data)
          const obj = {
            celcius: (res.data.main.temp - 273.15).toFixed(1),
            fahrenheit: ((res.data.main.temp - 273.15) * 9 / 5 + 32).toFixed(1)
          }

          setTemp(obj)
        })
        .catch(err => console.log(err))
        .finally(() => setIsLoading(false))
    }
  }, [coords])



  return (
    <div className='app'>
      {
        isLoading
          ? <h2>Loading...</h2>
          : (
          <WeatherCard
            weather={weather}
            temp={temp}
          />
          )
}
    </div>
  )
  
}

export default App
