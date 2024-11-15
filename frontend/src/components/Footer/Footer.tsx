import { Link } from "react-router-dom"
import "./Footer.css"

export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="left-container-div">
        <ul>
          <img className="computer-image" src="/aqua-green.png" />
        </ul>
      </div>
      <div className="middle-container-div">
        <ul>
          <h3 className="list-title">Ask Geeves</h3>
          <ul>
            <Link className="faq" to="/faq">
              FAQs
            </Link>
          </ul>
          <ul>
            <Link className="questions" to="/questions">
              Questions
            </Link>
          </ul>
        </ul>
      </div>
      <div className="right-container-div">
        <ul>
          <h3 className="list-title">Company</h3>
          <ul>
            <Link className="about-us" to="/about-us">
              About Us
            </Link>
          </ul>
          <ul>
            <Link className="contact-us" to="/team">
              The Team
            </Link>
          </ul>
        </ul>
      </div>
    </div>
  )
}
