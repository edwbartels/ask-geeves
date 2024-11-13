import './AboutUs.css'

export const AboutUs = () => {
    return (
        <div className='about-us-div'>
            <div>
                <h1 className='about-us-title'>About Us</h1>
            </div>
            <hr className='about-line' />
            <div>
                <h3 className='mission-title'>Our Mission</h3>
                <p className='mission-statement'>
                    At Ask Geeves, our mission is to create a collaborative 
                    space where curious minds can ask questions, share knowledge, 
                    and empower each other through thoughtful, insightful answers. 
                    We believe in the power of community-driven learning, where 
                    every question is valued, every answer is an opportunity to 
                    teach, and every user contributes to building a smarter, more 
                    informed world.
                </p>
            </div>
            <div>
                <h3 className='our-goals-title'>Our Goals</h3>
                <p className='our-goals-statement'>
                    As Ask Geeves grows, our goal is to build a thriving, inclusive 
                    community where users from all backgrounds can come together to 
                    solve problems, share expertise, and foster continuous learning. 
                    We aim to expand our platform with features that enhance 
                    collaboration, such as personalized recommendations, expert badges, 
                    and community-driven content curation. In the future, we envision 
                    integrating advanced AI tools to help users find the most relevant 
                    answers quickly, while maintaining the human touch that makes Ask 
                    Geeves a trusted space for real, valuable discussions. Ultimately, 
                    our goal is to make Ask Geeves not just a resource, but a global 
                    hub for knowledge exchange, where everyone—no matter their experience 
                    level—can grow, teach, and connect.
                </p>
            </div>
        </div>
    )
}