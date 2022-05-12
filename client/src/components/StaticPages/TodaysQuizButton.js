import React, { useEffect } from "react";

import Button from "../../components/Button/Button";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchQuestions } from "../../redux/reducers/question";
import { GAME } from "../../constants/routes";
import "./Static.scss";

const TodaysQuizButton = ({ getQuestions, loading, questions }) => {
  const history = createBrowserHistory();

  useEffect(() => {
    if (!questions || questions.length === 0) {
      getQuestions();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Button
        className="todaysQuizButton"
        color="primary"
        variant="contained"
        size="large"
        id="archive-link"
        disabled={true}
      >
        Loading...
      </Button>
    );
  } else {
    return (
      <Link to={GAME}>
        <Button
          className="todaysQuizButton"
          color="primary"
          variant="contained"
          size="large"
          id="archive-link"
          disabled={loading}
          padded
          onClick={() => history.push(GAME)}
        >
          Play Now
        </Button>
      </Link>
    );
  }
};

const mapState = (state) => {
  const { questions } = state.question;
  return {
    questions,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getQuestions() {
      dispatch(fetchQuestions());
    },
  };
};

export default connect(mapState, mapDispatch)(TodaysQuizButton);
