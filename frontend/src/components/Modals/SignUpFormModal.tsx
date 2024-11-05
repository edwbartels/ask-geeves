import { useState } from "react"

import { useModal } from "../../context/Modal"
import { Errors } from "../Errors/Errors"

// import "../css/SignupFormModal.css"

export const SignupFormModal = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  })
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()

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
    if (
      !user.password ||
      !user.confirmPassword ||
      user.password !== user.confirmPassword
    ) {
      return setErrors({ confirmPassword: "Passwords must match!" })
    }
    closeModal()
  }

  return (
    <div className="signup-form">
      <Errors errors={errors} />
      <form onSubmit={handleSubmitSignUp}>
        <div>
          <label className="login-form-item">
            <div>First Name</div>
            <input
              onChange={handleChangeForm("firstName")}
              defaultValue={user.firstName}
              placeholder="First Name"
              name="firstName"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Last Name</div>
            <input
              onChange={handleChangeForm("lastName")}
              defaultValue={user.lastName}
              placeholder="Last Name"
              name="lastName"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Email</div>
            <input
              onChange={handleChangeForm("email")}
              defaultValue={user.email}
              placeholder="Email"
              name="email"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Username</div>
            <input
              onChange={handleChangeForm("username")}
              defaultValue={user.username}
              placeholder="Username"
              name="username"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Password</div>
            <input
              onChange={handleChangeForm("password")}
              defaultValue={user.password}
              placeholder="Password"
              name="password"
              type="text"
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div>Confirm Password</div>
            <input
              onChange={handleChangeForm("confirmPassword")}
              defaultValue={user.confirmPassword}
              placeholder="Confirm Password"
              name="confirmPassword"
              type="text"
            />
          </label>
        </div>
        <div className="sign-up-button">
          <button disabled={isDisabledSubmit}>Sign up</button>
        </div>
      </form>
    </div>
  )
}
