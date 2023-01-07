import { createSlice } from '@reduxjs/toolkit'
import anecdotesSerice from '../services/anecdotes'

const initialState = []

const slice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    updateAnecdote(state, action) {
      const note = action.payload
      console.log('note:', note)
      return state.map(aNote => aNote.id !== note.id ? aNote : note).sort((note1, note2) => { return note2.votes - note1.votes })
    },
    appendAnecdote(state, action) {
      return state.concat(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateAnecdote, appendAnecdote, setAnecdotes } = slice.actions

export const initialAnecdotes = () => {
  return async dispatch => {
    let anecdotes = await anecdotesSerice.getAll()
    anecdotes = anecdotes.sort((note1, note2) => { return note2.votes - note1.votes })
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const anecdote = await anecdotesSerice.createNew(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const upVotesAnecdote = (id) => {
  return async dispatch => {
    const anecdote = await anecdotesSerice.voteFor(id)
    dispatch(updateAnecdote(anecdote))
  }
}

const reducer = slice.reducer
export default reducer