import { createSlice } from '@reduxjs/toolkit'
import blogRouter from '../services/blogs'

const initialUser = null

const slice = createSlice({
  name: 'login',
  initialState: initialUser,
  reducers: {
    setLogin(state, action) {
      const user = action.payload
      blogRouter.setToken(user.token)
      window.localStorage.setItem('loggedAppUser', JSON.stringify(user))
      return user
    },
    logout() {
      blogRouter.setToken(null)
      window.localStorage.removeItem('loggedAppUser')
      return initialUser
    }
  }
})

export const { setLogin, logout } = slice.actions

export const loadUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log(user)
      dispatch(setLogin(user))
    }
  }
}

const userReducer = slice.reducer
export default userReducer