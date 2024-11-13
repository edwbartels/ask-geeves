import { Props } from "./Post"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectSaveByContentAndId, toggleSave } from "../../features/savesSlice"
import classNames from "classnames"

export const SaveButton: React.FC<Props> = ({ id, type }) => {
  const dispatch = useAppDispatch()
  const saveInstance = useAppSelector(state =>
    selectSaveByContentAndId(state, type, id),
  )

  const isSaved = !!saveInstance

  const handleToggleSave = () => {
    dispatch(
      toggleSave({
        id: saveInstance?.id || 0,
        content_id: id,
        content_type: type,
      }),
    )
  }
  const buttonClass = classNames("save-button fa-regular fa-bookmark fa-xl", {
    "save-active": isSaved,
  })
  return (
    // <button className={buttonClass} onClick={handleToggleSave}>
    <i className={buttonClass} onClick={handleToggleSave}></i>
    // </button>
  )
}
