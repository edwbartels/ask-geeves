import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal"
import { RenderPost } from "../Post/RenderPost"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { Question } from "../../features/questionsSlice"
import { createOneAnswer } from "../../features/answersSlice"
import { selectSession } from "../../features/sessionSlice"
interface Props {
  question: Question
}
export const AnswerForm = ({ question }: Props) => {
  const dispatch = useAppDispatch()
  const { closeModal } = useModal()
  const [form, setForm] = useState("")
  const handleChangeForm = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(e.target.value)
  }
  const sessionUser = useAppSelector(selectSession)
  const handleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitting form")
    if (sessionUser.user) {
      const userId = sessionUser.user.id
      const questionId = question.id
      const answerForm = { questionId, userId, content: form }
      const response = await dispatch(createOneAnswer(answerForm)).unwrap()
      const { id: answerId } = response.answer
      console.log("submitted form", form)
      closeModal()
    }
  }
  return (
    <div className="answer-modal">
      <button onClick={closeModal} className="close-modal-button">
        Close form X
      </button>
      <div className="answer-modal-form">
        <h1>Add your answer</h1>
        <form onSubmit={handleSubmitAnswer}>
          <button>Submit answer</button>
          <div>
            <textarea
              onChange={handleChangeForm}
              placeholder="Answer..."
              rows={10}
            />
          </div>
        </form>
        <RenderPost postContent={form} />
      </div>
      <div className="answer-modal-question-content">
        <h1>{question.title}</h1>
        <RenderPost postContent={question.content} />
      </div>
    </div>
  )
}
