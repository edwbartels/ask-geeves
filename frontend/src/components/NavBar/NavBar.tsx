import { useEffect } from "react"
import { NavLink } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  logoutAsync,
  restoreSession,
  selectSession,
  selectUser,
} from "../../features/sessionSlice"
import { OpenModalButton } from "../Modals/OpenModalButton"
import { LoginFormModal } from "../Modals/LoginFormModal"
import { SignupFormModal } from "../Modals/SignUpFormModal"
import { Logo } from "./Logo"
import "./NavBar.css"
export const NavBar = () => {
  const { user } = useAppSelector(selectSession)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(restoreSession())
  }, [])
  // const onClick = () => {
  //   if (onModalClose) setOnModalClose(onModalClose)
  //   setModalContent(modalComponent)
  //   if (typeof onButtonClick === "function") onButtonClick()
  // }
  return (
    <nav className="nav-bar">
      <Logo />
      <>
        <NavLink to="/" className="home-links">Home</NavLink>
        <NavLink to="/questions" className="question-links">Questions</NavLink>
      </>
      <p className="search-links">Search bar</p>
      {user ? `Welcome ${user?.first_name}` : ""}
        <a href="/questions/ask" className="post-links">Post a question</a>
      {!user ? (
        <div className="nav-buttons">
          <OpenModalButton 
            additionalClassNames={["login-button"]}
            linkText="Log in"
            modalComponent={<LoginFormModal />}
            />
          <OpenModalButton
            additionalClassNames={["signup-button"]}
            linkText="Sign up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      ) : (
        <button onClick={() => dispatch(logoutAsync())}>Log out</button>
      )}
    </nav>
  )
}
