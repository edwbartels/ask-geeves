import { useEffect, useReducer, useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { useSelector, UseSelector } from "react-redux"
import { selectUser } from "../../features/sessionSlice"
import "./UserDetailPage.css"
import { UserDetailPage } from "./UserDetailPage"

// interface userDetails {
//   User: {
//     first_name: string
//     last_name: string
//     username: string
//     email: string
//   }
//   questions: {
//     question_id: number
//     title: string
//     question_content: string
//   }[]
//   answers: {
//     question_id: number
//     title: string
//     question_content: string
//     answer_id: number
//     answer_content: string
//   }[]
//   comments: {
//     question_id: number
//     title: string
//     question_content: string
//     parent_type: string
//     comment_id: number
//     comment_content: string
//   }[]
// }
// interface userSaves {
//   questions: {
//     question_id: number
//     title: string
//     question_content: string
//   }[]
//   answers: {
//     question_id: number
//     title: string
//     question_content: string
//     answer_id: number
//     answer_content: string
//   }[]
//   comments: {
//     question_id: number
//     title: string
//     question_content: string
//     parent_type: string
//     comment_id: number
//     comment_content: string
//   }[]
// }

interface AccountPageUserDetails {
  username: string
  email: string
  first_name: string
  last_name: string
  total_questions: number
  total_answers: number
  total_comments: number
  karma: number
  total_saves: number
  total_votes: number
  followers: number
  following: number
  created_at: string
}
export const AccountDetails = () => {
  const user = useSelector(selectUser)
  const [userDetails, setUserDetails] = useState<AccountPageUserDetails>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    total_questions: 0,
    total_answers: 0,
    total_comments: 0,
    karma: 0,
    total_saves: 0,
    total_votes: 0,
    followers: 0,
    following: 0,
    created_at: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchUserDetails = async () => {
      const response = await fetch(`/api/user/current/overview`)
      if (!response.ok) {
        throw Error("response was not ok")
      }
      const data = await response.json()
      console.log(data)
      setUserDetails(data)
    }
    setLoading(false)
    fetchUserDetails()
  }, [user])

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <div className="account-page">
      <div className="name-div">
        <div className="profile-icon">
          <p>
            <i className="fa-solid fa-id-badge"></i>
          </p>
        </div>
        <div className="name">
          <h3 className="name">{user?.username}</h3>
          {/* <h3 className="name">{user?.first_name}</h3>
          <h3 className="name">{user?.last_name}</h3> */}
        </div>
      </div>
      <div className="account-info">
        <ul className="account-title">
          {" "}
          Account Details<button>Update</button>
          <li className="email-li">Email: {userDetails.email}</li>
          <li className="first-li">First Name: {userDetails.first_name}</li>
          <li className="last-li">Last Name: {userDetails.last_name}</li>
          <li className="member-li">Member Since: {userDetails.created_at}</li>
        </ul>
        <ul className="account-title">
          Total Posts:{" "}
          {userDetails.total_questions +
            userDetails.total_answers +
            userDetails.total_comments}{" "}
          <button>View</button>
          <li>Questions Posted: {userDetails.total_questions}</li>
          <li>Answers Posted: {userDetails.total_answers}</li>
          <li>Comments Posted: {userDetails.total_comments}</li>
          <li>Saved Posts:{userDetails.total_saves}</li>
          <li>Votes Cast:{userDetails.total_votes}</li>
        </ul>
        <ul className="account-title">
          Community Stats: <button>View</button>
          <li>Karma: {userDetails.karma}</li>
          <li>Followers :{userDetails.followers}</li>
          <li>Following: {userDetails.following}</li>
        </ul>
      </div>
      {/* <div>
        <h2 className="user-title">Questions</h2>
        {userDetails.questions.length > 0 ? (
            userDetails.questions.map(question => (
            <div className="user-question-title" key={question.question_id}>
              <h3>
              <Link
              className="user-questions"
              to={`/questions/${question.question_id}`}
              >
              {question.title}{" "}
              </Link>
              </h3>
              <p>Question : {question.question_content}</p>
              <hr />
              </div>
              ))
              ) : (
                <p>No questions posted.</p>
        )}
        </div>
        <div>
        <hr className="question-line" />
      </div>
      <div>
        <h2 className="user-title">Answers</h2>
        {userDetails.answers.length > 0 ? (
            userDetails.answers.map(answer => (
                <div key={answer.answer_id}>
                <h3>
                <Link
                className="user-answers"
                to={`/questions/${answer.question_id}`}
                >
                {" "}
                {answer.title}{" "}
                </Link>
                </h3>
              <p>Question: {answer.question_content}</p>
              <p>Answer: {answer.answer_content}</p>
              <hr />
            </div>
            ))
            ) : (
                <p>No answers posted.</p>
                )}
                </div>
      <div>
      <hr className="answer-line" />
      </div>
      <div>
      <h2 className="user-title">Comments</h2>
      {userDetails.comments.length > 0 ? (
        userDetails.comments.map(comment => (
            <div key={comment.comment_id}>
              <h3>
                <Link
                  className="user-comments"
                  to={`/questions/${comment.question_id}`}
                  >
                  {" "}
                  {comment.title}{" "}
                  </Link>
                  </h3>
              <p>Question: {comment.question_content}</p>
              <p>Comment: {comment.comment_content}</p>
              <hr />
              </div>
          ))
          ) : (
            <p>No comments posted.</p>
            )}
            </div> */}
    </div>
  )
}
