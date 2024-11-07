import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { fetchOneQuestion } from "../../features/questionsSlice"
import { selectQuestionById } from "../../features/questionsSlice"

import { Post } from "../Post/Post"

import "./Question.css"

export const QuestionMain = () => {
  const { questionId } = useParams()
  const questionIdNum = Number(questionId)
  const dispatch = useAppDispatch()
  const [isFetchedQuestion, setIsFetchedQuestion] = useState(false)
  if (!isFetchedQuestion) {
    dispatch(fetchOneQuestion(questionIdNum))
    setIsFetchedQuestion(true)
  }
  // Select question details from store
  const question = useAppSelector(state =>
    selectQuestionById(state, questionIdNum),
  )
  // Select answerIds from store
  const answerIds: number[] = [1, 2, 3]

  if (!question) {
    return <div className="question-tile">Trying to load question...</div>
  }
  // console.log(question)
  return (
    <div>
      <h1>{question.title}</h1>
      <Post type="question" id={questionIdNum} />
      <hr />
      <h1>## Answers</h1>
      {answerIds.length > 0
        ? answerIds.map(answerId => {
            return (
              <>
                <Post key={answerId} type="answer" id={answerId} />
                <hr />
              </>
            )
          })
        : "No one answered yet"}
    </div>
  )
}
