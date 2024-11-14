import { useState } from "react"
import { useModal } from "../../context/Modal"
import { Errors } from "../Errors/Errors"
import { useAppDispatch } from "../../app/hooks"
import { restoreSession } from "../../features/sessionSlice"
import { loginAsync } from "../../features/sessionSlice"
import { log } from "console"
import "./LoginFormModal.css"

export const LoginFormModal = () => {
  const [loginForm, setLoginForm] = useState({
    credential: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  // Disable submit button if credential length < 4 or password length < 6
  const isDisabledSubmit =
    loginForm.credential.length < 4 || loginForm.password.length < 6

  const handleChangeLoginForm =
    (loginFormField: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginForm({
        ...loginForm,
        [loginFormField]: e.target.value,
      })
    }

  // const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   setErrors({})
  //   // Send login request to back end
  //   const response = await dispatch(loginAsync(loginForm)).unwrap()
  //   console.log("res",response)
  //   // Set errors if any come back
  //   closeModal()
  // }
  const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
      const response = await dispatch(loginAsync(loginForm)).unwrap()
      console.log("res", response)
      if (response.error) {
          setErrors(response)
      } else {
          closeModal()
      }
}

  console.log(errors.error)

  const handleLogInDemo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setErrors({})
    try {
      const response = await dispatch(
        loginAsync({
          credential: "admin@admin.com",
          password: "adminadmin",
        }),
      ).unwrap()
      closeModal()
    } catch (e) {
      console.log("error", e)
    }
  }
  // console.log(errors)
  return (
    <div className="login-form" data-testid="login-modal">
      {/* <Errors errors={errors} /> */}
      <form onSubmit={handleSubmitLogin}>
        <div>
          <label className="login-form-item">
            <h3 className="login-title">Login</h3>
            <div className="email-title">Username/Email</div>
            {loginForm.credential.length < 4? <div className="requirement-message">Minimum 4 characters</div> : ""}
            <input className="input"
              onChange={handleChangeLoginForm("credential")}
              defaultValue={loginForm.credential}
              placeholder="Username/Email"
              name="credential"
              type="text"
              required
            />
          </label>
        </div>
        <div>
          <label className="login-form-item">
            <div className="password-title">Password</div>
            {loginForm.password.length < 6? <div className="requirement-message">Minimum 6 characters</div> : ""}
            <input className="input"
              onChange={handleChangeLoginForm("password")}
              placeholder="Password"
              defaultValue={loginForm.password}
              name="password"
              type="password"
              required
            />
          </label>
        </div>
        {errors.error?<div className="authentication-error">{errors.error}</div>: ""}
        <div className="button-div">
        <button className={`login-form-button ${isDisabledSubmit ? 'disabled' : ''}`}
          disabled={isDisabledSubmit}
          data-testid="login-button" // Identifier
        >
          Log In
        </button>
      <button className="demo-form-button" onClick={handleLogInDemo} data-testid="demo-user-login">
        Log in Demo User
      </button>
      </div>
      </form>
    </div>
  )
}
