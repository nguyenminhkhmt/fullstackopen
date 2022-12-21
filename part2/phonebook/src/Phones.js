import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
    .then(response => response.data)
    .catch(error => console.log(error))
}

const add = (contact) => {
    const request = axios.post(baseUrl, contact)
    return request
    .then(response => response.data)
    .catch(error => console.log(error))
}

const deleteContact = (id) => {
    const deleteUrl = `${baseUrl}/${id}`
    const request = axios.delete(deleteUrl)
    return request
    .then(response => response.data)
}

const update = (id, contact) => {
    const updateUrl = `${baseUrl}/${id}`
    const request = axios.put(updateUrl, contact)
    return request
    .then(response => response.data)
    .catch(error => console.log(error))
}

const services = { getAll, add, deleteContact, update }

export default services