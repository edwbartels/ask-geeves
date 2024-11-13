import { useAppSelector } from "../../app/hooks";
import { selectUserById } from "../../features/usersSlice";
import { selectCommentById } from ;

interface Props {
    commentId: number
}

export const CommentTile = ({ commentId }: Props) => {
    const comment = useAppSelector(state => 
        selectCommentById(state, commentId),
    )
    const writer = useAppSelector(state => 
        selectUserById(state, comment.user_id),
    )
    const createdAtDate = new Date(comment.created_at)
    const createdDate = createdAtDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
    const numCommentsText = 
        comment.num_comments + "comment" + (comment.num_comments === 1 ? "" : "s")
    
    return (
        <div>
            <div>
                <p className="total-num-comments">{numCommentsText}</p>
            </div>
            <div>
                <p>
                    
                </p>
            </div>
        </div>
    )
}