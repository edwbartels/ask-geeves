import './Footer.css'

export const Footer = () => {

    return (
        <div className='footer-container'>
            <div className='left-container-div'>
                <ul>
                    <img className='computer-image' src='/Images/aqua-green.png' />
                </ul>
            </div>
            <div className='middle-container-div'>
                <ul>
                <h3 className='list-title'>Ask Geeves</h3>
                    <ul className='questions-link'>Questions</ul>
                    <ul className='signup-link'>Signup</ul>
                </ul>
            </div>
            <div className='right-container-div'>
            <ul>
                    <h3 className='list-title'>Company</h3>
                    <ul className='about-us-link'>About Us</ul>
                    <ul className='contact-us-link'>Contact Us</ul>
                </ul>
            </div>
        </div>
    )
}

