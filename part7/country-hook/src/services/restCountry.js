import axios from "axios"

const findCountryBaseUrl = 'https://restcountries.com/v3.1/name'

const fetchCountry = async (name) => {
  const response = await axios.get(`${findCountryBaseUrl}/${name}`)
  return response.data[0] // return first result
}

const countryService = {
  fetchCountry
}

export default countryService