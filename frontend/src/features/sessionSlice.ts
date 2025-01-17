import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { createSelector } from "reselect"
import { addManyUsers, usersSlice } from "./usersSlice"
import { Vote } from "./votesSlice"
import { Save } from "./savesSlice"

export type AllQuestionsSettings_old = Record<
  string | "page" | "size" | "num_pages",
  string
>
export interface AllQuestionsSettings {
  page: number
  size: number
  num_pages: number
}

export interface SessionSliceState {
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    username: string
    created_at: string
    updated_at: string
  } | null
  status: "idle" | "loading" | "failed" | "logged out" | "logged in"
  error: string | null
  settings: { size: number }
}

interface LoginRequest {
  credential: string
  password: string
}
export interface SessionResponse {
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    username: string
    created_at: string
    updated_at: string
    votes: Vote[]
    saves: Save[]
  } | null
}
interface LoginError {
  message: string
  error: string
}
interface LogoutResponse {
  message: "Logout success"
}

const initialState: SessionSliceState = {
  user: null,
  status: "idle",
  error: null,
  settings: { size: 15 },
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const sessionSlice = createAppSlice({
  name: "session",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => {
    return {
      // setAllQuestionsSettings: create.reducer(
      //   (state, action: PayloadAction<AllQuestionsSettings>) => {
      //     state.allQuestionsSettings = action.payload
      //   },
      // ),
      setPostsPerPage: create.reducer(
        (state, action: PayloadAction<number>) => {
          state.settings.size = action.payload
        },
      ),
      restoreSession: create.asyncThunk(
        async (_, thunkApi) => {
          const response = await fetch("/api/session/")
          const userSession: SessionResponse = await response.json()
          if (!response.ok) {
            thunkApi.rejectWithValue(response)
          }
          if (userSession.user) {
            const user = {
              id: userSession.user.id,
              first_name: userSession.user.first_name,
              last_name: userSession.user.last_name,
              username: userSession.user.username,
            }
            thunkApi.dispatch(addManyUsers([user]))
          }
          return userSession
        },
        {
          fulfilled: (state, action: PayloadAction<SessionResponse>) => {
            const { user: sessionUser } = action.payload
            if (sessionUser) {
              const { votes, saves, ...user } = sessionUser
              state.user = user
              state.status = "idle"
              state.error = null
            }
          },
        },
      ),
      loginAsync: create.asyncThunk<
        SessionResponse,
        LoginRequest,
        { rejectValue: LoginError }
      >(
        async (loginInfo, thunkApi) => {
          const response = await fetch(`/api/session/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginInfo),
          })
          if (!response.ok) {
            if (response.status === 401) {
              const error = await response.json()
              return thunkApi.rejectWithValue(error)
            }
          }
          const sessionInfo = await response.json()
          return sessionInfo
        },
        {
          fulfilled: (state, action) => {
            const { user: sessionUser } = action.payload
            if (sessionUser) {
              const { votes, saves, ...user } = sessionUser
              state.user = user
              state.status = "idle"
              state.error = null
            }
          },
          rejected: (state, action) => {
            const response = action.payload
            if (response) {
              state.error = response.error
            }
          },
        },
      ),
      logoutAsync: create.asyncThunk(
        async () => {
          const response = await fetch("/api/session/", {
            method: "DELETE",
          })
          const sessionInfo = await response.json()
          return sessionInfo
        },
        {
          fulfilled: state => {
            state.user = null
          },
          rejected: state => {
            state.status = "failed"
          },
        },
      ),
    }
  },
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectSession: session => session,
    selectUser: session => session.user,
    //     selectAllQuestionsSettings: createSelector(
    //       session => session.allQuestionsSettings,
    //       allQuestionsSettings => {
    //         const settingsToString: Record<string, string> = {}
    //         for (const [key, value] of Object.entries(allQuestionsSettings)) {
    //           settingsToString[key] = (value as number).toString()
    //         }
    //         return settingsToString
    //       },
    //     ),
    // selectStatus: counter => counter.status,
  },
})

// Action creators are generated for each case reducer function.
export const {
  // setAllQuestionsSettings,
  setPostsPerPage,
  restoreSession,
  loginAsync,
  logoutAsync,
} = sessionSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectSession, selectUser } = sessionSlice.selectors

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState())

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount))
//     }
//   }
