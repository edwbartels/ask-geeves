import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectUserById } from "../../features/usersSlice"
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
    dispatch(deleteOneComment({ id: id }))
  }
  if (comment) {
    return (
      <div>
        <div className="comment-body">
          <p>{comment.content}</p>
          <div className="comment-meta">
            <div>{comment.created_at}</div>
            {belongsToCurrentUser && (
              <OpenModalButton
                buttonText="Edit"
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
            <a href={`/user/${writer.id}`}>@{writer.username}</a>
          </div>
        </div>
        <hr className="comment-line" />
      </div>
    )
  }
}
