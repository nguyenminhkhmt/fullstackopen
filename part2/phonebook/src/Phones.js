import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
    .then(response => response.data)
}

const add = (contact) => {
    const request = axios.post(baseUrl, contact)
    return request
    .then(response => response.data)
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
}

const services = { getAll, add, deleteContact, update }

export default services