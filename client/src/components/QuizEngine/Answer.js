import React, { useEffect } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import Button from "../Button/Button";
import styles from "./Answer.module.scss";
import { getQuestionPercentCorrect } from "../../redux/reducers/question";
import { Link } from "react-router-dom";
import { CONTEST } from "../../constants/routes";

const Answer = ({
  getPercentage,
  handleContinue,
  isLoadingQuestionDetails,
  question,
  questionPercentage,
}) => {
  useEffect(() => {
    getPercentage(question.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className={styles.textContainer}>
        {question.answer === "Fact" ? (
          <span className={classNames(styles.isCorrect, styles.correct)}>
            Fact!
          </span>
        ) : (
          <span className={classNames(styles.isCorrect, styles.incorrect)}>
            Fiction!
          </span>
        )}{" "}
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
      <div className={classNames(styles.textContainer, styles.percentage)}>
        {isLoadingQuestionDetails
          ? null
          : questionPercentage === null
          ? "You're the first to answer this question."
          : `${questionPercentage}% of players answered this question correctly.`}
      </div>

      <div id="continue" className={styles.buttonContainer}>
        <Link to={CONTEST}>CHALLENGE this question</Link>

        <Button
          className={styles.continueButton}
          onClick={() => handleContinue(question.id)}
          variant="primary"
        >
          Continue
        </Button>
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
