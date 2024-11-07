import "./AllQuestions.css"
interface Props {
  questionId: number
}
export const QuestionTile = ({ questionId }: Props) => {
  return (
    <div className="question-tile">
      <div className="question-stats">
        <p className="votes">## votes</p>
        <p className="answers">## answers</p>
        <p className="views">## views</p>
      </div>
      <div className="question-preview">
        <p>
          <a href={`questions/${questionId}`}>Question {questionId} title</a>
        </p>
        <p className="question-summary">Question summary</p>
        <p className="question-tags">Question tags</p>
      </div>
    </div>
  )
}
