import React, { useState, useEffect, useRef } from "react"
import { canEdit } from "./AccountDetails"

interface EditableFieldProps {
  fieldName: canEdit
  value: string
  isEditing: boolean
  onEditClick: (field: canEdit) => void
  //   onChange: (field: canEdit, value: string) => void
  onSubmit: (field: canEdit, value: string) => void
  onCancel: () => void
}

export const EditableField: React.FC<EditableFieldProps> = ({
  fieldName,
  value,
  isEditing,
  onEditClick,
  onSubmit,
  onCancel,
}) => {
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEditing) {
      setTempValue(value)
    }
  }, [value, isEditing])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onCancel()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing, onCancel])

  return (
    <div className="account-detail" ref={inputRef}>
      <i
        className="fa-solid fa-pencil"
        onClick={() => onEditClick(fieldName)}
      ></i>
      {isEditing ? (
        <div className="input-area">
          <input
            type="text"
            value={tempValue}
            onChange={e => setTempValue(e.target.value)}
            autoFocus
          />
          <i
            className="fa-solid fa-check"
            onClick={() => onSubmit(fieldName, tempValue)}
          ></i>
        </div>
      ) : (
        <div>
          {(fieldName.charAt(0).toUpperCase() + fieldName.slice(1)).replace(
            "_",
            " ",
          )}
          : {value}
        </div>
      )}
    </div>
  )
}

export default EditableField
