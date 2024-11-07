import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { Question, selectQuestionById } from "../../features/questionsSlice"
import { selectUserById } from "../../features/usersSlice"
import { RenderPost } from "./RenderPost"
import {} from "../../features/api-types"
import { selectAnswerById, Answer } from "../../features/answersSlice"
import { RootState } from "../../app/store"

interface Props {
  type: "question" | "answer"
  id: number
}
// Post renders top level question or answer

export const Post = ({ type, id }: Props) => {
  type qOrASelector = (state: RootState, id: number) => Question | Answer
  const getQorASelector = (): qOrASelector => {
    if (type === "question") {
      return selectQuestionById
    } else if (type === "answer") {
      return selectAnswerById
    } else {
      return selectQuestionById
    }
  }
  const postSelector = getQorASelector()
  const post = useAppSelector(state => postSelector(state, id))

  // Placeholder content to show Markdown transformation
  const content = `# Heading level 1
  
  Some text here
  
  \`\`\` js
  const App = () => {
    return <h1>Hello world</h1>
  }
  \`\`\`
  `
  if (!post) {
    // return <div>Loading post...</div>
    return <></>
  }
  const getPermalinkTitle = (type: string, post: Question | Answer): string => {
    const permalinkBase = `${type}-${post.id}`
    if (type === "question") {
      const { title } = post as Question
      return `${permalinkBase}-${title.replaceAll(" ", "-").slice(0, 20).toLowerCase()}`
    } else {
      return permalinkBase
    }
  }
  const permalink = getPermalinkTitle(type, post)
  const postWriter = useAppSelector(state =>
    selectUserById(state, post.user_id),
  )
  return (
    <div>
      <div className="question-body">
        <div>
          <div>Up</div>
          <div>{post.total_score}</div>
          <div>Down</div>
          <div>Save</div>
        </div>
        <div id={permalink}>
          <RenderPost postContent={post.content} />
          <div className="question-meta">
            <div>
              <a href={`#${permalink}`}>Share</a> |
              <a href={`/${type}s/${id}/edit`}>Edit {type}</a> |
              <button>Like post</button>
            </div>
            <div>
              Posted by{" "}
              <a href={`/users/userId/username`}>{postWriter.username}</a>
            </div>
          </div>
          <div>Comments here</div>
        </div>
      </div>
    </div>
  )
}
