import React from "react";
import classNames from "classnames";
import Button from "../Button/Button";
import styles from "./Answer.module.scss";

const Answer = ({ handleContinue, isCorrect, question }) => {
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

export default Answer;
