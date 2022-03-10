import React from "react";
import classNames from "classnames";
import styles from "./Question.module.scss";
import TimerBar from "./TimerBar";

const Question = ({ handleAnswer, question, timer, increaseStreak }) => {
  if (!question) return null;
  console.log(question.id, "Question");
  return (
    <div>
      <TimerBar
        timer={timer}
        increaseStreak={increaseStreak}
        question={question}
      />
      <h2>
        {question.tags.map((tag) => (
          <p>{tag.name}</p>
        ))}
      </h2>
      <div className={styles.textContainer}>{question.text}</div>
      <div className={styles.buttonContainer}>
        <div
          className={classNames(styles.button, styles.fact)}
          onClick={() => handleAnswer(question, "Fact")}
        >
          Fact
        </div>
        <div
          className={classNames(styles.button, styles.fiction)}
          onClick={() => handleAnswer(question, "Fiction")}
        >
          Fiction
        </div>
      </div>
    </div>
  );
};

export default Question;
