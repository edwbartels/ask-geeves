import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"
import { createSelector } from "reselect"
import type { AppThunk } from "../app/store"
import {
  FetchAllQuestionsResponse,
  FetchOneQuestionResponse,
} from "./api-types"
import { User, addManyUsers } from "./usersSlice"
import { addManyVotes, UpdateVoteResponse } from "./votesSlice"
import {
  addManyAnswers,
  createOneAnswer,
  deleteOneAnswer,
} from "./answersSlice"
import {
  addManyComments,
  createOneComment,
  deleteOneComment,
} from "./commentsSlice"
import { Tag, addManyTags } from "./tagsSlice"

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
  num_comments: number
  questionSave: boolean

  answerIds: number[]
  commentIds: number[]
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

interface Comment {
  id: number
  user_id: number
  content_type: "answer"
  content_id: number
  content: string
  total_score: number
  created_at: string
  updated_at: string

  // user object that matches answer-comment writer
  CommentUser: {
    id: number
    first_name: string
    last_name: string
    username: string
  }
}

export type QuestionsSliceState = {
  questions: Record<number, Question>
  allQuestionsInfo: {
    page: number
    num_pages: number
  }
  error: CreateQuestionError | null
}

export const fetchAllQuestions = createAsyncThunk<
  // Return type of the payload creator
  Question[],
  // First argument to payload creator
  string,
  // Optional fields for thunkApi types
  { rejectValue: FetchAllQuestionsError }
>("questions/fetchAll", async (searchParams, thunkApi) => {
  // const { page } = pageSettings || 1
  // const { size } = pageSettings || 15
  // const { tagName } = pageSettings
  // const fetchUrl = tagName
  //   ? `/api/questions/?page=${page}&per_page=${size}&sort_by=id`
  //   : `/api/questions/?page=${page}&per_page=${size}&sort_by=id`
  const fetchUrl = `/api/questions/?sort_by=id&${searchParams}`
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
      tags: Tag[]
      tagIds: Set<number>
    }
    const payload: payload = {
      questions: [],
      users: [],
      userIds: new Set(),
      tags: [],
      tagIds: new Set(),
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
      // only add unique tag objects from the API response
      for (const tag of Tags) {
        if (!payload.tagIds.has(tag.id)) {
          payload.tagIds.add(tag.id)
          payload.tags.push(tag)
        }
      }
    }
    thunkApi.dispatch(updateAllQuestionsInfo({ page, num_pages }))
    // thunkApi.dispatch(
    //   setAllQuestionsSettings({
    //     page: page,
    //     size: size,
    //     num_pages: num_pages,
    //   }),
    // )
    thunkApi.dispatch(addManyUsers(payload.users))
    thunkApi.dispatch(addManyTags(payload.tags))
    return payload.questions
  } else {
    return thunkApi.rejectWithValue({ error: "Couldn't fetch all questions!" })
  }
})

export const fetchTaggedQuestions = createAsyncThunk<
  // Return type of the payload creator
  Question[],
  // First argument to payload creator
  { tagName: string; page: string; size: string },
  // Optional fields for thunkApi types
  { rejectValue: FetchAllQuestionsError }
>("questions/fetchTagged", async (pageSettings, thunkApi) => {
  const { page } = pageSettings || 1
  const { size } = pageSettings || 15
  const { tagName } = pageSettings
  const fetchUrl = `/api/questions?tag=${tagName}&page=${page}&per_page=${size}&sort_by=id`
  const response = await fetch(fetchUrl)
  if (response.ok) {
    const allQuestions: FetchAllQuestionsResponse = await response.json()
    const { page, size, num_pages, questions } = allQuestions
    interface payload {
      questions: Question[]
      users: User[]
      userIds: Set<number>
      tags: Tag[]
      tagIds: Set<number>
    }
    const payload: payload = {
      questions: [],
      users: [],
      userIds: new Set(),
      tags: [],
      tagIds: new Set(),
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
      // only add unique tag objects from the API response
      for (const tag of Tags) {
        if (!payload.tagIds.has(tag.id)) {
          payload.tagIds.add(tag.id)
          payload.tags.push(tag)
        }
      }
    }

    // thunkApi.dispatch(
    //   setAllQuestionsSettings({
    //     page: page,
    //     size: size,
    //     num_pages: num_pages,
    //   }),
    // )
    thunkApi.dispatch(addManyUsers(payload.users))
    thunkApi.dispatch(addManyTags(payload.tags))
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
    const commentIds = Comments.map(comment => comment.id)
    const tagIds = Tags.map(tag => tag.id)
    const questionPayload = {
      ...remaining,
      user_id: QuestionUser.id,
      answerIds,
      commentIds,
      tagIds,
    }
    const tagsPayload = Tags
    const votesPayload = Votes
    // answersPayload
    const answerComments: Comment[] = []
    const answersPayload = Answers.map(answer => {
      const { AnswerUser, Comments, ...remaining } = answer
      const user_id = AnswerUser.id
      answerComments.push(...Comments)
      const commentIds = Comments.map(comment => {
        return comment.id
      })
      return { ...remaining, user_id, commentIds }
    })

    const allComments = [...answerComments, ...Comments]
    const commentsPayload = allComments.map(comment => {
      const { CommentUser, ...remaining } = comment
      return { ...remaining }
    })
    thunkApi.dispatch(addManyAnswers(answersPayload))
    thunkApi.dispatch(addManyComments(commentsPayload))

    // add user objects from QuestionUser, Comments.CommentUser, and Answers.AnswerUser
    const uniqueUserIds = new Set()
    const usersPayload = []
    const allReturnedUsers = [
      QuestionUser,
      ...allComments.map(comment => comment.CommentUser),
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
    commentIds: Comments.map(comment => comment.id),
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
  thunkApi.dispatch(addManyTags(tagsPayload))
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

const initialState: QuestionsSliceState = {
  questions: {},
  allQuestionsInfo: { page: 1, num_pages: 1 },
  error: null,
}

// If you are not using async thunks you can use the standalone `createSlice`.
export const questionsSlice = createAppSlice({
  name: "questions",
  initialState,
  reducers: create => {
    return {
      updateQuestionTotalScore: create.reducer(
        (state, action: PayloadAction<UpdateVoteResponse>) => {
          const { content_id, total_score } = action.payload
          if (state.questions[content_id]) {
            state.questions[content_id].total_score = total_score
          }
        },
      ),
      updateAllQuestionsInfo: create.reducer(
        (state, action: PayloadAction<{ page: number; num_pages: number }>) => {
          state.allQuestionsInfo = action.payload
        },
      ),
      incrementCurrentPage: create.reducer(state => {
        const currentPage = state.allQuestionsInfo.page
        const totalPages = state.allQuestionsInfo.num_pages
        if (currentPage < totalPages) {
          const nextPage = currentPage + 1
          state.allQuestionsInfo.page = nextPage
        }
      }),
      decrementCurrentPage: create.reducer(state => {
        const currentPage = state.allQuestionsInfo.page
        if (currentPage > 1) {
          const nextPage = currentPage - 1
          state.allQuestionsInfo.page = nextPage
        }
      }),
    }
  },
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
      .addCase(createOneComment.fulfilled, (state, action) => {
        const { content_id, content_type, id } = action.payload.comment
        if (content_type === "question")
          state.questions[content_id].commentIds?.push(id)
      })
      .addCase(deleteOneComment.fulfilled, (state, action) => {
        const { content_id, content_type, id } = action.payload
        if (content_type === "question") {
          const oldCommentIds = state.questions[content_id].commentIds
          state.questions[content_id].commentIds = oldCommentIds?.filter(
            old => old !== id,
          )
        }
      })
      .addCase(fetchTaggedQuestions.fulfilled, (state, action) => {
        state.questions = {}
        const questions = action.payload
        for (const question of questions) {
          const { id } = question
          state.questions[id] = question
        }
      })
  },
  selectors: {
    selectQuestions: state => state,
    selectQuestionsArr: createSelector(
      state => state.questions,
      questions => Object.values(questions),
    ),
    selectQuestionById: (state, id: number) => state.questions[id],
  },
})

// Action creators are generated for each case reducer function.
export const {
  updateQuestionTotalScore,
  updateAllQuestionsInfo,
  incrementCurrentPage,
  decrementCurrentPage,
} = questionsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectQuestions, selectQuestionsArr, selectQuestionById } =
  questionsSlice.selectors
