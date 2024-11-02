import { useParams } from "react-router-dom"

import { Post } from "../Post/Post"

export const QuestionMain = () => {
  const { questionId } = useParams()
  return (
    <div>
      <h1>Question {questionId} detail</h1>
      <Post type="question" />
      <hr />
      <h1>Answers</h1>
      <Post type="answer" />
    </div>
  )
}
