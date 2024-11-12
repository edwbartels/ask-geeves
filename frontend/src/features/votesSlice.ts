import {
  PayloadAction,
  Action,
  ActionCreator,
  ActionCreatorWithPayload,
  createAsyncThunk,
} from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { SessionResponse, restoreSession, loginAsync } from "./sessionSlice"

export interface Vote {
  content_id: number
  content_type: "question" | "answer" | "comment"
  value: 1 | 0 | -1
}
export type VotesSliceState = {
  question: Record<number, Vote>
  answer: Record<number, Vote>
  comment: Record<number, Vote>
}
// export type UpdateVoteResponse = {
//   content_id: number
//   content_type: "question" | "answer" | "comment"
//   value:
// }

interface updateVoteError {
  error: string
}

interface LoggedInAction extends PayloadAction<SessionResponse> {}

export const updateVote = createAsyncThunk<
  Vote,
  {
    content_id: number
    content_type: "question" | "answer" | "comment"
    value: number
  },
  { rejectValue: updateVoteError }
>("votes/updateVote", async (details, thunkApi) => {
  const { content_id, content_type, value } = details
  try {
    const response = await fetch(`/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_id, content_type, value }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      return thunkApi.rejectWithValue(errorData)
    }
    const payload = response.json()
    return payload
  } catch (error) {
    console.error(error)
    return thunkApi.rejectWithValue({ error: "Failed to update vote" })
  }
})
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
  comment: {},
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
    builder
      .addCase(updateVote.fulfilled, (state, action) => {
        const { content_id, content_type, value } = action.payload
        console.log("in action ----> ", content_id, content_type, value)
        state[content_type][content_id] = { content_type, content_id, value }
      })
      .addMatcher(isLogInAction, (state, action) => {
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
    selectVotes: state => state,
    selectVoteByContentAndId: (
      state,
      content_type: "question" | "answer" | "comment",
      content_id: number,
    ) => {
      return state[content_type][content_id]
    },
  },
})

// Action creators are generated for each case reducer function.
export const { addManyVotes } = votesSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectVotes, selectVoteByContentAndId } = votesSlice.selectors
