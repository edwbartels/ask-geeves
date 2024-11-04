import { NavLink } from "react-router-dom"
import { OpenModalButton } from "../Modals/OpenModalButton"
import { LoginFormModal } from "../Modals/LoginFormModal"
import { SignupFormModal } from "../Modals/SignUpFormModal"
import { Logo } from "./Logo"
import "./NavBar.css"
export const NavBar = () => {
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
      <p>
        <a href="/questions/ask">Post a question</a>
      </p>
      <OpenModalButton linkText="Log in" modalComponent={<LoginFormModal />} />
      <OpenModalButton
        linkText="Sign up"
        modalComponent={<SignupFormModal />}
      />
    </nav>
  )
}
