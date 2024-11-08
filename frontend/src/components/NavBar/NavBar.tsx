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
      <ul>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/questions">Questions</NavLink>
      </ul>
      <p>Search bar</p>
      {user ? `Welcome ${user?.first_name}` : ""}
      <p>
        <a href="/questions/ask">Post a question</a>
      </p>
      {!user ? (
        <>
          <OpenModalButton
            buttonText="Log in"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign up"
            modalComponent={<SignupFormModal />}
          />
        </>
      ) : (
        <button onClick={() => dispatch(logoutAsync())}>Log out</button>
      )}
    </nav>
  )
}
