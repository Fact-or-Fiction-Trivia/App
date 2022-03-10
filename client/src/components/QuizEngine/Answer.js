import React, { useEffect } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import Button from "../Button/Button";
import styles from "./Answer.module.scss";
import { getQuestionPercentCorrect } from "../../redux/reducers/question";

const Answer = ({
  handleContinue,
  isCorrect,
  question,
  questionPercentage,
  isLoadingQuestionDetails,
  getPercentage,
}) => {
  useEffect(() => {
    getPercentage(question.id);
  }, []);
  const handleContestQuestion = () => {
    alert("Coming Soon");
  };

  return (
    <>
      {isCorrect ? (
        <div className={classNames(styles.isCorrect, styles.correct)}>
          Correct!
        </div>
      ) : (
        <div className={classNames(styles.isCorrect, styles.incorrect)}>
          Incorrect!
        </div>
      )}
      <div className={styles.textContainer}>
        {question.explanation}{" "}
        <a
          className={styles.linkStyle}
          href={question.source}
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
      <div className={styles.textContainer}>
        {isLoadingQuestionDetails
          ? null
          : questionPercentage === null
          ? "You're the first to answer this question."
          : `${questionPercentage}% of players answered this question correctly.`}
      </div>

      <div className={styles.buttonContainer}>
        <Button onClick={() => handleContinue()} variant="primary">
          {isCorrect ? "Keep Playing" : "Continue"}
        </Button>
        <div
          className={classNames(styles.linkStyle, styles.challenge)}
          onClick={() => handleContestQuestion()}
        >
          Challenge this question
        </div>
      </div>
    </>
  );
};

const mapState = (state) => {
  const { questionPercentage, isLoadingQuestionDetails } = state.question;
  return {
    questionPercentage,
    isLoadingQuestionDetails,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getPercentage(questionId) {
      dispatch(getQuestionPercentCorrect(questionId));
    },
  };
};

export default connect(mapState, mapDispatch)(Answer);
