import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectUserById } from "../../features/usersSlice"
import { Link } from "react-router-dom"
import {
  selectCommentById,
  deleteOneComment,
} from "../../features/commentsSlice"
import { selectSession } from "../../features/sessionSlice"
import { OpenModalButton } from "../Modals/OpenModalButton"
import { CommentForm } from "../Modals/CommentForm"
import "./CommentTile.css"
import { write } from "fs"

interface Props {
  id: number
}

export const CommentTile = ({ id }: Props) => {
  const dispatch = useAppDispatch()
  const comment = useAppSelector(state => selectCommentById(state, id))
  const writer = useAppSelector(state =>
    selectUserById(state, comment?.user_id),
  )
  const { user } = useAppSelector(selectSession)
  const belongsToCurrentUser = user && user.id === writer?.id

  const handleDeleteComment = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    dispatch(
      deleteOneComment({
        id: comment.id,
        content_type: comment.content_type,
        content_id: comment.content_id,
      }),
    )
  }
  if (comment) {
    return (
      <div>
        <div className="comment-body">
          <p>{comment.content}</p>
          <div className="comment-meta">
            <div className="comment-meta-left">
              <div>
                <Link to={`/user/${writer.id}`} className="comment-user">
                  @{writer.username}
                </Link>
              </div>

              <div>{comment.created_at}</div>
            </div>
            <div className="comment-meta-right">
              {belongsToCurrentUser && (
                <OpenModalButton
                  buttonText="Edit"
                  additionalClassNames={["edit"]}
                  modalComponent={
                    <CommentForm
                      id={id}
                      content_id={comment.content_id}
                      content_type={comment.content_type}
                    />
                  }
                />
              )}
              {belongsToCurrentUser && (
                <button className="delete-button" onClick={handleDeleteComment}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
        <hr className="comment-line" />
      </div>
    )
  }
}
