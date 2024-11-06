import { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  selectQuestionsArr,
  fetchAllQuestions,
} from "../../features/questionsSlice"
import { QuestionTile } from "./QuestionTile"
// const questionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const AllQuestions = () => {
  const dispatch = useAppDispatch()
  const [gotQuestions, setGotQuestions] = useState(false)
  const questions = useAppSelector(selectQuestionsArr)
  const questionIds = questions.map(question => question.id)
  if (!gotQuestions) {
    dispatch(fetchAllQuestions())
    setGotQuestions(true)
  }
  return (
    <div>
      <h1>All questions</h1>
      {questionIds.map(id => (
        <QuestionTile key={id} questionId={id} />
      ))}
    </div>
  )
}
