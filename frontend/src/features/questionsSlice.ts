import {
  PayloadAction,
  Action,
  ActionCreator,
  ActionCreatorWithPayload,
  createAsyncThunk,
} from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import type { AppThunk } from "../app/store"
import {
  FetchAllQuestionsResponse,
  FetchOneQuestionResponse,
  Tag,
  Vote,
} from "./api-types"
import { setAllQuestionsSettings, AllQuestionsSettings } from "./sessionSlice"
import { User, addUser, addManyUsers } from "./usersSlice"
import { addManyVotes } from "./votesSlice"
import {
  addManyAnswers,
  createOneAnswer,
  deleteOneAnswer,
} from "./answersSlice"
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

export interface Question {
  id: number
  user_id: number
  title: string
  content: string
  created_at: string // datetime string is fine
  updated_at: string

  total_score: number // db aggregate function
  num_votes: number // only votes that are not 0
  num_answers: number // db aggregate function

  answerIds: number[]
  tagIds: number[]
}
export interface QuestionForm {
  title: string
  content: string
  tag?: string[]
}
export interface CreateQuestionError {
  message: string
  errors: {
    content?: string
    title?: string
  }
}

export type QuestionsSliceState = {
  questions: Record<number, Question>
  error: CreateQuestionError | null
}

export const fetchAllQuestions = createAsyncThunk<
  // Return type of the payload creator
  Question[],
  // First argument to payload creator
  { page: string; size: string },
  // Optional fields for thunkApi types
  { rejectValue: FetchAllQuestionsError }
>("questions/fetchAll", async (pageSettings, thunkApi) => {
  const { page } = pageSettings || 1
  const { size } = pageSettings || 15
  const fetchUrl = `/api/questions/?page=${page}&per_page=${size}&sort_by=id`
  const response = await fetch(fetchUrl)
  if (response.ok) {
    const allQuestions: FetchAllQuestionsResponse = await response.json()
    const { page, size, num_pages, questions } = allQuestions

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
      const newQuestion: Question = { ...remaining, answerIds: [], tagIds }
      payload.questions.push(newQuestion)

      // only add unique user objects from the API response
      if (!payload.userIds.has(User.id)) {
        payload.userIds.add(User.id)
        payload.users.push(User)
      }
    }

    thunkApi.dispatch(
      setAllQuestionsSettings({
        page: page,
        size: size,
        num_pages: num_pages,
      }),
    )
    thunkApi.dispatch(addManyUsers(payload.users))
    return payload.questions
  } else {
    return thunkApi.rejectWithValue({ error: "Couldn't fetch all questions!" })
  }
})

export const fetchOneQuestion = createAsyncThunk<
  Question,
  number,
  { rejectValue: FetchAllQuestionsError }
>("questions/fetchOne", async (id, thunkApi) => {
  const response = await fetch(`/api/questions/${id}`)
  if (response.ok) {
    const oneQuestion: FetchOneQuestionResponse = await response.json()
    const { Tags, Votes, QuestionUser, Comments, Answers, ...remaining } =
      oneQuestion.question

    // Unpack API response
    // Make payload for questions and users slices
    const answerIds = Answers.map(answer => answer.id)
    const tagIds = Tags.map(tag => tag.id)
    const questionPayload = {
      ...remaining,
      user_id: QuestionUser.id,
      answerIds,
      tagIds,
      num_votes: 100,
      num_answers: 100,
    }
    const tagsPayload = Tags
    const votesPayload = Votes
    // answersPayload
    const answersPayload = Answers.map(answer => {
      const { AnswerUser, Comments, ...remaining } = answer
      const user_id = AnswerUser.id
      return { ...remaining, user_id }
    })
    thunkApi.dispatch(addManyAnswers(answersPayload))

    // add user objects from QuestionUser, Comments.CommentUser, and Answers.AnswerUser
    const uniqueUserIds = new Set()
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
    // dispatch addManyAnswers
    return questionPayload
  } else {
    return thunkApi.rejectWithValue({ error: "Couldn't fetch one question!" })
  }
})
export const createOneQuestion = createAsyncThunk<
  Question,
  QuestionForm,
  { rejectValue: CreateQuestionError }
>("questions/createOneQuestion", async (post, thunkApi) => {
  const response = await fetch("/api/questions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    const responseError: CreateQuestionError = await response.json()
    return thunkApi.rejectWithValue(responseError)
  }
  // if (response.ok) {
  const newQuestion: FetchOneQuestionResponse = await response.json()
  const { Tags, Votes, QuestionUser, Comments, Answers, ...remaining } =
    newQuestion.question

  // Unpack API response
  // Make payload for questions and users slices
  const answerIds = Answers.map(answer => answer.id)
  const tagIds = Tags.map(tag => tag.id)
  const questionPayload = {
    ...remaining,
    user_id: QuestionUser.id,
    answerIds,
    tagIds,
    num_votes: 100,
    num_answers: 100,
  }
  const tagsPayload = Tags
  const votesPayload = Votes
  // answersPayload
  const answersPayload = Answers.map(answer => {
    const { AnswerUser, Comments, ...remaining } = answer
    const user_id = AnswerUser.id
    return { ...remaining, user_id }
  })
  thunkApi.dispatch(addManyAnswers(answersPayload))

  // add user objects from QuestionUser, Comments.CommentUser, and Answers.AnswerUser
  const uniqueUserIds = new Set()
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
  // dispatch addManyAnswers
  return questionPayload
  // }
})
interface DeleteOneQuestionResponse {
  message: string
  deletedId: number
}
export const deleteOneQuestion = createAsyncThunk<
  DeleteOneQuestionResponse,
  number,
  { rejectValue: { message: string } }
>("questions/deleteOneQuestion", async id => {
  const response = await fetch(`/api/questions/${id}`, {
    method: "DELETE",
  })
  const message: { message: string } = await response.json()
  return { deletedId: Number(id), ...message }
})

const initialState: QuestionsSliceState = { questions: {}, error: null }

// If you are not using async thunks you can use the standalone `createSlice`.
export const questionsSlice = createAppSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllQuestions.fulfilled, (state, action) => {
        state.questions = {}
        const questions = action.payload
        for (const question of questions) {
          const { id } = question
          state.questions[id] = question
        }
      })
      .addCase(fetchOneQuestion.fulfilled, (state, action) => {
        const { id } = action.payload
        state.questions[id] = action.payload
        state.error = null
      })
      .addCase(createOneQuestion.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload
        }
      })
      .addCase(deleteOneQuestion.fulfilled, (state, action) => {
        const { deletedId } = action.payload
        delete state.questions[deletedId]
      })
      .addCase(createOneAnswer.fulfilled, (state, action) => {
        const { question_id, id } = action.payload.answer
        state.questions[question_id].answerIds?.push(id)
      })
      .addCase(deleteOneAnswer.fulfilled, (state, action) => {
        const { questionId, answerId } = action.payload
        const oldAnswerIds = state.questions[questionId].answerIds
        state.questions[questionId].answerIds = oldAnswerIds?.filter(
          id => id !== answerId,
        )
      })
  },
  selectors: {
    selectQuestions: state => state,
    selectQuestionsArr: state => Object.values(state.questions),
    selectQuestionById: (state, id: number) => state.questions[id],
  },
})

// Action creators are generated for each case reducer function.
export const {} = questionsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectQuestions, selectQuestionsArr, selectQuestionById } =
  questionsSlice.selectors
