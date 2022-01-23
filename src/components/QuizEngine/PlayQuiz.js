import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./PlayQuiz.module.scss";
import classNames from "classnames";

const PlayQuiz = ({ questions, getQuestions }) => {
  const index = 0; // TODO: iterate through questions
  useEffect(() => {
    // if there aren't questions already, fetch them
    if (questions.length === 0) {
      getQuestions();
    }
  }, []);

  // TODO: timer
  // tODO: scoring
  // TODO: login widget at end of streak
  // TODO: QUESTION REFETCH

  if (questions.length === 0) {
    return <div>Loading ...</div>;
  }
  return (
    <div className={styles.quizContainer}>
      <Paper className={styles.questionContainer}>
        <div className={styles.statsContainer}>
          <div>timer - todo</div>
          <div>your streak</div>
        </div>
        <div className={styles.textContainer}>{questions[index]?.text}</div>
        <div className={styles.buttonContainer}>
          <div className={classNames(styles.button, styles.fact)}>Fact</div>
          <div className={classNames(styles.button, styles.fiction)}>
            Fiction
          </div>
        </div>
      </Paper>
    </div>
  );
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

export default connect(mapState, mapDispatch)(PlayQuiz);
