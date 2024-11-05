import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { AppThunk } from "../app/store"
// import { fetchCount } from "./counterAPI"
import { csrfFetch } from "../app/csrfFetch"
import { loginAsync } from "./sessionSlice"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  created_at: string
  updated_at: string
}
export type UsersSliceState = Record<number, User>

const initialState: UsersSliceState = {}

// If you are not using async thunks you can use the standalone `createSlice`.
export const usersSlice = createAppSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state[action.payload.user.id] = action.payload.user
    })
  },
  selectors: {
    selectUsers: user => user,
  },
})

// Action creators are generated for each case reducer function.
export const {} = usersSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUsers } = usersSlice.selectors
