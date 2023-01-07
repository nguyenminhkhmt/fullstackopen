import { createSlice } from '@reduxjs/toolkit'

const initialState = ''
let timeoutId;

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationMesssage(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return initialState
    }
  }
})

export const { setNotificationMesssage, removeNotification } = notificationSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    dispatch(setNotificationMesssage(message))
    timeoutId = setTimeout(() => {
      dispatch(removeNotification())
    }, time * 1000)
  }
}

const notificationReducer = notificationSlice.reducer
export default notificationReducer