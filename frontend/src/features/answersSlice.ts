import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { User } from "./usersSlice"
// import { Comment } from "./api-types"
import {
  addManyComments,
  createOneComment,
  deleteOneComment,
} from "./commentsSlice"
import { json } from "stream/consumers"
import { UpdateVoteResponse } from "./votesSlice"

export interface AnswerForm {
  content: string
  userId: number
  questionId: number
}
export interface CreateAnswerResponse {
  answer: {
    id: number
    question_id: number
    accepted: boolean
    content: string
    created_at: string
    updated_at: string

    total_score: number

    answerSave: boolean

    AnswerUser: User
    num_comments: number
    commentIds: number[]
    Comments: {
      id: number
      user_id: number
      content_type: "answer"
      content_id: number
      content: string
      total_score: number
      created_at: string
      updated_at: string
      CommentUser: User
    }[]
  }
}
export interface CreateAnswerValidationError {
  error: string
}
export interface DeleteAnswerResponse {
  message: string
  answerId: number
  questionId: number
}
export interface DeleteAnswerError {
  error: string
}
export interface EditAnswerForm extends AnswerForm {
  answerId: number
}
export interface EditAnswerError {
  error: string
}

export interface Answer {
  id: number
  user_id: number
  question_id: number
  accepted: boolean
  content: string
  created_at: string
  updated_at: string

  total_score: number // db aggregate function
  num_comments: number
  commentIds: number[]
}
export type AnswersSliceState = Record<number, Answer>

export const createOneAnswer = createAsyncThunk<
  CreateAnswerResponse,
  AnswerForm,
  { rejectValue: CreateAnswerValidationError }
>("answers/createOneAnswer", async (answerInput, thunkApi) => {
  const { questionId, userId, content } = answerInput
  const url = `/api/questions/${questionId}/answers`
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  })
  if (!response.ok) {
    const errorResponse = await response.json()
    thunkApi.rejectWithValue(errorResponse)
  }

  const answer: CreateAnswerResponse = await response.json()
  const { Comments, AnswerUser, answerSave, ...remaining } = answer.answer

  const answerPayload: Answer = { ...remaining, user_id: AnswerUser.id }
  const commentPayload = Comments.map(comment => {
    const { CommentUser, ...remaining } = comment
    return { ...remaining }
  })
  const userPayload = {}
  const savedPayload = {}

  thunkApi.dispatch(addManyAnswers([answerPayload]))
  thunkApi.dispatch(addManyComments(commentPayload))
  // dispatch comments
  // dispatch saves
  // dispatch user
  return answer
})

export const deleteOneAnswer = createAsyncThunk<
  DeleteAnswerResponse,
  { questionId: number; answerId: number },
  { rejectValue: DeleteAnswerError }
>("answers/deleteOneAnswer", async (deleteInput, thunkApi) => {
  const { questionId, answerId } = deleteInput
  const response = await fetch(
    `/api/questions/${questionId}/answers/${answerId}`,
    { method: "DELETE" },
  )
  if (!response.ok) {
    const error = await response.json()
    thunkApi.rejectWithValue(error)
  }

  const deletedAnswer = await response.json()
  return { message: deletedAnswer.message, answerId, questionId }
})

export const editOneAnswer = createAsyncThunk<
  CreateAnswerResponse,
  EditAnswerForm,
  { rejectValue: EditAnswerError }
>("answers/editOneAnswer", async (editAnswerInput, thunkApi) => {
  const { questionId, answerId } = editAnswerInput
  const response = await fetch(
    `/api/questions/${questionId}/answers/${answerId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: editAnswerInput.content,
      }),
    },
  )
  if (!response.ok) {
    const error = await response.json()
    thunkApi.rejectWithValue(error)
  }
  const answer: CreateAnswerResponse = await response.json()
  const { Comments, AnswerUser, answerSave, ...remaining } = answer.answer

  const answerPayload: Answer = { ...remaining, user_id: AnswerUser.id }
  const commentPayload = {}
  const userPayload = {}
  const savedPayload = {}

  thunkApi.dispatch(addManyAnswers([answerPayload]))
  // dispatch comments
  // dispatch saves
  // dispatch user
  return answer
})

const initialState: AnswersSliceState = {}

// If you are not using async thunks you can use the standalone `createSlice`.
export const answersSlice = createAppSlice({
  name: "answers",
  initialState,
  reducers: create => {
    return {
      addManyAnswers: create.reducer(
        (state, action: PayloadAction<Answer[]>) => {
          for (const answer of action.payload) {
            state[answer.id] = answer
          }
        },
      ),
      updateAnswerTotalScore: create.reducer(
        (state, action: PayloadAction<UpdateVoteResponse>) => {
          const { content_id, total_score } = action.payload
          if (state[content_id]) {
            state[content_id].total_score = total_score
          }
        },
      ),
    }
  },
  extraReducers: builder => {
    builder
      .addCase(deleteOneAnswer.fulfilled, (state, action) => {
        const { answerId } = action.payload
        delete state[answerId]
      })
      .addCase(createOneComment.fulfilled, (state, action) => {
        const { content_id, content_type, id } = action.payload.comment
        if (content_type === "answer") state[content_id].commentIds?.push(id)
      })
      .addCase(deleteOneComment.fulfilled, (state, action) => {
        const { content_id, content_type, id } = action.payload
        if (content_type === "question") {
          const oldCommentIds = state[content_id].commentIds
          state[content_id].commentIds = oldCommentIds?.filter(
            old => old !== id,
          )
        }
      })
  },
  selectors: {
    selectAnswers: answers => answers,
    selectAnswerById: (answers, id: number) => answers[id],
  },
})

// Action creators are generated for each case reducer function.
export const { addManyAnswers, updateAnswerTotalScore } = answersSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAnswers, selectAnswerById } = answersSlice.selectors
