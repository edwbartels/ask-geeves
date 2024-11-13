import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useModal } from "../../context/Modal"
import { RenderPost } from "../Post/RenderPost"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { Question } from "../../features/questionsSlice"
import { Answer, selectAnswerById } from "../../features/answersSlice"
// import {
//   createOneAnswer,
//   editOneAnswer,
//   selectAnswerById,
// } from "../../features/answersSlice"
import {
  createOneComment,
  editOneComment,
  selectCommentById,
} from "../../features/commentsSlice"
import { selectSession } from "../../features/sessionSlice"
import "./AnswerForm.css"
import "./CommentForm.css"
import "../Post/Post.css"
import { selectQuestionById } from "../../features/questionsSlice"

interface Props {
  content_id: number
  content_type: "question" | "answer"
  id?: number
}

export const CommentForm = ({ id, content_id, content_type }: Props) => {
  const dispatch = useAppDispatch()
  const { closeModal } = useModal()
  const parent: Question | Answer =
    content_type === "question"
      ? useAppSelector(state => selectQuestionById(state, content_id))
      : useAppSelector(state => selectAnswerById(state, content_id))

  const comment = id
    ? useAppSelector(state => selectCommentById(state, id))?.content
    : ""

  const sessionUser = useAppSelector(selectSession)
  const [form, setForm] = useState(comment || "")
  const handleChangeForm = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(e.target.value)
  }
  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("submitting form")
    if (sessionUser.user) {
      const userId = sessionUser.user.id
      const content_id = parent.id
      const commentForm = { content_id, content_type, content: form }
      if (!id) {
        const response = await dispatch(createOneComment(commentForm)).unwrap()
        const { id: commentId } = response.comment
        // console.log("submitted form", form)
        closeModal()
      } else if (id) {
        const response = await dispatch(
          editOneComment({ id, ...commentForm }),
        ).unwrap()
      }
      closeModal()
    }
  }
  if (!parent) {
    return <div>Loading {`${content_type}`}</div>
  }
  return (
    <div className="comment-modal">
      <button onClick={closeModal} className="close-modal-button">
        Close form X
      </button>
      <div className="comment-modal-form">
        <h1 className="add-your-comment-title">Add your comment</h1>
        <form onSubmit={handleSubmitComment}>
          <div>
            <textarea
              className="comment-box"
              onChange={handleChangeForm}
              placeholder="Comment..."
              rows={10}
              value={form}
            />
          </div>
          <div className="submit-comment-button-div">
            <button className="submit-new-comment-button">
              Submit comment
            </button>
          </div>
        </form>
        <RenderPost postContent={form} />
      </div>
      <div className="comment-modal-parent-content">
        <h1 className="parent-title-preview">
          {content_type === "question"
            ? parent.title
            : parent.content.slice(0, 50)}
        </h1>
        <RenderPost postContent={parent.content} />
      </div>
    </div>
  )
}
