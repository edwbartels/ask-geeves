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
import { updateVote, selectVoteByContentAndId } from "../../features/votesSlice"
import { toggleSave, selectSaveByContentAndId } from "../../features/savesSlice"
import classNames from "classnames"
import React from "react"

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
interface VoteButtonProps {
  id: number
  type: "question" | "answer"
  voteType: "up" | "down"
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
  // const handleUpvote = () => {
  //   console.log("clicked upvote")
  //   dispatch(updateVote({ content_id: id, content_type: type, value: 1 }))
  // }

  // const handleDownvote = () => {
  //   console.log("clicked downvote")
  //   dispatch(updateVote({ content_id: id, content_type: type, value: -1 }))
  // }

  const VoteButton: React.FC<VoteButtonProps> = ({ id, type, voteType }) => {
    const voteInstance = useAppSelector(state =>
      selectVoteByContentAndId(state, type, id),
    )

    const isActive =
      (voteType === "up" && voteInstance?.value === 1) ||
      (voteType === "down" && voteInstance?.value === -1)
    console.log(isActive)

    const handleVote = () => {
      const voteValue = voteType === "up" ? 1 : -1
      dispatch(
        updateVote({ content_id: id, content_type: type, value: voteValue }),
      )
    }

    const buttonClass = classNames({
      up: voteType === "up",
      down: voteType === "down",
      "vote-active": isActive,
    })

    return (
      <button className={buttonClass} onClick={handleVote}>
        {voteType === "up" ? (
          <i className="fa-solid fa-2x fa-arrow-up"></i>
        ) : (
          <i className="fa-solid fa-2x fa-arrow-down"></i>
        )}
      </button>
    )
  }
  const SaveButton: React.FC<Props> = ({ id, type }) => {
    const saveInstance = useAppSelector(state =>
      selectSaveByContentAndId(state, type, id),
    )

    const isSaved = !!saveInstance

    const handleToggleSave = () => {
      console.log("Clicked Save! Save ID:", saveInstance)
      dispatch(
        toggleSave({
          id: saveInstance?.id || 0,
          content_id: id,
          content_type: type,
        }),
      )
    }
    const buttonClass = classNames("save-button", {
      "save-active": isSaved,
    })
    return (
      <button className={buttonClass} onClick={handleToggleSave}>
        {isSaved ? "Saved" : "Save"}
      </button>
    )
  }

  return (
    <div>
      <div className="post-body">
        <div className="vote-counter-div">
          <div className="up-vote">
            <VoteButton id={id} type={type} voteType="up" />
            {/* <button className="up" onClick={handleUpvote}>
              <i className="fa-solid fa-2x fa-arrow-up"></i>
            </button> */}
          </div>
          <div className="vote-counter">{post.post.total_score}</div>
          <div className="down-vote">
            <VoteButton id={id} type={type} voteType="down" />
            {/* <button className="down" onClick={handleDownvote}>
              <i className="fa-solid fa-2x fa-arrow-down"></i>
            </button> */}
          </div>
          <div className="save">
            <SaveButton id={id} type={type} />
            {/* <button className="save-button" onClick={handleToggleSave}>Save</button> */}
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
                <button className="delete-button" onClick={handleDeletePost}>
                  Delete {type}
                </button>
              )}
            </div>
            <div className="post-user">
              Posted by{" "}
              <Link className="posted-by-user" to={`/user/${postWriter.id}`}>
                {postWriter.username}
              </Link>
            </div>
          </div>
          <div className="comments-here">Comments here</div>
        </div>
      </div>
    </div>
  )
}
