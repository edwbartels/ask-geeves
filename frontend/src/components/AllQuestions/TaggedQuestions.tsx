import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { QuestionTile } from './QuestionTile';
import './AllQuestions.css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAllQuestionsSettings } from '../../features/sessionSlice';
import { fetchTaggedQuestions, selectQuestionsArr } from '../../features/questionsSlice';

export const TaggedQuestions = () => {
  const { tagName } = useParams();
  const dispatch = useAppDispatch();
  const pageSettings = useAppSelector(selectAllQuestionsSettings);

  const [searchParams, setSearchParams] = useSearchParams({
    page: pageSettings.page,
    size: pageSettings.size,
  });

  const questions = useAppSelector(selectQuestionsArr);
  const questionIds = questions.map((question) => question.id);

  const incrementSearchParam = () => {
    const currentPage = Number(searchParams.get('page'));
    if (currentPage < Number(pageSettings.num_pages)) {
      const nextPage = (currentPage + 1).toString();
      searchParams.set('page', nextPage);
      setSearchParams(searchParams);
    }
  };

  const decrementSearchParam = () => {
    const currentPage = Number(searchParams.get('page'));
    if (currentPage > 1) {
      const nextPage = (currentPage - 1).toString();
      searchParams.set('page', nextPage);
      setSearchParams(searchParams);
    }
  };

  const handleSetResultsSize = (numPerPage: number) => () => {
    searchParams.set('size', numPerPage.toString());
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (tagName){
      dispatch(
        fetchTaggedQuestions({
          page: searchParams.get('page') || '1',
          size: searchParams.get('size') || '15',
          tagName:tagName,
        })
      );
    }
  }, [dispatch, searchParams.get('page'), searchParams.get('size'), tagName]);

  return (
    <div>
      <h1 className="all-questions-title">{tagName}</h1>
      {questionIds.map((id) => (
        <QuestionTile key={id} questionId={id} />
      ))}
      <div className="prev-next-container">
        <p>
          <button
            className="previous-button"
            disabled={Number(searchParams.get('page')) <= 1}
            onClick={decrementSearchParam}
          >
            Previous
          </button>
          Page: {searchParams.get('page')} of {pageSettings.num_pages}
          <button
            className="next-button"
            disabled={Number(searchParams.get('page')) >= Number(pageSettings.num_pages)}
            onClick={incrementSearchParam}
          >
            Next
          </button>
        </p>
      </div>
      <div className="page-count-container">
        <p className="per-page">
          Per page:
          <button className="page-number" onClick={handleSetResultsSize(5)}>
            5
          </button>
          <button className="page-number" onClick={handleSetResultsSize(15)}>
            15
          </button>
          <button className="page-number" onClick={handleSetResultsSize(30)}>
            30
          </button>
          <button className="page-number" onClick={handleSetResultsSize(50)}>
            50
          </button>
        </p>
      </div>
    </div>
  );
};
