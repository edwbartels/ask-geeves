import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { Modal, ModalProvider } from "./context/Modal"
import { store } from "./app/store"
import "./index.css"

import { csrfFetch } from "./app/csrfFetch"

const container = document.getElementById("root")

if (import.meta.env.MODE !== "production") {
  // @ts-expect-error aA crap
  window.csrfFetch = csrfFetch
}

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <ModalProvider>
        <Provider store={store}>
          <App />
          <Modal />
        </Provider>
      </ModalProvider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
