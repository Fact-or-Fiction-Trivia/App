import React from "react";
import classNames from "classnames";
import styles from "./Answer.module.scss";

const Answer = ({
  handleCorrectContinueClick,
  handleIncorrectContinueClick,
  isCorrect,
  question,
}) => {
  const handleContestQuestion = () => {
    alert("Coming Soon");
  };

  const handleContinueClick = () => {
    if (isCorrect) {
      handleCorrectContinueClick(question);
    } else {
      handleIncorrectContinueClick(question);
    }
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
        <a className={styles.linkStyle} href={question.source} target="_blank">
          Learn more
        </a>
      </div>

      <div className={styles.buttonContainer}>
        <div
          className={styles.keepPlaying}
          onClick={() => handleContinueClick()}
        >
          {isCorrect ? "Keep Playing" : "Continue"}
        </div>
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
