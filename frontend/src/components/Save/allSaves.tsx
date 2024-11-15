import { useEffect,useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchAllSaves, selectAllSaveItems } from '../../features/savesSlice';
import { SaveItem } from '../../features/savesSlice';
import { Link } from 'react-router-dom';
// import './allSaves.css';
import { SaveButton } from '../Post/SaveButton';

const AllSaves = () => {
  const dispatch = useAppDispatch();
  const saves = useAppSelector(selectAllSaveItems);
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    dispatch(fetchAllSaves());
    setLoading(false)
  }, [dispatch]);

  const savedQuestions = saves.filter(save => !save.answer_id);
  const savedAnswers = saves.filter(save => save.answer_id);

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <div className="all-saves-page">
      <div className="name-div">
        <div className="name">
          <h3 className="name">All Saved Items</h3>
        </div>
      </div>
      <div>
        <h2 className="user-title">Saved Questions</h2>
        {savedQuestions.length > 0 ? (
          savedQuestions.map((question, index) => (
            <div className="user-question-title" key={`question-${index}`}>
              <h3>
                  <SaveButton type="question" id={question.question_id} />
                <Link
                  className="user-questions"
                  to={`/questions/${question.question_id}`}
                >
                  {question.title}
                </Link>
              </h3>
              <p><span style={{fontWeight: "bold" , fontSize:"1.2em"}}>Question:</span>
              {question.question_content}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No saved questions.</p>
        )}
      </div>
      <div>
        <hr className="question-line" />
      </div>
      <div>
        <h2 className="user-title">Saved Answers</h2>
        {savedAnswers.length > 0 ? (
          savedAnswers.map((answer, index) => (
            <div key={`answer-${index}`}>
              <h3>
                  <SaveButton type="answer" id={answer.answer_id} />
                <Link
                  className="user-answers"
                  to={`/questions/${answer.question_id}`}
                >
                  {answer.title}
                </Link>
              </h3>
              <p><span style={{fontWeight: "bold" , fontSize:"1.2em"}}>Question:</span>
              {answer.question_content}</p>
              <p><span style={{fontWeight: "bold" , fontSize:"1.1em"}}>Answer:</span>
              {answer.answer_content}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No saved answers.</p>
        )}
      </div>
      <div>
        <hr className="answer-line" />
      </div>
    </div>
  );
};

export default AllSaves;
