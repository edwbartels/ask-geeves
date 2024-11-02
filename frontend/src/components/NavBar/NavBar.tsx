import { NavLink } from "react-router-dom"
import { Logo } from "./Logo"
import "./NavBar.css"
export const NavBar = () => {
  return (
    <nav className="nav-bar">
      <Logo />
      <ul>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/questions">Questions</NavLink>
      </ul>
      <p>Search bar</p>
      <p>Log in</p>
      <p>Sign up</p>
    </nav>
  )
}
