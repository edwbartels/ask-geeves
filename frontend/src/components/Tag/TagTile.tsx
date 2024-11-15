import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { cleanTagName } from "../../features/tagsSlice"
import "./TagTile.css"
import devicon from "./devicon.json"

interface Props {
  tagId: number
}

export const TagTile = ({ tagId }: Props) => {
  const getIconClassName = (name: string) => {
    const manuallyMappedNames: Record<string, string> = {
      aws: "amazonwebservices-plain-wordmark",
      css: "css3-plain",
      html: "html5-plain",
      sqlalchemy: "sqlalchemy-plain-wordmark",
    }
    if (Object.keys(manuallyMappedNames).includes(name)) {
      return manuallyMappedNames[name]
    } else {
      const icon = devicon.find(icon => icon.name === name)
      return icon ? [icon.name, icon.versions.font[0]].join("-") : ""
    }
  }

  const tag = useAppSelector(state => state.tags.tags)[tagId]
  const deviconName = getIconClassName(tag.cleanedName)
  const icon = devicon.find(icon => icon.name === deviconName)
  const iconName = icon ? [icon.name, icon.versions.font[0]].join("-") : ""
  // }
  const iconClass = `devicon-${tag.cleanedName}`
  return (
    <Link to={`${tag.id}/${tag.cleanedName}`} className="tag-tile">
      <i className={`devicon-${deviconName} tag-icon`}></i>
      <div className="tag-text">{tag.name}</div>
    </Link>
  )
}
