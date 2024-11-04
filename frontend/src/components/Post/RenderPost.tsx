import React from "react"
import Markdoc from "@markdoc/markdoc"
interface Props {
  postContent: string
}

// RenderPost converts a raw Markdown string into a React Node
export const RenderPost = ({ postContent }: Props) => {
  // Parse, transform, and render Markdown content from form.body
  const ast = Markdoc.parse(postContent)
  const content = Markdoc.transform(ast)
  return (
    <div className="post-body">
      {Markdoc.renderers.react(content, React, {
        components: {},
      })}
    </div>
  )
}
