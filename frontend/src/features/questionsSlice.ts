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
  //   User,
  FetchAllQuestionsResponse,
  FetchOneQuestionResponse,
  Tag,
  Vote,
} from "./api-types"
import { User, addUser, addManyUsers } from "./usersSlice"
import { addManyVotes } from "./votesSlice"
//   import { SessionResponse, restoreSession, loginAsync } from "./sessionSlice"

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

interface Question {
  id: number
  user_id: number
  title: string
  content: string
  created_at: string // datetime string is fine
  updated_at: string

  total_score: number // db aggregate function
  num_votes: number // only votes that are not 0
  num_answers: number // db aggregate function

  tagIds: number[]
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

    // Unpack API response
    // Make payload for questions and users slices
    interface payload {
      questions: Question[]
      users: User[]
      userIds: Set<number>
    }
    const payload: payload = {
      questions: [],
      users: [],
      userIds: new Set(),
    }
    for (const question of questions) {
      const { User, Tags, ...remaining } = question
      const tagIds = Tags.map(tag => tag.id)
      const newQuestion = { ...remaining, tagIds }
      payload.questions.push(newQuestion)

      // only add unique user objects from the API response
      if (!payload.userIds.has(User.id)) {
        payload.userIds.add(User.id)
        payload.users.push(User)
      }
    }

    thunkApi.dispatch(addManyUsers(payload.users))
    return payload.questions

    // const justQuestionsAll = allQuestions.questions.map(question => {
    //   const { User, Tags, ...remaining } = question
    //   const tagIds = Tags.map(tag => tag.id)
    //   //   const { user, answers, comments, saves, tags, ...remaining } = question
    //   return { ...remaining, user_id: User.id, tagIds }
    // })
    // // Make users slice payload
    // // Make tags slice payload
    // const uniqueIdData = {
    //   questions: new Set(),
    //   users: new Set(),
    // }
    // const uniqueData: {
    //   questions: Question[]
    //   users: {
    //     id: number
    //     first_name: string
    //     last_name: string
    //     username: string
    //   }[]
    // } = {
    //   questions: [],
    //   users: [],
    // }
    // for (const question of questions) {
    //   const { User, Tags } = question
    //   //   const { user, answers, comments, saves, tags, ...remaining } = question
    //   if (!uniqueIdData.users.has(User.id)) {
    //     uniqueIdData.users.add(User.id)

    //     uniqueData.users.push(User)
    //   }
    // }
    // thunkApi.dispatch(addManyUsers(uniqueData.users))
    // return justQuestionsAll
  } else {
    return thunkApi.rejectWithValue({ error: "Couldn't fetch all questions!" })
  }
})

export const fetchOneQuestion = createAsyncThunk<
  Question,
  number,
  { rejectValue: FetchAllQuestionsError }
>("questions/fetchOne", async (id, thunkApi) => {
  const response = await csrfFetch(`/api/questions/${id}`)
  if (response.ok) {
    const oneQuestion: FetchOneQuestionResponse = await response.json()
    const { Tags, Votes, QuestionUser, Comments, Answers, ...remaining } =
      oneQuestion

    // Unpack API response
    // Make payload for questions and users slices
    const tagIds = Tags.map(tag => tag.id)
    const questionPayload = { ...remaining, tagIds }
    const tagsPayload = Tags
    const votesPayload = Votes

    // add user objects from QuestionUser, Comments.CommentUser, and Answers.AnswerUser
    const uniqueUserIds = new Set()
    uniqueUserIds.add(QuestionUser.id)
    const usersPayload = []
    const allReturnedUsers = [
      QuestionUser,
      ...Comments.map(comment => comment.CommentUser),
      ...Answers.map(answer => answer.AnswerUser),
    ]
    for (const user of allReturnedUsers) {
      if (!uniqueUserIds.has(user.id)) {
        uniqueUserIds.add(user.id)
        usersPayload.push(user)
      }
    }

    thunkApi.dispatch(addManyUsers(usersPayload))
    thunkApi.dispatch(addManyVotes(votesPayload))
    return questionPayload
  } else {
    return thunkApi.rejectWithValue({ error: "Couldn't fetch one question!" })
  }
})
const initialState: QuestionsSliceState = {}

// If you are not using async thunks you can use the standalone `createSlice`.
export const questionsSlice = createAppSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        const questions = action.payload
        for (const question of questions) {
          const { id } = question
          state[id] = question
        }
      })
      .addCase(fetchOneQuestion.fulfilled, (state, action) => {
        const { id } = action.payload
        state[id] = action.payload
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
