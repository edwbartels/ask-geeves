import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { User } from "./usersSlice"
// import { Comment } from "./api-types"
import { UpdateVoteResponse } from "./votesSlice"
import { deleteOneAnswer } from "./answersSlice"

export interface Comment {
  id: number
  user_id: number
  content_type: "question" | "answer"
  content_id: number
  content: string
  total_score: number
  created_at: string
  updated_at: string
}
export interface CommentForm {
  content: string
  //   userId: number
  content_id: number
  content_type: "question" | "answer"
}
export interface CommentEntry {
  id: number
  user_id: number
  content_type: "question" | "answer"
  content_id: number
  content: string
  total_score: number
  created_at: string
  updated_at: string
}

export interface CreateCommentResponse {
  comment: {
    id: number
    user_id: number
    content_type: "question" | "answer"
    content_id: number
    content: string
    created_at: string
    updated_at: string
    total_score: number
    CommentUser: User
  }
}

export interface CreateCommentValidationError {
  error: string
}

export interface DeleteCommentResponse {
  message: string
  id: number
  content_id: number
  content_type: "question" | "answer"
}

export interface DeleteCommentError {
  error: string
}

export interface EditCommentForm extends CommentForm {
  id: number
}

export interface EditCommentError {
  error: string
}
export type CommentsSliceState = Record<number, CommentEntry>

export const createOneComment = createAsyncThunk<
  CreateCommentResponse,
  CommentForm,
  { rejectValue: CreateCommentValidationError }
>("comments/createOneComment", async (commentInput, thunkApi) => {
  const { content, content_id, content_type } = commentInput
  const url = `/api/comments/0`
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, content_type, content_id }),
  })
  if (!response.ok) {
    const errorResponse = await response.json()
    thunkApi.rejectWithValue(errorResponse)
  }

  const comment: CreateCommentResponse = await response.json()

  thunkApi.dispatch(addManyComments([comment.comment]))

  return comment
})

export const editOneComment = createAsyncThunk<
  CreateCommentResponse,
  EditCommentForm,
  { rejectValue: EditCommentError }
>("comments/editOneComment", async (editCommentInput, thunkApi) => {
  const id = editCommentInput.id
  const url = `/api/comments/${id}`
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editCommentInput),
  })
  if (!response.ok) {
    const error = await response.json()
    thunkApi.rejectWithValue(error)
  }
  const comment: CreateCommentResponse = await response.json()
  thunkApi.dispatch(addManyComments([comment.comment]))
  return comment
})

export const deleteOneComment = createAsyncThunk<
  DeleteCommentResponse,
  { id: number; content_type: "question" | "answer"; content_id: number },
  { rejectValue: DeleteCommentError }
>("comments/deleteOneComment", async (deleteInput, thunkApi) => {
  const { id, content_type, content_id } = deleteInput

  const url = `/api/comments/${id}`
  const response = await fetch(url, { method: "DELETE" })
  if (!response.ok) {
    const error = await response.json()
    thunkApi.rejectWithValue(error)
  }

  const deletedComment = await response.json()
  return { message: deletedComment.message, id, content_id, content_type }
})

const initialState: CommentsSliceState = {}

export const commentsSlice = createAppSlice({
  name: "comments",
  initialState,
  reducers: create => {
    return {
      addManyComments: create.reducer(
        (state, action: PayloadAction<Comment[]>) => {
          for (const comment of action.payload) {
            const { id, ...remaining } = comment
            state[id] = comment
          }
        },
      ),
      updateCommentTotalScore: create.reducer(
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
    builder.addCase(deleteOneComment.fulfilled, (state, action) => {
      const { id } = action.payload
      delete state[id]
    })
  },
  selectors: {
    selectComments: comments => comments,
    selectCommentById: (comments, id: number) => comments[id],
  },
})

export const { addManyComments, updateCommentTotalScore } =
  commentsSlice.actions

export const { selectComments, selectCommentById } = commentsSlice.selectors
