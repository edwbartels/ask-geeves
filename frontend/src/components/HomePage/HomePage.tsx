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
          <img src="/Images/coding desktop.jpg"></img>
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
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
          <div><img src="" alt="" /></div>
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


