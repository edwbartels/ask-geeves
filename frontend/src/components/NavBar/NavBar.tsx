import { useEffect } from "react"
import { NavLink } from "react-router-dom"

import { useAppSelector, useAppDispatch } from "../../app/hooks"
import {
  logoutAsync,
  restoreSession,
  selectSession,
  selectUser,
} from "../../features/sessionSlice"
import { getAllTags } from "../../features/tagsSlice"
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
    dispatch(getAllTags())
  }, [])
  // const onClick = () => {
  //   if (onModalClose) setOnModalClose(onModalClose)
  //   setModalContent(modalComponent)
  //   if (typeof onButtonClick === "function") onButtonClick()
  // }
  console.log("in nav bar")
  return (
    <nav className="nav-bar">
      <Logo />
      <>
        <NavLink to="/" className="home-links">
          Home
        </NavLink>
        <NavLink to="/questions" className="question-links">
          Questions
        </NavLink>
      </>
      <form>
        <input className="search-links" placeholder="Search..." />
      </form>
      <div className="user-greeting">
        {user ? `Welcome ${user?.first_name}` : ""}
      </div>
      <NavLink to="/questions/ask" className="post-links">
        Post a question
      </NavLink>
      {!user ? (
        <div className="nav-buttons">
          <OpenModalButton
            additionalClassNames={["login-button"]}
            buttonText="Log in"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            additionalClassNames={["signup-button"]}
            buttonText="Sign up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      ) : (
        <button
          className="logout-button"
          onClick={() => dispatch(logoutAsync())}
        >
          Log out
        </button>
      )}
    </nav>
  )
}
