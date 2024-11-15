import { useAppSelector } from "../../app/hooks"
import { selectQuestionById } from "../../features/questionsSlice"
import { selectUserById } from "../../features/usersSlice"
import { selectTagById } from "../../features/tagsSlice"
import { Tag } from "../Tag/Tag"
import "./AllQuestions.css"
import { Link } from "react-router-dom"
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
  const tags = question.tagIds.map(tagId =>
    useAppSelector(state => selectTagById(state, tagId)),
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
          <Link className="sub-title" to={`${questionId}`}>
            {question.id} - {question.title}
          </Link>
        </p>
        <hr className="underline" />
        <p className="question-summary">{`${question.content.slice(0, 250)}${question.content.length > 250 ? "..." : ""}`}</p>
        <div>
          <div className="question-tags">
            {question.tagIds.map(tagId => (
              <Tag key={tagId} tagId={tagId} />
            ))}
          </div>
          <p>
            Written by {writer.first_name} on {question.created_at}
          </p>
        </div>
      </div>
    </div>
  )
}
