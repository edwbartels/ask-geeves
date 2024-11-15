import { createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../app/createAppSlice"

export interface Tag {
  id: number
  name: string
}
export interface TagWithCleanName extends Tag {
  cleanedName: string
}
export interface GetAllTagsResponse {
  tags: Tag[]
}

export interface GetAllTagsError {}
export type TagsSliceState = {
  tags: Record<number, TagWithCleanName>
  errors: string | null
}
export const cleanTagName = (name: string) => {
  return name
    .replace(/[^a-zA-Z0-9\s]/, "")
    .replace(/[\s]/, "-")
    .toLowerCase()
}

export const getAllTags = createAsyncThunk<GetAllTagsResponse, void>(
  "tags/getAllTags",
  async (_, thunkApi) => {
    const response = await fetch("/api/questions/tags")
    if (!response.ok) {
      const error = await response.json()
      return error
    }
    const tags: GetAllTagsResponse = await response.json()
    return tags
  },
)

const initialState: TagsSliceState = { tags: {}, errors: null }

// If you are not using async thunks you can use the standalone `createSlice`.
export const tagsSlice = createAppSlice({
  name: "tags",
  initialState,
  reducers: create => {
    return {
      addTag: create.reducer((state, action: PayloadAction<Tag>) => {
        const tag = action.payload
        const { id } = tag
        const cleanedName = cleanTagName(tag.name)
        state.tags[id] = { ...action.payload, cleanedName }
      }),
      addManyTags: create.reducer((state, action: PayloadAction<Tag[]>) => {
        for (const tag of action.payload) {
          const cleanedName = cleanTagName(tag.name)
          state.tags[tag.id] = { ...tag, cleanedName }
        }
      }),
    }
  },
  extraReducers: builder => {
    builder.addCase(getAllTags.fulfilled, (state, action) => {
      const { tags } = action.payload
      for (const tag of tags) {
        const { id } = tag
        const cleanedName = cleanTagName(tag.name)
        state.tags[id] = { ...tag, cleanedName }
      }
    })
  },
  selectors: {
    selectTags: tags => tags.tags,
    selectTagsArr: tags => Object.values(tags.tags),
    selectTagById: (tags, id: number) => tags.tags[id],
  },
})

// Action creators are generated for each case reducer function.
export const { addTag, addManyTags } = tagsSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectTags, selectTagsArr, selectTagById } = tagsSlice.selectors
