import React, { useState, ReactNode } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
  selectQuestionById,
  createOneQuestion,
  CreateQuestionError,
} from "../../features/questionsSlice"
import { selectSession } from "../../features/sessionSlice"

import { RenderPost } from "./RenderPost"

import "./Post.css"
import { Errors } from "../Errors/Errors"

export const CreateOrEditPost = () => {
  const { questionId } = useParams()
  const questionIdNum = Number(questionId)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const emptyForm = {
    title: "",
    content: "",
    tag: [],
  }

  const storeErrors = useAppSelector(state => state.questions.error)

  const selectQuestionDetails = useAppSelector(state =>
    selectQuestionById(state, questionIdNum),
  )
  console.log({ selectQuestionDetails, questionId })
  const initialForm = selectQuestionDetails ?? emptyForm
  const [form, setForm] = useState(initialForm)
  const [componentErrors, setComponentErrors] =
    useState<CreateQuestionError | null>(null)

  const handleChangeForm =
    (field: string) =>
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.currentTarget.value })
      if (field === "content") {
        // setPreview(renderMdToNode(e.currentTarget.value))
      }
    }

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await dispatch(createOneQuestion(form)).unwrap()
      const { id: questionId } = response
      navigate(`/questions/${questionId}`)
    } catch (e) {}
  }
  return (
    <div className="post">
      <h1>New Question</h1>
      <form onSubmit={handleSubmitForm}>
        <div>
          {/* {storeErrors && <Errors errors={storeErrors.errors} />} */}
          {storeErrors && storeErrors.errors.title && (
            <Errors errors={storeErrors.errors.title} />
          )}
          <label>
            <div>Title*</div>
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
          {storeErrors && storeErrors.errors.content && (
            <Errors errors={storeErrors.errors.content} />
          )}
          <label>
            <div>Question*</div>
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
        <button>Submit question</button>
        <button>Cancel</button>
      </form>

      <RenderPost postContent={form.content} />
    </div>
  )
}
