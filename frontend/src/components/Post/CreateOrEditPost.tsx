import React, { useState, ReactNode } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { createOneQuestion } from "../../features/questionsSlice"

import { RenderPost } from "./RenderPost"

import "./Post.css"
import { error } from "console"

export const CreateOrEditPost = () => {
  const { questionId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const emptyForm = {
    title: "",
    content: "",
    tag: [],
  }
  const errors = useAppSelector(state => state.questions.error)

  const selectQuestionDetails = (questionId: string | undefined) => {
    // Placeholder function, will replace with store slice selector
    if (questionId === undefined) return null
    return { title: "question title", content: "question body" }
  }
  const initialForm = selectQuestionDetails(questionId) ?? emptyForm
  const [form, setForm] = useState(initialForm)

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
    const response = await dispatch(createOneQuestion(form))
    console.log(response)
    console.log(errors)
    // navigate(`/questions/${questionId}`)
  }
  // console.log(errors)
  return (
    <div className="post">
      <h1>New Question</h1>
      <form onSubmit={handleSubmitForm}>
        <div>
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
