import { Link, useParams, useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectSession } from "../../features/sessionSlice"
import { selectUserById } from "../../features/usersSlice"
import {
  Question,
  selectQuestionById,
  deleteOneQuestion,
} from "../../features/questionsSlice"
import {
  selectAnswerById,
  Answer,
  deleteOneAnswer,
} from "../../features/answersSlice"
import { RenderPost } from "./RenderPost"
import { AnswerForm } from "../Modals/AnswerForm"
import { OpenModalButton } from "../Modals/OpenModalButton"




const absurd = (input: never): never => input
type PostType =
  | {
      type: "question"
      post: Question
    }
  | {
      type: "answer"
      post: Answer
    }

interface Props {
  type: "question" | "answer"
  id: number
}
// Post renders top level question or answer
export const Post = ({ type, id }: Props) => {
  const returnQuestionOrAnswerPost = (
    type: "question" | "answer",
    id: number,
  ): PostType => {
    if (type === "question") {
      const post = useAppSelector(state => selectQuestionById(state, id))
      return { type: "question", post: post }
    } else if (type === "answer") {
      const post = useAppSelector(state => selectAnswerById(state, id))
      return { type: "answer", post: post }
    } else {
      return absurd(type)
    }
  }
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  // const { questionId } = useParams() // Post will always get rendered at /questions/:questionId
  const post = returnQuestionOrAnswerPost(type, id)
  const { user } = useAppSelector(selectSession)
  const isUserPostWriter = user && user.id === post.post.user_id

  if (!post) {
    // return <div>Loading post...</div>
    return <></>
  }

  const getPermalinkTitle = (post: PostType) => {
    const permalinkBase = `${post.type}`
    if (post.type === "question") {
      const { post: question } = post
      return `${permalinkBase}-${question.id}-${question.title.replaceAll(" ", "-").slice(0, 20).toLowerCase()}`
    } else if (post.type === "answer") {
      return permalinkBase
    } else {
      const absurd = (input: never): never => input
      return absurd(post)
    }
  }

  const permalink = getPermalinkTitle(post)
  const postWriter = useAppSelector(state =>
    selectUserById(state, post.post.user_id),
  )

  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (post.type === "question") {
      dispatch(deleteOneQuestion(id))
      navigate("/questions")
    } else if (post.type === "answer") {
      const { question_id, id } = post.post
      dispatch(deleteOneAnswer({ questionId: question_id, answerId: id }))
    }
  }
  return (
    <div>
      <div className="post-body">
        <div className="vote-counter-div">
          <div className="up-vote">
            <button className="up"><i className="fa-solid fa-2x fa-arrow-up"></i></button>
          </div>
          <div className="vote-counter">{post.post.total_score}</div>
          <div className="down-vote">
            <button className="down"><i className="fa-solid fa-2x fa-arrow-down"></i></button>
          </div>
          <div className="save">
            <button className="save-button">Save</button>
          </div>
        </div>
        <div id={permalink}>
          <RenderPost postContent={post.post.content} />
          <div className="post-meta">
            <div>
              <a href={`#${permalink}`}>Share</a> |<button>Like post</button>
              {isUserPostWriter && post.type === "question" ? (
                <Link to={`edit`}>Edit {post.type}</Link>
              ) : post.type === "answer" ? (
                <OpenModalButton
                  buttonText="Edit answer"
                  modalComponent={
                    <AnswerForm
                      questionId={post.post.question_id}
                      answerId={post.post.id}
                    />
                  }
                />
              ) : (
                ""
              )}
              
              {isUserPostWriter && (
                <button className="delete-button" onClick={handleDeletePost}>Delete {type}</button>
              )}
            </div>
            <div className="post-user">
              Posted by{" "}

              <Link className="posted-by-user" to={`/user/${postWriter.id}`}>{postWriter.username}</Link>
            </div>
          </div>
          <div className="comments-here">Comments here</div>
        </div>
      </div>
    </div>
  )
}
