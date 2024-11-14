import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectTagById } from "../../features/tagsSlice"
import './Tag.css'

interface Props {
  tagId: number
}
export const Tag = ({ tagId }: Props) => {
  const tag = useAppSelector(state => selectTagById(state, tagId))
  if (!tag) {
    return null;
  }
  const tagNameSnakeCase = tag.name.replace(" ", "-").toLowerCase()
  return (
      <Link to={`/tagged/${tagId}/${tagNameSnakeCase}`} className="question-tag">
        {tag.name}
      </Link>
  )
}
