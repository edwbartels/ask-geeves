import { NavLink } from "react-router-dom"
import "./Logo.css"

export const Logo = () => {
  return (
    <div className="container">
      <NavLink to="/" className="sign">
      <span className="fast-flicker">A</span>sk<span className="flicker">&nbsp;G</span>eeves
      </NavLink>
    </div>
  )  
}
