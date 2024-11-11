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
  const createdAtDate = new Date(question.created_at)
  const createdDate = createdAtDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const numAnswersText =
    question.num_answers + " answer" + (question.num_answers === 1 ? "" : "s")

  return (
    <div className="question-tile">
      <div className="question-stats">
        <p className="votes">{question.total_score} Votes</p>
        <p className="answers">{numAnswersText}</p>
      </div>
      <div className="question-block">
        <p>
          <a className="sub-title" href={`questions/${questionId}`}>
            {question.id} - {question.title}
          </a>
        </p>
        <p  className="question-summary">{question.content}</p>
        <div>
          <p className="question-tags">Question tags</p>
          <p>
            Written by {writer.first_name} on {question.created_at}
          </p>
        </div>
      </div>
    </div>
  )
}
