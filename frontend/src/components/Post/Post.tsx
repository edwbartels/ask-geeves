import { RenderPost } from "./RenderPost"

interface Props {
  type: "question" | "answer"
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
      <div className="question-body">
        <div>
          <div>Up</div>
          <div>## votes</div>
          <div>Down</div>
          <div>Save</div>
        </div>
        <div>
          <RenderPost postContent={content} />
          <div className="question-meta">
            <div>
              <a href={`${id}`}>Share</a> |
              <a href={`${id}/edit`}>Edit {type}</a> |<button>Like post</button>
            </div>
            <div>
              Posted by <a href={`/users/userId/username`}>User</a>
            </div>
          </div>
          <div>Comments here</div>
        </div>
      </div>
    </div>
  )
}
