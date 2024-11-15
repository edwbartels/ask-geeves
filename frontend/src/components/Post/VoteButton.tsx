import classNames from "classnames"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectVoteByContentAndId, updateVote } from "../../features/votesSlice"
import { selectUser } from "../../features/sessionSlice"

interface VoteButtonProps {
  id: number
  type: "question" | "answer" | "comment"
  voteType: "up" | "down"
}
export const VoteButton: React.FC<VoteButtonProps> = ({
  id,
  type,
  voteType,
}) => {
  const dispatch = useAppDispatch()
  const voteInstance = useAppSelector(state =>
    selectVoteByContentAndId(state, type, id),
  )
  const isLoggedIn = useAppSelector(state => selectUser(state)) !== null

  const isActive =
    (voteType === "up" && voteInstance?.value === 1) ||
    (voteType === "down" && voteInstance?.value === -1)

  const handleVote = () => {
    if (isLoggedIn) {
      const voteValue = voteType === "up" ? 1 : -1
      dispatch(
        updateVote({ content_id: id, content_type: type, value: voteValue }),
      )
    }
  }

  const buttonClass = classNames({
    up: voteType === "up",
    down: voteType === "down",
    "vote-active": isActive,
    "vote-btn": "vote-btn",
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
