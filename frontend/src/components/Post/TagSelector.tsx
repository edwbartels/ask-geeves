import React, { useState, useEffect, useRef } from "react"

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
  const tagsInputRef = useRef<HTMLInputElement>(null)
  const tagsListRef = useRef<HTMLDivElement>(null)
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

  const handleShowTagList = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setShowTagList(true)
  }

  const handleHideTagList = (e: MouseEvent) => {
    if (
      tagsInputRef.current &&
      !tagsInputRef.current.contains(e.target as Node) &&
      tagsListRef.current &&
      !tagsListRef.current.contains(e.target as Node)
    ) {
      setShowTagList(false)
    }
  }
  useEffect(() => {
    document.addEventListener("click", handleHideTagList)
    return () => document.removeEventListener("click", handleHideTagList)
  })

  const handleSelectTag =
    (tagToAdd: MinimalTag) => (e: React.MouseEvent<HTMLLIElement>) => {
      //   console.log("tagId received", tagId, [...selectedTags, tagId])
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
  const handleAddNewTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = {
        name: e.currentTarget.value,
        cleanedName: e.currentTarget.value
          .replace(/[^a-zA-Z0-9\s]/, "")
          .replace(/[\s]/, "-")
          .toLowerCase(),
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
      if (!isNewTagInAvailableList && !isNewTagInSelectedList) {
        setSelectedTags([...selectedTags, newTag])
      } else if (isNewTagInAvailableList) {
        setSelectedTags([...selectedTags, newTag])
      }
    }
  }

  return (
    <div className="tags">
      <div className="selected-tags">
        Current tags~~
        {selectedTags.map(tag => (
          <div key={tag.cleanedName} onClick={handleRemoveTag(tag)}>
            {tag.name}
          </div>
        ))}
      </div>
      <div className="tag-selector">
        <div onClick={handleShowTagList}>Add tags</div>
        <input placeholder="Enter new tag" onKeyDown={handleAddNewTag} />
        <div className="tag-list" ref={tagsListRef}>
          <ul>
            {availableTagsToAdd.map(tag => (
              <li key={tag.cleanedName} onClick={handleSelectTag(tag)}>
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
