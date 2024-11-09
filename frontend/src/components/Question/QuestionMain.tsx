import { useState, Fragment } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { fetchOneQuestion } from "../../features/questionsSlice"
import { selectQuestionById } from "../../features/questionsSlice"

import { Post } from "../Post/Post"
import { OpenModalButton } from "../Modals/OpenModalButton"
import { AnswerForm } from "../Modals/AnswerForm"

import "./Question.css"

export const QuestionMain = () => {
  const { questionId } = useParams()
  const questionIdNum = Number(questionId)
  const dispatch = useAppDispatch()
  const [isFetchedQuestion, setIsFetchedQuestion] = useState(false)
  if (!isFetchedQuestion) {
    const response = dispatch(fetchOneQuestion(questionIdNum))
    setIsFetchedQuestion(true)
  }
  // Select question details from store
  const question = useAppSelector(state =>
    selectQuestionById(state, questionIdNum),
  )

  if (!question) {
    return <div className="question-tile">Trying to load question...</div>
  }
  const answerIds = question.answerIds
  return (
    <div>
      <h1 className="question-title">{question.title}</h1>
      <Post type="question" id={questionIdNum} />
      <hr />
      <h1 className="answers-title">## Answers</h1>
      {answerIds.length > 0
        ? answerIds.map(answerId => {
            return (

              <div key={answerId} className="post-key">
                <Post type="answer" id={answerId} />

                <hr />
              </div>
            )
          })
        : "No one answered yet"}
      <OpenModalButton
        buttonText="Add an answer"
        modalComponent={<AnswerForm question={question} />}
      />
    </div>
  )
}
