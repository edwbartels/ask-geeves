import { useState } from "react"

import { useModal } from "../../context/Modal"
import { Errors } from "../Errors/Errors"

import "./SignUpFormModal.css"
import { useAppDispatch } from "../../app/hooks"
import { loginAsync } from "../../features/sessionSlice"
interface ErrorTypes {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  confirm_password: string;
  email: string;
}
export const SignupFormModal = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirm_password: "",
    email: "",
  })
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  // Disable sign up submit button if:
  // - any input field has length 0
  // - username input length < 4
  // - password input length < 6
  const isDisabledSubmit =
    Object.values(user).some(value => value.length === 0) ||
    user.username.length < 4 ||
    user.password.length < 6

  const handleChangeForm =
    (field: string) => (e: React.FormEvent<HTMLInputElement>) => {
      setUser({ ...user, [field]: e.currentTarget.value })
    }

  const handleSubmitSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
      // console.log(user)
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
      const errorData = await response.json();
        const allErrors = errorData.errors.reduce((acc, error) => {
          acc[error.field] = error.message;
          return acc;
        }, {});
        setErrors(allErrors);
      } else {
        setErrors({})
        dispatch(loginAsync({
          credential:user.email,
          password:user.password
        }))
        closeModal();
      }
  };

  return (
    <div className="signup-form">
      <form onSubmit={handleSubmitSignUp}>
        <div>
          <label className="login-form-item">
            <h3 className="signup-title">Sign Up</h3>
            <div className="first-name">First Name</div>
            {user.first_name.length < 1 && <div className="requirement-message">field required</div>}
            <input
              onChange={handleChangeForm("first_name")}
              defaultValue={user.first_name}
              placeholder="First Name"
              required
              name="firstName"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div className="last-name">Last Name</div>
            {user.last_name.length < 1 && <div className="requirement-message">field required</div>}
            <input
              onChange={handleChangeForm("last_name")}
              defaultValue={user.last_name}
              placeholder="Last Name"
              required
              name="lastName"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div className="email">Email</div>
            {user.email.length < 1 && <div className="requirement-message">field required</div>}
            {errors.email && <div className="error-input">{errors.email}</div>}
            <input
              onChange={handleChangeForm("email")}
              defaultValue={user.email}
              placeholder="Email"
              required
              name="email"
              type="email"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div className="form-username">Username</div>
            {user.username.length < 4 && <div className="requirement-message">Minimum 4 characters</div>}
            {errors.username && <div className="error-input">{errors.username}</div>}
            <input
              onChange={handleChangeForm("username")}
              defaultValue={user.username}
              placeholder= "Username"
              name="username"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div className="password">Password</div>
            {user.password.length < 6 && <div className="requirement-message">Minimum 6 characters</div>}
            <input
              onChange={handleChangeForm("password")}
              defaultValue={user.password}
              placeholder="Password"
              name="password"
              type="password"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div className="confirm-password">Confirm Password</div>
            {user.confirm_password.length < 1 && <div className="requirement-message">field required</div>}
            {errors.confirm_password && <div className="error-input">{errors.confirm_password}</div>}
            <input
              onChange={handleChangeForm("confirm_password")}
              defaultValue={user.confirm_password}
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
            />
          </label>
        </div>
        <div className="sign-up-button-div">
          <button className={`sign-up-button ${isDisabledSubmit ? "disabled" : ""}`}
          disabled={isDisabledSubmit}>Sign up</button>
        </div>
      </form>
    </div>
  )
}
