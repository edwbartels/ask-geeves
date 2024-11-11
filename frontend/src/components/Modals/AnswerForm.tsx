import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal"
import { RenderPost } from "../Post/RenderPost"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { Question } from "../../features/questionsSlice"
import {
  createOneAnswer,
  editOneAnswer,
  selectAnswerById,
} from "../../features/answersSlice"
import { selectSession } from "../../features/sessionSlice"
import { selectQuestionById } from "../../features/questionsSlice"
interface Props {
  questionId: number
  answerId?: number
}
export const AnswerForm = ({ questionId, answerId }: Props) => {
  const dispatch = useAppDispatch()
  const { closeModal } = useModal()
  const question = useAppSelector(state =>
    selectQuestionById(state, questionId),
  )
  const answer = answerId
    ? useAppSelector(state => selectAnswerById(state, answerId))?.content
    : ""
  const sessionUser = useAppSelector(selectSession)
  const [form, setForm] = useState(answer || "")
  const handleChangeForm = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(e.target.value)
  }
  const handleSubmitAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitting form")
    if (sessionUser.user) {
      const userId = sessionUser.user.id
      const questionId = question.id
      const answerForm = { questionId, userId, content: form }
      if (!answerId) {
        const response = await dispatch(createOneAnswer(answerForm)).unwrap()
        const { id: answerId } = response.answer
        // console.log("submitted form", form)
        closeModal()
      } else if (answerId) {
        const response = await dispatch(
          editOneAnswer({ answerId, ...answerForm }),
        ).unwrap()
      }
      closeModal()
    }
  }
  if (!question) {
    return <div>Loading question...</div>
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
              value={form}
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
