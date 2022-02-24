import React, { useEffect } from "react";

import Button from "@material-ui/core/Button";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetchQuestions } from "../../redux/reducers/question";

const TodaysQuizButton = ({ getQuestions, loading, questions }) => {
  const history = createBrowserHistory();

  useEffect(() => {
    if (!questions || questions.length === 0) {
      getQuestions();
    }
  }, []);

  // disable button if there are no questions available
  const disabled = questions?.length === 0;

  if (disabled || loading) {
    return (
      <Button
        color="primary"
        variant="contained"
        size="large"
        id="archive-link"
        disabled={true}
      >
        {loading ? "Loading..." : "Play Now"}
      </Button>
    );
  } else {
    return (
      <Link to="/play">
        <Button
          color="primary"
          variant="contained"
          size="large"
          id="archive-link"
          disabled={disabled || loading}
          onClick={() => !disabled && history.push("/play")}
        >
          {loading ? "Loading..." : "Play Now"}
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
