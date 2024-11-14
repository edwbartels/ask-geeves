import React, { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { FetchOneQuestionResponse } from "../../features/api-types"
import {
  selectQuestionById,
  createOneQuestion,
  CreateQuestionError,
  fetchOneQuestion,
} from "../../features/questionsSlice"
import { selectTags, Tag, cleanTagName } from "../../features/tagsSlice"

import { RenderPost } from "./RenderPost"

import "./Post.css"
import { Errors } from "../Errors/Errors"
import { TagSelector } from "./TagSelector"

interface MinimalTag {
  // no id field in case a new tag is added
  id?: number
  name: string
  cleanedName: string
}
interface QuestionForm {
  title: string
  content: string
  // tagIds: number[]
}
interface Error {
  type: string
  message: string
}
export const CreateOrEditPost = () => {
  // console.log("first render")
  const { questionId } = useParams()
  // const questionIdNum = Number(questionId)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState<QuestionForm>({
    title: "",
    content: "",
    // tagIds: [],
  })
  const [selectedTags, setSelectedTags] = useState<MinimalTag[]>([])
  const [errors, setErrors] = useState<Error | null>(null)
  const [isLoadedQuestion, setIsLoadedQuestion] = useState(false)
  const isDisabledSubmit = Object.values(form).some(value => value.length === 0)
  /* Fetch question instead of accessing the store in case user directly visits the edit page or refreshes */
  if (!isLoadedQuestion && questionId) {
    fetch(`/api/questions/${questionId}`)
      .then(res => {
        setIsLoadedQuestion(true)
        if (!res.ok) {
          throw res
        }
        return res.json()
      })
      .then(({ question }: FetchOneQuestionResponse) => {
        setForm({
          title: question.title,
          content: question.content,
        })
        const cleanedTags = question.Tags.map(tag => ({
          ...tag,
          cleanedName: cleanTagName(tag.name),
        }))
        setSelectedTags(cleanedTags)
      })
      .catch(error => {
        if (error.status === 500) {
          setErrors({ type: error.type, message: error.statusText })
        } else if (error.status === 404) {
          setErrors({ type: "Not found", message: error.statusText })
        } else {
          setErrors(error)
        }
      })
  }

  // const tagsInputRef = useRef<HTMLInputElement>(null)
  // const tagsListRef = useRef<HTMLDivElement>(null)
  // const [showTagList, setShowTagList] = useState(false)
  const allTags = useAppSelector(selectTags)
  // const availableTagsToAdd = Object.values(allTags).filter(
  //   tag => !selectedTags.includes(tag.id),
  // )
  const handleChangeForm =
    (field: string) =>
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.currentTarget.value })
      if (field === "content") {
        // setPreview(renderMdToNode(e.currentTarget.value))
      }
    }

  // const handleFocusTagInput = (e: MouseEvent) => {
  //   setShowTagList(true)
  // }
  // const handleClickOutside = (e: MouseEvent) => {
  //   if (
  //     tagsInputRef.current &&
  //     !tagsInputRef.current.contains(e.target as Node) &&
  //     tagsListRef.current &&
  //     !tagsListRef.current.contains(e.target as Node)
  //   ) {
  //     setShowTagList(false)
  //   }
  // }
  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside)
  //   return () => document.removeEventListener("click", handleClickOutside)
  // })
  // const handleSelectTag =
  //   (tagId: number) => (e: React.MouseEvent<HTMLDivElement>) => {
  //     console.log("tagId received", tagId, [...selectedTags, tagId])
  //     e.stopPropagation()
  //     setSelectedTags([...selectedTags, ])
  //   }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const tag = selectedTags.map(tag => tag.name)
      const newQuestion = { ...form, tag }
      const response = await dispatch(createOneQuestion(newQuestion)).unwrap()
      const { id: questionId } = response
      navigate(`/questions/${questionId}`)
    } catch (e) {}
  }

  return (
    <div className="post">
      <h1 className="new-question-title">New Question</h1>
      <form onSubmit={handleSubmitForm}>
        <div>
          {/* {storeErrors && <Errors errors={storeErrors.errors} />} */}
          {/* {storeErrors && storeErrors.errors.title && (
            <Errors errors={storeErrors.errors.title} />
          )} */}
          <label>
            <div className="title-required">Title*</div>
            <input
              name="title"
              className="post-title-input"
              type="text"
              defaultValue={form.title}
              placeholder="Question title..."
              onChange={handleChangeForm("title")}
            />
          </label>
        </div>
        <div>
          {/* {storeErrors && storeErrors.errors.content && (
            <Errors errors={storeErrors.errors.content} />
          )} */}
          <label>
            <div className="question-required">Question*</div>
            <textarea
              className="post-body-textarea"
              // cols={80}
              rows={10}
              name="content"
              defaultValue={form.content}
              placeholder="Question body..."
              onChange={handleChangeForm("content")}
            />
          </label>
        </div>
        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={Object.values(allTags)}
        />
        <div className="buttons-div">
          {/* <button className="submit-question">Submit question</button> */}
          <button className={`submit-question ${isDisabledSubmit ? "disabled" : ""}`}
          disabled={isDisabledSubmit}>Submit question</button>
          <button className="cancel-question">Cancel</button>
        </div>
      </form>

      <RenderPost postContent={form.content} />
    </div>
  )
}
