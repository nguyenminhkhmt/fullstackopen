import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 } from 'uuid'

const Filter = ({ filter, setFilter }) => {
  const handleFilterOnChanged = (event) => {
    setFilter(event.target.value)
  }

  const onSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={onSubmit}>
      find countries <input value={filter} onChange={handleFilterOnChanged} />
    </form>
  )
}

const Countries = (props) => {
  const { filter, countries, selectedCountry, setSelectedCountry } = props
  const filterStd = filter.trim().toLowerCase()

  if (filterStd === '') {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (selectedCountry !== null) {
    return (<p></p>)
  }

  const filterCountries = countries.filter(country => country.name.common.toLowerCase().includes(filterStd))

  if (filterCountries.length === 0) {
    return (
      <p>No countries found! Please check API key</p>
    )
  }

  if (filterCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  return (
    <p>
      {filterCountries.map((country) => {
        const showCountry = () => {
          setSelectedCountry(country)
        }

        return <span key={v4()}>{country.name.common} <button onClick={showCountry}>show</button><br /></span>
      })}
    </p>
  )
}

const SelectedCountry = ({ selectedCountry, weather, setWeather }) => {
  if (selectedCountry === null) {
    return (
      <p></p>
    )
  }

  console.log(selectedCountry.languages)
  let languages = []
  for (const [value] of Object.entries(selectedCountry.languages)) {
    languages.push(value)
  }

  return (
    <div>
      <h2>{selectedCountry.name.common}</h2>
      capital {selectedCountry.capital} <br />
      area {selectedCountry.area}
      <h3>languages:</h3>
      <ul>
        {languages.map((language, index) => {
          return <li key={index}>
            {language}
          </li>
        })}
      </ul>
      <span className='flag'>{selectedCountry.flag}</span>
      <Weather capital={selectedCountry.capital} weather={weather} setWeather={setWeather} />
    </div>
  )
}

const Weather = ({ capital, weather, setWeather }) => {
  if (weather === null || weather === undefined) {
    if (capital === null || capital === undefined) {
      return
    }

    // Note: Please make sure CORS is enable in your browser to fetch data success from openweathermap.
    const APIKey = process.env.REACT_APP_API_KEY
    const requestUrl = `https://samples.openweathermap.org/data/2.5/weather?q=${capital}&appid=${APIKey}`

    fetch(requestUrl, {
      method: 'GET',
      withCredentials: true,
      crossorigin: true
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json)
        setWeather(json)
      })

    return (
      <p></p>
    )
  }

  const icon = weather.weather[0].icon
  const srcIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`
  return (
    <div>
      <h2>Weather in {capital}</h2>
      <span>temperature {Math.round((weather.main.temp - 273.15) * 100) / 100} Celcius</span><br />
      <img src={srcIcon} alt="weather" /><br />
      <span>wind {weather.wind.speed} m/s</span>
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/countries')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  useEffect(() => {
    if (filter === '') {
      setSelectedCountry(null)
    }
  }, [filter])

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Countries
        countries={countries}
        filter={filter}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
      <SelectedCountry selectedCountry={selectedCountry} weather={weather} setWeather={setWeather} />
    </div>
  );
}

export default App;
