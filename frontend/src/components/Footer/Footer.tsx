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
            <a className="faq" href="/faq">
              FAQ's
            </a>
          </ul>
          <ul>
            <a className="questions" href="/questions">
              Questions
            </a>
          </ul>
        </ul>
      </div>
      <div className="right-container-div">
        <ul>
          <h3 className="list-title">Company</h3>
          <ul>
            <a className="about-us" href="/about-us">
              About Us
            </a>
          </ul>
          <ul>
            <a className="contact-us" href="/team">
              The Team
            </a>
          </ul>
        </ul>
      </div>
    </div>
  )
}
