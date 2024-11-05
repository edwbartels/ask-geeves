import { ReactNode } from "react"
import { useModal } from "../../context/Modal"

// import "../../css/OpenModalLink.css";

interface OpenModalLinkProps {
  modalComponent: ReactNode
  linkText: string
  onItemClick?: () => void
  onModalClose?: () => void
}
export function OpenModalLink({
  modalComponent, // component to render inside the modal
  linkText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}: OpenModalLinkProps) {
  const { setModalContent, setOnModalClose } = useModal()

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose)
    setModalContent(modalComponent)
    if (typeof onItemClick === "function") onItemClick()
  }

  return (
    <p onClick={onClick} className="openModalMenuItem">
      {linkText}
    </p>
  )
}
