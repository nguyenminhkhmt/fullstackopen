import { createSlice } from '@reduxjs/toolkit'

const initialMessage = null
let timeoutId = null

const slice = createSlice({
  name: 'message',
  initialState: initialMessage,
  reducers: {
    setMessageAction(state, action) {
      return action.payload
    },
    removeMessage() {
      return initialMessage
    }
  }
})

export const { setMessageAction, removeMessage } = slice.actions

export const setMessageWithTimeout = (message, time = 5) => {
  return async dispatch => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    console.log(message)
    dispatch(setMessageAction(message))
    timeoutId = setTimeout(() => {
      dispatch(removeMessage())
    }, time * 1000)
  }
}

const messageReducer = slice.reducer
export default messageReducer
