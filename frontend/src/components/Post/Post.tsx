import { useState } from "react"
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
import { Tag } from "../Tag/Tag"
import { AnswerForm } from "../Modals/AnswerForm"
import { OpenModalButton } from "../Modals/OpenModalButton"
import { updateVote, selectVoteByContentAndId } from "../../features/votesSlice"
import { toggleSave, selectSaveByContentAndId } from "../../features/savesSlice"
import classNames from "classnames"
import React from "react"
import { VoteButton } from "./VoteButton"
import { SaveButton } from "./SaveButton"
import { CommentList, CommentListProps } from "../Comments/CommentList"
// import { CommentTile } from "../Comments/Comments"

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

export interface Props {
  type: "question" | "answer"
  id: number
}

// Post renders top level question or answer
export const Post = ({ type, id }: Props) => {
  const [isCommentsVisible, setCommentsVisible] = useState(false)
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
  const commentIds =
    post.type === "question" ? post.post.commentIds : post.post.commentIds

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

  const toggleComments = () => {
    setCommentsVisible(!isCommentsVisible)
  }

  return (
    <div>
      <div className={`post-body ${post.type}-body`}>
        <div className={`post-container ${post.type}-container`}>
          <div className="post-info">
            <div className="vote-counter-div">
              <div className="up-vote">
                <VoteButton id={id} type={type} voteType="up" />
              </div>
              <div className="vote-counter">{post.post.total_score}</div>
              <div className="down-vote">
                <VoteButton id={id} type={type} voteType="down" />
              </div>
              <div className="save">
                {/* // ? Idk why this is a ul so im just leaving both icons here until god saves me */}
                {/* <ul className="save-button"> */}
                {/* <i className="fa-regular fa-bookmark fa-xl"></i> */}
                <SaveButton id={id} type={type} />
                {/* </ul> */}
              </div>
            </div>
            <div className="post-interact" id={permalink}>
              <RenderPost postContent={post.post.content} />
              {post.type === "question" && (
                <div className="all-tags">
                  {post.post.tagIds.map((tagId, i) => (
                    <Tag key={tagId} tagId={tagId} />
                  ))}
                </div>
              )}
              <div className="post-meta">
                <div>
                  <a href={`#${permalink}`}>
                    <i className="fa-solid fa-xl fa-link"></i>
                  </a>

                  {isUserPostWriter && post.type === "question" ? (
                    <Link to={`edit`}>Edit {post.type}</Link>
                  ) : isUserPostWriter && post.type === "answer" ? (
                    <OpenModalButton
                      additionalClassNames={["edit"]}
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
                    <button
                      className="delete-button"
                      onClick={handleDeletePost}
                    >
                      Delete {type}
                    </button>
                  )}
                </div>
                <div className="post-user">
                  <Link
                    className="posted-by-user"
                    to={`/user/${postWriter.id}`}
                  >
                    {postWriter.username}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <a
            className="comment-toggle"
            style={{ cursor: "pointer" }}
            onClick={toggleComments}
          >
            {isCommentsVisible ? "Hide Comments" : "Show Comments"}
          </a>
          <div className="comment-break"></div>
        </div>
        {isCommentsVisible && <CommentList commentIds={commentIds} />}
      </div>
    </div>
  )
}
