import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  console.log(credentials)
  const response = await axios.post(baseUrl, credentials)
  console.log('response: ',response)
  return response.data
}

const loginService = { login }
export default loginService