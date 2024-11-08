import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { AppThunk } from "../app/store"
// import { fetchCount } from "./counterAPI"
import { csrfFetch } from "../app/csrfFetch"
import { loginAsync } from "./sessionSlice"

export interface User {
  id: number
  first_name: string
  last_name: string
  username: string
  // email: string
  // created_at: string
  // updated_at: string
}
export type UsersSliceState = Record<number, User>

const initialState: UsersSliceState = {}

// If you are not using async thunks you can use the standalone `createSlice`.
export const usersSlice = createAppSlice({
  name: "users",
  initialState,
  reducers: create => {
    return {
      addUser: create.reducer((state, action: PayloadAction<User>) => {
        const { id } = action.payload
        state[id] = action.payload
      }),
      addManyUsers: create.reducer((state, action: PayloadAction<User[]>) => {
        for (const user of action.payload) {
          state[user.id] = user
        }
      }),
    }
  },
  extraReducers: builder => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      if (action.payload.user) {
        state[action.payload.user.id] = action.payload.user
      }
    })
  },
  selectors: {
    selectUsers: user => user,
    selectUserById: (users, id: number) => users[id],
  },
})

// Action creators are generated for each case reducer function.
export const { addUser, addManyUsers } = usersSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUsers, selectUserById } = usersSlice.selectors
