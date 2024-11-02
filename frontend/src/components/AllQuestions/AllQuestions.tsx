import { QuestionTile } from "./QuestionTile"
const questionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const AllQuestions = () => {
  return (
    <div>
      <h1>All questions</h1>
      {questionIds.map(id => (
        <QuestionTile questionId={id} />
      ))}
    </div>
  )
}
