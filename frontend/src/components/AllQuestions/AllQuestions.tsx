import { QuestionTile } from "./QuestionTile"
import "./AllQuestions.css"
const questionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const AllQuestions = () => {
  return (
    <div>
      <h1 className="all-questions-title">All questions</h1>
      {questionIds.map(id => (
        <QuestionTile questionId={id} />
      ))}
    </div>
  )
}
