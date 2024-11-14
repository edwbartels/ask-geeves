import './Contact.css'

export const Contact = () => {
    return (
        <div className='contact-container'>
            <h1 className='contact-title'>Meet The Team!</h1>
            <div className='top-row'>
                <div className='top-left-box'>
                    <div><h2 className='name'>Eddie Bartels</h2></div>
                    <div><img className='image' src='/Public/Images/Eddie.jpg' /></div>
                    <p className='eddie-description'>Full Stack Software Engineer</p>
                </div>
                <div className='top-right-box'>
                    <div><h2 className='name'>Joshua Wang</h2></div>
                    <div><img className='image' src='/Public/Images/Josh.jpg' /></div>
                    <p className='josh-description'>Full Stack Software Engineer</p>
                </div>
            </div>
            <div className='bottom-row'>
                <div className='bottom-left-box'>
                    <div><h2 className='name'>Tina Konopko</h2></div>
                    <div><img className='image' src='/Public/Images/Tina.jpg' /></div>
                    <p className='tina-description'>Full Stack Software Engineer</p>
                </div>
                <div className='bottom-right-box'>
                    <div><h2 className='name'>Ziwen Zhang</h2></div>
                    <div><img className='image' src='/Public/Images/Ziwen.jpg' /></div>
                    <p className='ziwen-description'>Full Stack Software Engineer</p>
                </div>
            </div>
        </div>
    )
}