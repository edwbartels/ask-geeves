interface Props {
  type: "question" | "answer"
}
// Post renders top level question or answer
export const Post = ({ type }: Props) => {
  return (
    <div>
      <h1>{type} detail</h1>
    </div>
  )
}
