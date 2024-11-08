import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectAllQuestionsSettings } from "../../features/sessionSlice"
import {
  selectQuestionsArr,
  fetchAllQuestions,
} from "../../features/questionsSlice"
import { QuestionTile } from "./QuestionTile"
// const questionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const AllQuestions = () => {
  const dispatch = useAppDispatch()
  const pageSettings = useAppSelector(selectAllQuestionsSettings)
  const [searchParams, setSearchParams] = useSearchParams()
  if (!searchParams.has("page")) {
    searchParams.set("page", pageSettings.page)
  }
  if (!searchParams.has("size")) {
    searchParams.set("size", pageSettings.size)
  }

  console.log(searchParams.get("size"))
  console.log(searchParams, searchParams.keys())

  const [gotQuestions, setGotQuestions] = useState(false)
  const questions = useAppSelector(selectQuestionsArr)
  const questionIds = questions.map(question => question.id)

  const incrementSearchParam = () => {
    const currentPage = Number(searchParams.get("page"))
    if (currentPage < Number(pageSettings.num_pages)) {
      const nextPage = (currentPage + 1).toString()
      searchParams.set("page", nextPage)
      setGotQuestions(false)
    }
  }
  const decrementSearchParam = () => {
    const currentPage = Number(searchParams.get("page"))
    if (currentPage > 1) {
      const nextPage = (currentPage - 1).toString()
      searchParams.set("page", nextPage)
      setGotQuestions(false)
    }
  }
  const handleSetResultsSize = (numPerPage: number) => () => {
    searchParams.set("size", numPerPage.toString())
    setGotQuestions(false)
  }

  if (!gotQuestions) {
    dispatch(
      fetchAllQuestions({
        page: searchParams.get("page") || "1",
        size: searchParams.get("size") || "15",
      }),
    )
    setGotQuestions(true)
  }
  return (
    <div>
      <h1>All questions</h1>
      {questionIds.map(id => (
        <QuestionTile key={id} questionId={id} />
      ))}
      <div>
        <p>
          <button
            disabled={!(Number(searchParams.get("page")) > 1)}
            onClick={decrementSearchParam}
          >
            Previous
          </button>
          Page: {pageSettings.page} of {pageSettings.num_pages}
          <button
            disabled={
              !(
                Number(searchParams.get("page")) <
                Number(pageSettings.num_pages)
              )
            }
            onClick={incrementSearchParam}
          >
            Next
          </button>
        </p>
        <p>
          Per page:
          <button onClick={handleSetResultsSize(5)}>5</button>
          <button onClick={handleSetResultsSize(15)}>15</button>
          <button onClick={handleSetResultsSize(30)}>30</button>
          <button onClick={handleSetResultsSize(50)}>50</button>
        </p>
      </div>
    </div>
  )
}
