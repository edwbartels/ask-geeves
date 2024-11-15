import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import classNames from "classnames"

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

  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const toggleDropdown = () => setIsOpen(prev => !prev)
  const closeDropdown = () => setIsOpen(false)
  useEffect(() => {
    const handleAnyClick = () => {
      closeDropdown()
    }
    document.addEventListener("click", handleAnyClick)
    return () => {
      setIsOpen(false)
      document.removeEventListener("click", handleAnyClick)
    }
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
        <Link to="/" className="home-links">
          Home
        </Link>
        <Link to="/questions" className="question-links">
          Questions
        </Link>
      </>
      <form>
        <input className="search-links" placeholder="Search..." />
      </form>
      <div className="user-greeting">
        {user ? `Welcome ${user?.first_name}` : ""}
      </div>

      {user && (
        <Link to="/questions/ask" className="post-links">
          Post a question
        </Link>
      )}

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
        <div className="nav-buttons nav-user-buttons">
          {/* <Link to={`/user/${user.id}`}> */}
          <div className="user-dropdown" ref={menuRef}>
            <i
              className={`fa-circle-user user-profile ${isHovered ? "fa-solid" : "fa-regular"}`}
              id="profile"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={e => {
                e.stopPropagation()
                toggleDropdown()
              }}
            ></i>
            {isOpen && (
              <ul className="dropdown-menu">
                <li className="dropdown-text">
                  <Link to={`/user/${user.id}`} className="profile-text">
                    Profile
                  </Link>
                </li>
                <li className="dropdown-text">Saves</li>
                <li
                  className="dropdown-text"
                  onClick={() => dispatch(logoutAsync())}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
          {/* </Link> */}
          {/* <button
            className="logout-button"
            onClick={() => dispatch(logoutAsync())}
          >
            Log out
          </button> */}
        </div>
      )}
    </nav>
  )
}
