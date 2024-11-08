import { RenderPost } from "./RenderPost"

interface Props {
  type: "Question" | "Answer"
  id?: number
}
// Post renders top level question or answer
//
export const Post = ({ type, id }: Props) => {
  // Placeholder content to show Markdown transformation
  const content = `# Heading level 1
  
  Some text here 
  
  \`\`\` js
  const App = () => {
    return <h1>Hello world</h1>
  }
  \`\`\`
  `
  return (
    <div>
      <div className="post-body">
        <div>
          <div className="up-vote">Up</div>
          <div className="vote-counter">## votes</div>
          <div className="down-vote">Down</div>
          <div className="save">Save</div>
        </div>
        <div>
          <RenderPost postContent={content} />
          <div className="post-meta">
            <div>
              <a href={`${id}`} className="share">Share</a> |
              <a href={`${id}/edit`} className="edit">Edit {type}</a> | <button className="like-post-button">Like Post</button>
            </div>
            <div className="post-user">
              Posted by <a href={`/users/userId/username`} className="posted-by-user"> User</a>
            </div>
          </div>
          <div className="comments-here">Comments here</div>
        </div>
      </div>
    </div>
  )
}
