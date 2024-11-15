import {
  PayloadAction,
  Action,
  ActionCreator,
  ActionCreatorWithPayload,
  createAsyncThunk,
} from "@reduxjs/toolkit"
import { useAppSelector } from "../app/hooks"
import { createAppSlice } from "../app/createAppSlice"
import { SessionResponse, restoreSession, loginAsync } from "./sessionSlice"
export interface SaveItem {
  question_id: number;
  title: string;
  question_content: string;
  answer_id: number;
  answer_content: string;
  // comment_id: number;
  // comment_content: string;
  // parent_type: 'question' | 'answer';
}
export interface Save {
  id: number
  content_id: number
  content_type: "question" | "answer" | "comment"
}
export type SavesSliceState = {
  question: Record<number, Save>
  answer: Record<number, Save>
  comment: Record<number, Save>
  items: SaveItem[]
}
export type ToggleSaveRequest = {
  id: number
  content_id: number
  content_type: "question" | "answer" | "comment"
  savedStatus: boolean
}

interface toggleSaveError {
  error: string
}

// interface LoggedinAction extends PayloadAction<SessionResponse> {}

export const toggleSave = createAsyncThunk<
  ToggleSaveRequest,
  {
    id: number
    content_id: number
    content_type: "question" | "answer" | "comment"
  },
  { rejectValue: toggleSaveError }
>("saves/toggleSave", async (details, thunkApi) => {
  const { id, content_id, content_type } = details

  try {
    let response
    if (id === 0) {
      response = await fetch(`/api/saves/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id, content_type }),
      })
    } else {
      response = await fetch(`/api/saves/${id}`, { method: "DELETE" })
    }
    if (!response.ok) {
      const errorData = await response.json()
      return thunkApi.rejectWithValue(errorData)
    }

    const savedStatus = id === 0
    let item = { id, content_id, content_type }
    if (savedStatus) {
      item = await response.json()
    }

    const payload = { ...item, savedStatus: savedStatus }

    return payload
  } catch (error) {
    console.error(error)
    return thunkApi.rejectWithValue({ error: "Failed to toggle save status" })
  }
})

export const fetchAllSaves = createAsyncThunk
('saves/fetchAllSaves', async (_, thunkApi) => {
  try {
    const response = await fetch('/api/saves/currentuser');
    if (!response.ok) {
      const error = await response.json();
      return thunkApi.rejectWithValue(error);
    }
    const data = await response.json();
    return data.all_saves as SaveItem[];
  } catch (error) {
    console.error(error);
    return thunkApi.rejectWithValue({ error: 'Failed to fetch saves' });
  }
});

const isLogInAction = (
  action: Action,
): action is PayloadAction<SessionResponse> => {
  const [slice, actionName, status] = action.type.split("/")
  return (
    ["restoreSession", "loginAsync"].includes(actionName) &&
    status === "fulfilled"
  )
}

const initialState: SavesSliceState = {
  question: {},
  answer: {},
  comment: {},
  items: []
}

export const savesSlice = createAppSlice({
  name: "saves",
  initialState,
  reducers: {
    addManySaves(state, action: PayloadAction<Save[]>) {
      const saves = action.payload
      for (const save of saves) {
        const qOrA = save.content_type
        state[qOrA][save.content_id] = save
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(toggleSave.fulfilled, (state, action) => {
        const { savedStatus, ...newSave } = action.payload

        if (savedStatus)
          state[newSave.content_type][newSave.content_id] = { ...newSave }
        else delete state[newSave.content_type][newSave.content_id]
      })
      .addCase(fetchAllSaves.fulfilled, (state, action) => {
        state.items = action.payload
      })
      .addMatcher(isLogInAction, (state, action) => {
        if (action.payload && action.payload.user) {
          const { saves } = action.payload.user
          for (const save of saves) {
            const qOrA = save.content_type
            state[qOrA][save.content_id] = save
          }
        }
      })
  },
  selectors: {
    selectSaves: state => state,
    selectSaveByContentAndId: (
      state,
      content_type: "question" | "answer" | "comment",
      content_id: number,
    ) => {
      return state[content_type][content_id]
    },
    selectAllSaveItems: state => state.items
  },
})

// Action creators are generated for each case reducer function.
export const { addManySaves } = savesSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectSaves, selectSaveByContentAndId,selectAllSaveItems } = savesSlice.selectors
