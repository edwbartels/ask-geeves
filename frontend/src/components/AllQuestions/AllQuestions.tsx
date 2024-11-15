import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { setPostsPerPage } from "../../features/sessionSlice"
import {
  selectQuestionsArr,
  fetchAllQuestions,
  incrementCurrentPage,
  decrementCurrentPage,
} from "../../features/questionsSlice"
import { QuestionTile } from "./QuestionTile"
import { Question } from "../../features/questionsSlice"
import "./AllQuestions.css"
// const questionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const AllQuestions = () => {
  const dispatch = useAppDispatch()
  const [gotQuestions, setGotQuestions] = useState(false)
  const pageSettings = useAppSelector(state => state.questions.allQuestionsInfo)
  const sizeSetting = useAppSelector(state => state.session.settings.size)
  const [searchParams, setSearchParams] = useSearchParams()
  // const [searchParams, setSearchParams] = useSearchParams({
  //   page: String(pageSettings.page),
  //   num_pages: String(pageSettings.num_pages),
  // })
  const { tagName } = useParams()
  searchParams.set("page", String(pageSettings.page))
  searchParams.set("per_page", String(sizeSetting))
  if (tagName) {
    searchParams.set("tag", tagName)
  } else {
    searchParams.delete("tag")
  }
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    dispatch(fetchAllQuestions(searchParams.toString()))
  }, [searchParamsString, dispatch, fetchAllQuestions])

  const questions = useAppSelector(selectQuestionsArr)
  // }
  const questionIds = questions.map(question => (question as Question).id)

  const handleSetResultsSize = (numPerPage: number) => () => {
    dispatch(setPostsPerPage(numPerPage))
  }

  return (
    <div>
      <h1 className="all-questions-title">
        All {tagName ? tagName : ""} questions
      </h1>
      {questionIds.reverse().map(id => (
        <QuestionTile key={id} questionId={id} />
      ))}
      <div className="prev-next-container">
        <p className="page-previous-next-div">
          <button
            className="glow-on-hover"
            disabled={!(Number(searchParams.get("page")) > 1)}
            onClick={() => dispatch(decrementCurrentPage())}
          >
            Previous
          </button>
          Page: {pageSettings.page} of {pageSettings.num_pages}
          <button
            className="glow-on-hover"
            disabled={
              !(
                Number(searchParams.get("page")) <
                Number(pageSettings.num_pages)
              )
            }
            onClick={() => dispatch(incrementCurrentPage())}
          >
            Next
          </button>
        </p>
      </div>
      <div className="page-count-container">
        <p className="per-page">
<<<<<<< HEAD
          Per page:  
          <button className='page-number' onClick={handleSetResultsSize(5)}>5</button>
          <button className='page-number' onClick={handleSetResultsSize(15)}>15</button>
          <button className='page-number' onClick={handleSetResultsSize(30)}>30</button>
          <button className='page-number' onClick={handleSetResultsSize(50)}>50</button>

=======
          Per page:
          <button
            className={`page-number ${sizeSetting === 5 ? "page-active" : ""}`}
            onClick={handleSetResultsSize(5)}
          >
            5
          </button>
          <button
            className={`page-number ${sizeSetting === 15 ? "page-active" : ""}`}
            onClick={handleSetResultsSize(15)}
          >
            15
          </button>
          <button
            className={`page-number ${sizeSetting === 30 ? "page-active" : ""}`}
            onClick={handleSetResultsSize(30)}
          >
            30
          </button>
          <button
            className={`page-number ${sizeSetting === 50 ? "page-active" : ""}`}
            onClick={handleSetResultsSize(50)}
          >
            50
          </button>
>>>>>>> dev
        </p>
      </div>
    </div>
  )
}
