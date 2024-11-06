import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { AppThunk } from "../app/store"
// import { fetchCount } from "./counterAPI"
import { csrfFetch } from "../app/csrfFetch"
import { Vote } from "./votesSlice"

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
  } | null
}
interface LoginError {
  error: string
}
interface LogoutResponse {
  message: "Logout success"
}

const initialState: SessionSliceState = {
  user: null,
  status: "idle",
  error: null,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const sessionSlice = createAppSlice({
  name: "session",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: create => {
    return {
      // loginDemoUserAsync: create.asyncThunk<
      //   SessionResponse,
      //   void,
      //   { rejectValue: any }
      // >(
      //   async (_, thunkApi) => {
      //     try {
      //       const response = await csrfFetch("/api/session/", {
      //         method: "POST",
      //         body: JSON.stringify({
      //           credential: "admin@admin.com",
      //           password: "adminadmin",
      //         }),
      //       })
      //       // The value we return becomes the `fulfilled` action payload
      //       return await response.json()
      //     } catch (err: any) {
      //       if (!err.ok && err.status === 400) {
      //         const error = await err.json()
      //         console.log(error)
      //         return thunkApi.rejectWithValue(error.error)
      //       } else {
      //         return thunkApi.rejectWithValue("An unknown error occured")
      //       }
      //     }
      //   },
      //   {
      //     fulfilled: (state, action) => {
      //       state.user = action.payload.user
      //     },
      //     rejected: (state, action) => {
      //       state.status = "failed"
      //       state.error = action.payload
      //     },
      //   },
      // ),
      restoreSession: create.asyncThunk(
        async (_, thunkApi) => {
          const response = await fetch("/api/session/")
          const userSession = await response.json()
          return userSession
        },
        {
          fulfilled: (state, action: PayloadAction<SessionResponse>) => {
            const { user: sessionUser } = action.payload
            if (sessionUser) {
              const { votes, ...user } = sessionUser
              state.user = user
              state.status = "idle"
              state.error = null
            }
          },
        },
      ),
      // Use the `PayloadAction` type to declare the contents of `action.payload`
      // incrementByAmount: create.reducer(
      //   (state, action: PayloadAction<SessionSliceState>) => {
      //     state.user = action.payload
      //   },
      // ),
      // The function below is called a thunk and allows us to perform async logic. It
      // can be dispatched like a regular action: `dispatch(loginAsync(10))`. This
      // will call the thunk with the `dispatch` function as the first argument. Async
      // code can then be executed and other actions can be dispatched. Thunks are
      // typically used to make async requests.
      loginAsync: create.asyncThunk<
        SessionResponse,
        LoginRequest,
        { rejectValue: LoginError }
      >(
        async (loginInfo, thunkApi) => {
          try {
            const response = await csrfFetch(`/api/session/`, {
              method: "POST",
              body: JSON.stringify(loginInfo),
            })
            const sessionInfo = await response.json()
            return sessionInfo
          } catch (err: any) {
            if (!err.ok && err.status === 400) {
              const error: LoginError = await err.json()
              return thunkApi.rejectWithValue(error)
            } else {
              const error: LoginError = {
                error: "An unknown error occured",
              }
              return thunkApi.rejectWithValue(error)
            }
          }
        },
        {
          fulfilled: (state, action) => {
            const { user: sessionUser } = action.payload
            if (sessionUser) {
              const { votes, ...user } = sessionUser
              state.user = user
              state.status = "idle"
              state.error = null
            }
          },
          rejected: (state, action) => {
            state.status = "failed"
            if (action.payload) {
              state.error = action.payload.error
            }
          },
        },
      ),
      logoutAsync: create.asyncThunk(
        async () => {
          const response = await csrfFetch("/api/session/", {
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
    // selectStatus: counter => counter.status,
  },
})

// Action creators are generated for each case reducer function.
export const { restoreSession, loginAsync, logoutAsync } = sessionSlice.actions

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
