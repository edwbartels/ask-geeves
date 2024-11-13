import { ReactNode } from "react"
import { useModal } from "../../context/Modal"

// import "../../css/OpenModalLink.css";

interface OpenModalButtonProps {
  modalComponent: ReactNode
  buttonText: string
  onItemClick?: () => void
  onModalClose?: () => void
  additionalClassNames?: string[]
}
export function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  additionalClassNames,
}: OpenModalButtonProps) {
  const { setModalContent, setOnModalClose } = useModal()
  const buttonClasses =
    "openModalMenuItem " + (additionalClassNames?.join(" ") ?? "")

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose)
    setModalContent(modalComponent)
    if (typeof onItemClick === "function") onItemClick()
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {buttonText}
    </button>
  )
}
