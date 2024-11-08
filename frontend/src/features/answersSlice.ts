import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"

export interface Answer {
  id: number
  user_id: number
  question_id: number
  accepted: boolean
  content: string
  created_at: string
  updated_at: string

  total_score: number // db aggregate function
}
export type AnswersSliceState = Record<number, Answer>

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
    }
  },
  selectors: {
    selectAnswers: answers => answers,
    selectAnswerById: (answers, id: number) => answers[id],
  },
})

// Action creators are generated for each case reducer function.
export const { addManyAnswers } = answersSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectAnswers, selectAnswerById } = answersSlice.selectors
