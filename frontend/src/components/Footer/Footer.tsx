import { NavLink } from "react-router-dom"
import "./Footer.css"

export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="left-container-div">
        <ul>
          <img className="computer-image" src="/Images/aqua-green.png" />
        </ul>
      </div>
      <div className="middle-container-div">
        <ul>
          <h3 className="list-title">Ask Geeves</h3>
          <ul>
            <NavLink className="faq" to="/faq">
              FAQ's
            </NavLink>
          </ul>
          <ul>
            <NavLink className="questions" to="/questions">
              Questions
            </NavLink>
          </ul>
        </ul>
      </div>
      <div className="right-container-div">
        <ul>
          <h3 className="list-title">Company</h3>
          <ul>
            <NavLink className="about-us" to="/about-us">
              About Us
            </NavLink>
          </ul>
          <ul>
            <NavLink className="contact-us" to="/team">
              The Team
            </NavLink>
          </ul>
        </ul>
      </div>
    </div>
  )
}
