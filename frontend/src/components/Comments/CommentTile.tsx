import { useAppSelector } from "../../app/hooks"
import { selectUserById } from "../../features/usersSlice"
import { selectCommentById } from "../../features/commentsSlice"

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
            <a href={`/user/${writer.id}`}>@{writer.username}</a>
          </p>
          <p>{comment.created_at}</p>
        </div>
      </div>
    </div>
  )
}
