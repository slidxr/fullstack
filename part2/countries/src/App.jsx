import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

    useEffect(() => {
        axios
            .get(baseUrl)
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const [filter, setFilter] = useState('')
    const [countries, setCountries] = useState([])

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const Country = ({ country }) => {
        const api_key = import.meta.env.VITE_SOME_KEY
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${api_key}`

        const [weather, setWeather] = useState([])
        useEffect(() => {
            axios
                .get(weatherUrl)
                .then(response => {
                    setWeather(response.data)
                })
        }, [weatherUrl])


        return (
            <div>
                <h1>{country.name.common}</h1>
                <div>capital {country.capital[0]}</div>
                <div>area {country.area}</div>
                <h3>Languages</h3>
                <ul>
                    {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
                </ul>
                <img src={country.flags.png} alt="flag" width="180"/>
                <h3>Weather in {country.capital[0]}</h3>
                <div>temperature: {weather.main?.temp} Celsius</div>
                <img src={`http://openweathermap.org/img/w/${weather.weather?.[0].icon}.png`} alt="weather icon" />
                <div>wind: {weather.wind?.speed} m/s</div>


            </div>
        )

    }

    const MultipleCountries = ({ country }) => {
        const [show, setShow] = useState()

        const handleClick = () => {
            setShow(!show)
        }

        if (show) {
            return (
                <div>
                    {country.name.common}
                    <button onClick={handleClick}>hide</button>
                    <Country country={country} />
                </div>
            )
        } else {
            return (
                <div>
                    {country.name.common}
                    <button onClick={handleClick}>show</button>
                </div>
            )
        }

    }

    const CountryData = ({ filter, countries}) => {
        let countriesToShow = []

        if (filter.length > 0) {
            countriesToShow = countries.filter(result =>
                result.name.common.toLowerCase().includes(filter.toLowerCase()))
        } else {
            countriesToShow = countries
        }

        if (countriesToShow.length > 10) {
            return (
                <div>
                    Too many matches, specify another filter
                </div>
            )} else if (countriesToShow.length === 1) {
            return (countriesToShow.map(country => <Country key={country.name} country={country} />))
        } else {
            return (
                <div>
                    {countriesToShow.map(country => <MultipleCountries key={country.name} country={country} />)}
                </div>
            )
        }
    }

  return (
    <>
        <div>
            <form>
                Find countries <input value={filter} onChange={handleFilterChange} />
            </form>
            <div>
                <CountryData filter={filter} countries={countries} />
            </div>
        </div>

    </>
  )
}

export default App
