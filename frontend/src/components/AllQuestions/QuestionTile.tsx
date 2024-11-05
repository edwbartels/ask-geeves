import "./AllQuestions.css"
interface Props {
  questionId: number
}
export const QuestionTile = ({ questionId }: Props) => {
  return (
    <div className="question-tile">
      <div className="question-stats">
        <p>## votes</p>
        <p>## answers</p>
        <p>## views</p>
      </div>
      <div className="question-preview">
        <p>
          <a href={`questions/${questionId}`}>Question {questionId} title</a>
        </p>
        <p>Question summary</p>
        <p>Question tags</p>
      </div>
    </div>
  )
}
