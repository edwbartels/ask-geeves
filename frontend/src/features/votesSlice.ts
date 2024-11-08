import type {
  PayloadAction,
  Action,
  ActionCreator,
  ActionCreatorWithPayload,
} from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { AppThunk } from "../app/store"
// import { fetchCount } from "./counterAPI"
import { csrfFetch } from "../app/csrfFetch"
import { SessionResponse, restoreSession, loginAsync } from "./sessionSlice"

export interface Vote {
  content_id: number
  content_type: "question" | "answer"
  value: 1 | 0 | -1
}
export type VotesSliceState = {
  question: Record<number, Vote>
  answer: Record<number, Vote>
}

interface LoggedInAction extends PayloadAction<SessionResponse> {}

const isLogInAction = (
  action: Action,
): action is PayloadAction<SessionResponse> => {
  const [slice, actionName, status] = action.type.split("/")
  return (
    ["restoreSession", "loginAsync"].includes(actionName) &&
    status === "fulfilled"
  )
}

const initialState: VotesSliceState = {
  question: {},
  answer: {},
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const votesSlice = createAppSlice({
  name: "votes",
  initialState,
  reducers: {
    addManyVotes(state, action: PayloadAction<Vote[]>) {
      const votes = action.payload
      for (const vote of votes) {
        const qOrA = vote.content_type
        state[qOrA][vote.content_id] = vote
      }
    },
  },
  extraReducers: builder => {
    builder.addMatcher(isLogInAction, (state, action) => {
      if (action.payload && action.payload.user) {
        const { votes } = action.payload.user
        for (const vote of votes) {
          const qOrA = vote.content_type
          state[qOrA][vote.content_id] = vote
        }
      }
    })
  },
  selectors: {
    selectVotes: vote => vote,
  },
})

// Action creators are generated for each case reducer function.
export const { addManyVotes } = votesSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectVotes } = votesSlice.selectors
