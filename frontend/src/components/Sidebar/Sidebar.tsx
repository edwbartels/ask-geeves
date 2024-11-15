import { NavLink } from "react-router-dom"
import "./Sidebar.css"

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" className="home">Home</NavLink>
      <NavLink to="questions" className="questions">Questions</NavLink>
      <NavLink to="tagged" className="tagged">Tagged</NavLink>
      <NavLink to="saves" className="saves">Saves</NavLink>
    </div>
  )
}
