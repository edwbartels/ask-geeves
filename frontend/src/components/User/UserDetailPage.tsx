import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
interface userDetails {
  User: {
    first_name: string
    last_name: string
    username:string
  }
  questions: {
    question_id: number
    title: string
    question_content: string
  }[]
  answers: {
    question_id: number
    title: string
    question_content: string
    answer_id: number
    answer_content: string
  }[]
  comments: {
    question_id: number
    title: string
    question_content: string
    parent_type: string
    comment_id: number
    comment_content: string
  }[]
}
export const UserDetailPage = () => {
  const { userId } = useParams()
  const [userDetails, setUserDetails] = useState<userDetails>({
    User: {
      first_name: "",
      last_name: "",
      username:""
    },
    questions: [],
    answers: [],
    comments: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await fetch(`/api/user/${userId}`)
      if (!response.ok) {
        throw Error("response was not ok")
      }
      const data = await response.json()
      setUserDetails(data)
    }
    setLoading(false)
    fetchUserDetails()
  }, [userId])

  if (loading) {
    return <div>Loading</div>
  }
  console.log(userDetails)
  return (
    <div className="user-detail-page">
      <h1>User Details</h1>
      <h3>first name:{userDetails.User.first_name}</h3>
      <h3>last name:{userDetails.User.last_name}</h3>
      <div>
        <h2>Questions</h2>
        {userDetails.questions.length > 0 ? (
          userDetails.questions.map(question => (
            <div key={question.question_id}>
              <h3>
                <Link to={`/questions/${question.question_id}`}>
                  {question.title}{" "}
                </Link>
              </h3>
              <p>Question : {question.question_content}</p>
            </div>
          ))
        ) : (
          <p>No questions posted.</p>
        )}
      </div>
      <div>
        --------------------------------------------------------------------------------------------------
      </div>
      <div>
        <h2>Answers</h2>
        {userDetails.answers.length > 0 ? (
          userDetails.answers.map(answer => (
            <div key={answer.answer_id}>
              <h3>
                <Link to={`/questions/${answer.question_id}`}>
                  {" "}
                  {answer.title}{" "}
                </Link>
              </h3>
              <p>Question: {answer.question_content}</p>
              <p>Answer: {answer.answer_content}</p>
            </div>
          ))
        ) : (
          <p>No answers posted.</p>
        )}
      </div>
      <div>
        --------------------------------------------------------------------------------------------------
      </div>
      <div>
        <h2>Comments</h2>
        {userDetails.comments.length > 0 ? (
          userDetails.comments.map(comment => (
            <div key={comment.comment_id}>
              <h3>
                <Link to={`/questions/${comment.question_id}`}>
                  {" "}
                  {comment.title}{" "}
                </Link>
              </h3>
              <p>Question: {comment.question_content}</p>
              <p>Comment: {comment.comment_content}</p>
            </div>
          ))
        ) : (
          <p>No comments posted.</p>
        )}
      </div>
    </div>
  )
}
