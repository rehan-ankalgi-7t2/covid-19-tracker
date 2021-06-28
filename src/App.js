import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import { useState, useEffect } from 'react';
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
import LineGraph from './components/LineGraph';
import { sortData } from './util';
import './App.css'

function App() {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState("Worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then((res) => res.json()).then((data) => {
      setCountryInfo(data)
    })
  },[])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries').then((res) => res.json()).then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, //United Kingdom
            value: country.countryInfo.iso2 //UK
          }
        ))
        setCountries(countries)

        const sortedData = sortData(data)
        setTableData(sortedData)
      })
    }

    getCountriesData()
  },[])

  const countryChangeHandler = async (e) => {
    const countryCode = e.target.value
    const url = countryCode === 'Worldwide' 
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url).then((res) => res.json()).then((data) => {
      setCountry(countryCode)
      setCountryInfo(data)
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>🦠 Covid 19 Tracker</h1>
            <FormControl className='app__dropdown'>
              <Select variant='outlined' value={country} onChange={countryChangeHandler}>
                <MenuItem value='wd'>Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox title="Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          <InfoBox title="Recoveries" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map/>
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Live cases worldwide</h3>
            <Table countries={tableData}/>
            <h3>Cases overview</h3>
            <LineGraph/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
