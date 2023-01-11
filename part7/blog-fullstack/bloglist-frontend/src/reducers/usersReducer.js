import userRouter from '../services/users'
import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = slice.actions

export const loadAllUser = () => {
  return async dispatch => {
    const users = await userRouter.getAll()
    if (users) {
      console.log('users:', users)
      dispatch(setUsers(users))
    }
  }
}

const usersReducer = slice.reducer
export default usersReducer