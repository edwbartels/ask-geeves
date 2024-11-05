import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom"
import { NavLink } from "react-router-dom"
import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"

import { NavBar } from "./components/NavBar/NavBar"
import { Sidebar } from "./components/Sidebar/Sidebar"
import { HomePage } from "./components/HomePage/HomePage"
import { AllQuestions } from "./components/AllQuestions/AllQuestions"
import { QuestionMain } from "./components/Question/QuestionMain"
import { CreateOrEditPost } from "./components/Post/CreateOrEditPost"

import { restoreSession } from "./features/sessionSlice"

const Layout = () => {
  return (
    <>
      <NavBar />
      <div className="main">
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "questions",
        children: [
          { path: "", element: <AllQuestions /> },
          { path: "ask", element: <CreateOrEditPost /> },
          {
            path: ":questionId",
            children: [
              { path: "", element: <QuestionMain /> },
              { path: "edit", element: <CreateOrEditPost /> },
              { path: "*", element: <QuestionMain /> },
            ],
          },
        ],
      },
      {
        path: "tagged",
        element: <h1>All tags</h1>,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

const App2 = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Quotes />
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://react-redux.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://reselect.js.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Reselect
          </a>
        </span>
      </header>
    </div>
  )
}

export default App
