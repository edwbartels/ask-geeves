import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../../features/usersSlice"
import { selectCommentById } from "../../features/commentsSlice"
import { NavLink } from "react-router-dom"

interface Props {
  id: number
}

export const CommentTile = ({ id }: Props) => {
  const comment = useAppSelector(state => selectCommentById(state, id))
  const writer = useAppSelector(state => selectUserById(state, comment.user_id))

  return (
    <div>
      <div className="comment-body">
        <p>{comment.content}</p>
        <div className="comment-info">
          <p>
            <NavLink to={`/user/${writer.id}`}>@{writer.username}</NavLink>
          </p>
          <p>{comment.created_at}</p>
        </div>
      </div>
    </div>
  )
}
