import React, { useState, useEffect, useRef } from "react"
import { cleanTagName } from "../../features/tagsSlice"
import { Tag } from "../Tag/Tag"

interface MinimalTag {
  // optional id field in case a new tag is added
  id?: number
  name: string
  cleanedName: string
}
interface Props {
  selectedTags: MinimalTag[]
  setSelectedTags: (newTags: MinimalTag[]) => void
  allTags: MinimalTag[]
}
export const TagSelector = ({
  selectedTags,
  setSelectedTags,
  allTags,
}: Props) => {
  //   const tagsInputRef = useRef<HTMLInputElement>(null)
  //   const tagsListRef = useRef<HTMLDivElement>(null)
  const [showTagList, setShowTagList] = useState(false)

  const selectedTagsCleanedNames = selectedTags.map(tag => tag.cleanedName)
  const availableTagsToAdd = allTags
    .filter(tag => !selectedTagsCleanedNames.includes(tag.cleanedName))
    .sort((a, b) => {
      if (a.cleanedName < b.cleanedName) {
        return -1
      } else if (a.cleanedName > b.cleanedName) {
        return 1
      } else {
        return 0
      }
    })

  /**
   * availableTagsToAdd is the list of (all tags in DB) - (all selected tags)
   * displayTagsList is availableTagsToAdd filtered by the tag input
   */
  // const [displayTagsList, setDisplayTagsList] = useState<MinimalTag[]>([])
  const [tagInput, setTagInput] = useState("")

  // useEffect(() => {
  //   if (availableTagsToAdd.length >= 0) {
  //     setDisplayTagsList(availableTagsToAdd)
  //   }
  // }, [allTags])
  // useEffect(() => {
  //   const newDisplayTagsList = availableTagsToAdd.filter(tag =>
  //     tag.cleanedName.includes(cleanTagName(tagInput)),
  //   )
  //   setDisplayTagsList(newDisplayTagsList)
  // }, [tagInput, setDisplayTagsList])
  const tagsToShow = availableTagsToAdd.filter(tag =>
    tag.cleanedName.includes(cleanTagName(tagInput)),
  )

  const handleShowTagList = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setShowTagList(true)
  }
  const handleSelectTag =
    (tagToAdd: MinimalTag) => (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation()
      setSelectedTags([...selectedTags, tagToAdd])
    }
  const handleRemoveTag =
    (tagToRemove: MinimalTag) => (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const newTags = selectedTags.filter(
        tag => tag.cleanedName !== tagToRemove.cleanedName,
      )
      setSelectedTags(newTags)
    }
  const handleChangeTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
    // const cleanedTagInput = cleanTagName(e.target.value)
  }

  const handleAddNewTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = {
        name: e.currentTarget.value,
        cleanedName: cleanTagName(e.currentTarget.value),
      }
      const availableTagsCleanedNames = availableTagsToAdd.map(
        tag => tag.cleanedName,
      )
      const isNewTagInSelectedList = selectedTagsCleanedNames.includes(
        newTag.cleanedName,
      )
      const isNewTagInAvailableList = availableTagsCleanedNames.includes(
        newTag.cleanedName,
      )
      if (!isNewTagInSelectedList) {
        setSelectedTags([...selectedTags, newTag])
      }
      setTagInput("")
    }
  }

  return (
    <div className="tags">
      <div className="selected-tags">
        {selectedTags.map(tag => (
          <div
            key={tag.cleanedName}
            onClick={handleRemoveTag(tag)}
            className="one-selected-tag"
          >
            {tag.name}
          </div>
        ))}
      </div>
      <div className="tag-selector">
        <div onClick={handleShowTagList}>Add tags</div>
        <input
          placeholder="Enter new tag"
          value={tagInput}
          onChange={handleChangeTagInput}
          onKeyDown={handleAddNewTag}
        />
        <div className="tag-list">
          <ul>
            {tagsToShow.length > 0
              ? tagsToShow.map((tag, i) => (
                  <li key={i + tag.cleanedName} onClick={handleSelectTag(tag)}>
                    {tag.name}
                  </li>
                ))
              : "(Add a new tag)"}
          </ul>
        </div>
      </div>
    </div>
  )
}
