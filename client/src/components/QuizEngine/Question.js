import React from "react";
import classNames from "classnames";
import styles from "./Question.module.scss";
import "./quiz.css";
import { TimerBar } from "./TimerBar";

const Question = ({ handleClick, question }) => {
  if (!question) return null;
  return (
    <>
      <TimerBar width={400} percent={1} />
      <div className={styles.textContainer}>{question.text}</div>
      <div className={styles.buttonContainer}>
        <div
          className={classNames(styles.button, styles.fact)}
          onClick={() => handleClick(question, "Fact")}
        >
          Fact
        </div>
        <div
          className={classNames(styles.button, styles.fiction)}
          onClick={() => handleClick(question, "Fiction")}
        >
          Fiction
        </div>
      </div>
    </>
  );
};

export default Question;
