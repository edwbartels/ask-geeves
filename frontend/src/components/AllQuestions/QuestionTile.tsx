import { useAppSelector } from "../../app/hooks"
import { selectQuestionById } from "../../features/questionsSlice"
import { selectUserById } from "../../features/usersSlice"
import "./AllQuestions.css"
interface Props {
  questionId: number
}
export const QuestionTile = ({ questionId }: Props) => {
  const question = useAppSelector(state =>
    selectQuestionById(state, questionId),
  )
  const writer = useAppSelector(state =>
    selectUserById(state, question.user_id),
  )
  const createdAtDate = new Date(writer.created_at)
  const createdDate = createdAtDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  return (
    <div className="question-tile">
      <div className="question-stats">
        <p>{question.total_score}</p>
        <p>## answers</p>
      </div>
      <div className="question-preview">
        <p>
          <a href={`questions/${questionId}`}>{question.title}</a>
        </p>
        <p>{question.content}</p>
        <div>
          <p>Question tags</p>
          <p>
            Written by {writer.first_name} on {createdDate}
          </p>
        </div>
      </div>
    </div>
  )
}
