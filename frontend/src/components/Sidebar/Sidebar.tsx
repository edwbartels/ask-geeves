import { NavLink } from "react-router-dom"
import "./Sidebar.css"

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="questions">Questions</NavLink>
      <NavLink to="tagged">Tagged</NavLink>
    </div>
  )
}
