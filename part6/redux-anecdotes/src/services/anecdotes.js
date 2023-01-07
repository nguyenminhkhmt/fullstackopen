import axios from "axios"

const baseUrl = 'http://localhost:3001/anecdotes'
let anecdotes = []

const getAll = async () => {
  const response = await axios.get(baseUrl)
  anecdotes = response.data
  return anecdotes
}

const createNew = async (content) => {
  const anecdote = {
    content,
    votes: 0
  }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const voteFor = async (id) => {
  const anecdote = anecdotes.find(anecdote => anecdote.id === id)
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
  anecdotes = anecdotes.map(anecdote => anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote)
  return response.data
}

const anecdotesService = { getAll, createNew, voteFor }

export default anecdotesService