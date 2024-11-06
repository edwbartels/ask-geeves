import {
  PayloadAction,
  Action,
  ActionCreator,
  ActionCreatorWithPayload,
  createAsyncThunk,
} from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { AppThunk } from "../app/store"
// import { fetchCount } from "./counterAPI"
import { csrfFetch } from "../app/csrfFetch"
import {
  Question,
  User,
  FetchAllQuestionsResponse_old as FetchAllQuestionsResponse,
} from "./api-types"
import { addUser, addManyUsers } from "./usersSlice"
//   import { SessionResponse, restoreSession, loginAsync } from "./sessionSlice"

// export interface Question {
//   id: number
//   title: string
//   total_score: number
//   content: string
//   created_at: string
//   updated_at: string
// }
interface Answer {
  id: number
  question_id: number
  content: string
  accepted: boolean
  created_at: string
  updated_at: string
  total_score: number
}

interface FetchAllQuestionsError {
  error: string
}

export type QuestionsSliceState = Record<number, Question>

export const fetchAllQuestions = createAsyncThunk<
  // Return type of the payload creator
  Question[],
  // First argument to payload creator
  void,
  // Optional fields for thunkApi types
  { rejectValue: FetchAllQuestionsError }
>("questions/fetchAll", async (_, thunkApi) => {
  const response = await csrfFetch("/api/questions")
  if (response.ok) {
    const allQuestions: FetchAllQuestionsResponse = await response.json()
    const questions = allQuestions.questions
    const justQuestionsAll = allQuestions.questions.map(question => {
      const { user, answers, comments, saves, tags, ...remaining } = question
      return { ...remaining, user_id: user.id }
    })
    // Unpack API response
    const uniqueIdData = {
      questions: new Set(),
      users: new Set(),
    }
    const uniqueData: {
      questions: Question[]
      users: User[]
    } = {
      questions: [],
      users: [],
    }
    for (const question of questions) {
      const { user, answers, comments, saves, tags, ...remaining } = question
      if (!uniqueIdData.users.has(user.id)) {
        uniqueIdData.users.add(user.id)

        uniqueData.users.push(user)
      }
    }
    thunkApi.dispatch(addManyUsers(uniqueData.users))
    return justQuestionsAll
  } else {
    return thunkApi.rejectWithValue({ error: "Couldn't fetch all questions!" })
  }
})

const initialState: QuestionsSliceState = {}

// If you are not using async thunks you can use the standalone `createSlice`.
export const questionsSlice = createAppSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllQuestions.fulfilled, (state, action) => {
      const questions = action.payload
      for (const question of questions) {
        const { id } = question
        state[id] = question
      }
    })
  },
  selectors: {
    selectQuestions: questions => questions,
    selectQuestionsArr: questions => Object.values(questions),
    selectQuestionById: (questions, id: number) => questions[id],
  },
})

// Action creators are generated for each case reducer function.
export const {} = questionsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectQuestions, selectQuestionsArr, selectQuestionById } =
  questionsSlice.selectors
