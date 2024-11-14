import "./HomePage.css"


export const HomePage = () => {
  return (
    <div className="homepage">
      <h1 className="title">Code better, together!</h1>
      <div className="container">
        <div className="description">
        Welcome to Ask Geeves - a vibrant community where developers ask, answer, and collaborate 
        to solve coding challenges. Whether you're stuck on a bug, exploring a new framework, or 
        just looking to share your knowledge, we're here to help you level up your skills. Get real 
        answers, connect with experts, and turn problems into solutions—one line of code at a time.
        </div>
        <div className="image">
          <img src="Public/Images/coding desktop.jpg"></img>
        </div>
      </div>
      <div className="languages-container">
        <h2 className="language-title">Tags & Languages</h2>
        <div className="grid">
          <div><img src="" alt="" />JavaScript</div>
          <div><img src="" alt="" />HTML</div>
          <div><img src="" alt="" />CSS</div>
          <div><img src="" alt="" />SQLite3</div>
          <div><img src="" alt="" />Python</div>
          <div><img src="" alt="" />Sequelize</div>
          <div><img src="" alt="" />Redux</div>
          <div><img src="" alt="" />Java</div>
          <div><img src="" alt="" />C#</div>
          <div><img src="" alt="" />Ruby</div>
          <div><img src="" alt="" />TypeScript</div>
          <div><img src="" alt="" />Express</div>
          <div><img src="" alt="" />C++</div>
          <div><img src="" alt="" />React</div>
          <div><img src="" alt="" />Node</div>
          <div><img src="" alt="" /></div>
      </div>
      <div className="wrapper">
      <h1 className="text-center">Testimonials</h1>
        <div className="speechbubble">
            <p>"I have been using this site for a few weeks now, and I have to say, its become my go-to platform for coding help. The community is knowledgeable, and I love how quickly I can get answers to my questions. The layout is easy to navigate, and I appreciate the thorough explanations that come with each answer!"</p>
            <span className="username">John M., Software Engineer</span>
        </div>
        <div className="speechbubble">
            <p>"This site is a game-changer for anyone in the tech field. The discussions are always up-to-date, and I can find solutions to both common and obscure problems. The voting system helps highlight the best answers, which makes it super efficient. I am so glad I found this platform!"</p>
            <span className="username">Samantha L., Front-End Developer</span>
        </div>
        <div className="speechbubble">
            <p>"I have been using Stack Overflow for years, but this site has taken things to the next level. The community is super responsive, and I can tell the moderators keep things organized and spam-free. The integration with other tools for code snippets and debugging makes this site stand out."</p>
            <span className="username">David T., Data Scientist</span>
        </div>
        <div className="speechbubble">
            <p>"As a newcomer to programming, I was struggling to find reliable answers. This site has helped me grow so much by providing clear, well-explained solutions from experienced developers. I love the variety of questions and the fact that I can learn from real-world examples!"</p>
            <span className="username">Emily R., Junior Web Developer</span>
        </div>
        <div className="speechbubble">
            <p>"I had a tough bug to fix and couldn't find an answer anywhere else. A quick search on this site, and I found an in-depth solution with code examples. The platform is super user-friendly and full of experts who genuinely care about helping others. I highly recommend it!"</p>
            <span className="username">Carlos F., Backend Engineer</span>
        </div>
        <div className="speechbubble">
            <p>"I haveve visited many forums over the years, but this site stands out. Not only are the answers fast, but theyre also often complete with detailed explanations, relevant links, and sometimes even video tutorials. Its a must-visit for developers at all levels!"</p>
            <span className="username">Natalie, Mobile Developer</span>
        </div>
      </div>
      </div>
      <div className="container-icon">     
        <div className="container__icon-wrapper">
            <i className="container__icon fa fa-linkedin linkedin"></i>
        </div>
        <div className="container__icon-wrapper">
            <i className="container__icon fa fa-twitter twitter"></i>
        </div>
        <div className="container__icon-wrapper">
            <i className="container__icon fa fa-github-square github"></i>
        </div>
        <div className="container__icon-wrapper">
            <i className="container__icon fa fa-facebook-square facebook"></i>
        </div>
    </div>
    </div>
  )
}


