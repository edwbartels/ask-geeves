import { useAppSelector } from "../../app/hooks"
import { selectCommentById } from "../../features/commentsSlice"
import { CommentEntry } from "../../features/commentsSlice"
import { CommentTile } from "./CommentTile"

export interface CommentListProps {
  commentIds: number[]
}

export const CommentList = ({ commentIds }: CommentListProps) => {
  return (
    <div className="comments-container" style={{ display: "" }}>
      <hr
        style={{
          backgroundColor: "cyan",
          height: "3px",
          boxShadow: "1px 1px 7px 1px cyan",
        }}
      ></hr>
      {commentIds && commentIds.length > 0
        ? commentIds.map(commentId => {
            return (
              <div key={commentId} className="comment-key">
                <CommentTile id={commentId} />
                {/* <hr className="comment-line" /> */}
              </div>
            )
          })
        : "No Comments yet"}
    </div>
  )
}
