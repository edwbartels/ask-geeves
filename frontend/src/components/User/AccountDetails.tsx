import { useEffect, useReducer, useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import { useSelector, UseSelector } from "react-redux"
import { selectUser } from "../../features/sessionSlice"
import "./AccountDetails.css"
import { UserDetailPage } from "./UserDetailPage"
import { EditableField } from "./EditField"

interface CompleteData {
  username: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  total_questions: number
  total_answers: number
  total_comments: number
  total_saves: number
  total_votes: number
  karma: number
  followers: number
  following: number
}
interface AccountPageUserDetails {
  username: string
  email: string
  first_name: string
  last_name: string
}
interface UserData {
  created_at: string
  total_questions: number
  total_answers: number
  total_comments: number
  total_saves: number
  total_votes: number
  karma: number
  followers: number
  following: number
}
export type canEdit = "username" | "email" | "first_name" | "last_name"

export const AccountDetails: React.FC = () => {
  const user = useSelector(selectUser)
  const [userDetails, setUserDetails] = useState<CompleteData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    created_at: "",
    total_questions: 0,
    total_answers: 0,
    total_comments: 0,
    total_saves: 0,
    total_votes: 0,
    karma: 0,
    followers: 0,
    following: 0,
  })
  const [editingField, setEditingField] = useState<canEdit | null>(null)
  const [loading, setLoading] = useState(true)

  const handleEditClick = (field: canEdit) => {
    setEditingField(field)
  }

  const handleCancel = () => {
    setEditingField(null)
  }
  const handleSubmit = async (field: canEdit, value: string) => {
    if (editingField) {
      try {
        const response = await fetch("/api/user/current/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            field: editingField,
            value: userDetails[editingField],
          }),
        })
        if (!response.ok) {
          throw new Error("Failed to update")
        }
        alert("Changes saved!")
      } catch (error) {
        console.error(error)
        alert("Failed to save changes")
      } finally {
        setUserDetails(prev => ({
          ...prev,
          [field]: value,
        }))
        setEditingField(null)
      }
    }
  }
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
        <div className="user-info account-list-container">
          {" "}
          <div className="user-info-title">
            <div>Account Details</div>
          </div>
          {/* <button>Update</button> */}
          <EditableField
            fieldName="username"
            value={userDetails.username}
            isEditing={editingField === "username"}
            onEditClick={handleEditClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <EditableField
            fieldName="email"
            value={userDetails.email}
            isEditing={editingField === "email"}
            onEditClick={handleEditClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <EditableField
            fieldName="first_name"
            value={userDetails.first_name}
            isEditing={editingField === "first_name"}
            onEditClick={handleEditClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <EditableField
            fieldName="last_name"
            value={userDetails.last_name}
            isEditing={editingField === "last_name"}
            onEditClick={handleEditClick}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <div className="join-date">
            Member Since: {userDetails.created_at}
          </div>
        </div>
        <div className="posting-details account-list-container">
          <div className="user-info-title">
            <div>
              All Posts:{" "}
              {userDetails.total_questions +
                userDetails.total_answers +
                userDetails.total_comments}{" "}
            </div>
            <i className="fa-solid fa-eye title-icon"></i>
          </div>
          <div className="posting-content">
            <i className="fa-solid fa-eye"></i>Questions Posted:{" "}
            {userDetails.total_questions}
          </div>
          <div className="posting-content">
            <i className="fa-solid fa-eye"></i>Answers Posted:{" "}
            {userDetails.total_answers}
          </div>
          <div className="posting-content">
            <i className="fa-solid fa-eye"></i>Comments Posted:{" "}
            {userDetails.total_comments}
          </div>
          <div className="posting-content">
            <i className="fa-solid fa-eye"></i>Saved Posts:{" "}
            {userDetails.total_saves}
          </div>
          <div className="posting-content">
            <i className="fa-solid fa-eye"></i>Votes Cast:{" "}
            {userDetails.total_votes}
          </div>
        </div>
        <div className="user-stats account-list-container">
          <div className="user-info-title">
            <div>Community Stats</div>
          </div>
          <div className="community-info karma">Karma: {userDetails.karma}</div>
          <div className="community-info">
            <i className="fa-solid fa-eye" />
            Followers: {userDetails.followers}
          </div>
          <div className="community-info">
            <i className="fa-solid fa-eye" />
            Following: {userDetails.following}
          </div>
        </div>
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
