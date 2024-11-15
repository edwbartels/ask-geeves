import { Props } from "./Post"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { fetchAllSaves, selectSaveByContentAndId, toggleSave } from "../../features/savesSlice"
import classNames from "classnames"
import { useState } from "react"

export interface SaveButtonProps {
  type: "question" | "answer" | "comment"
  id: number
}

export const SaveButton: React.FC<SaveButtonProps> = ({ id, type }) => {
  const dispatch = useAppDispatch()
  const saveInstance = useAppSelector(state =>
    selectSaveByContentAndId(state, type, id),
  )

  const isSaved = !!saveInstance

  // const handleToggleSave = () => {
  //   dispatch(
  //     toggleSave({
  //       id: saveInstance?.id || 0,
  //       content_id: id,
  //       content_type: type,
  //     }),
  //   )
  // }
  const [loading, setLoading] = useState(false)

  const handleToggleSave = async () => {
    if (loading) return
    setLoading(true)
    await dispatch(
        toggleSave({
          id: saveInstance?.id || 0,
          content_id: id,
          content_type: type,
        }),
      )
      await dispatch(fetchAllSaves())    
      setLoading(false)
  }
  
  const buttonClass = classNames("save-button fa-bookmark fa-xl", {
    "save-active": isSaved,
    "fa-solid": isSaved,
    "fa-regular": !isSaved,
  })
  return <i className={buttonClass} onClick={handleToggleSave}></i>
}
