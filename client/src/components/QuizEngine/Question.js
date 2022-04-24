import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import styles from "./Question.module.scss";
import TimerBar from "./TimerBar";

const Question = ({
  handleAnswer,
  increaseStreak,
  isAnswering,
  isCorrect,
  question,
  selected,
  timer,
  interval,
}) => {
  if (!question) return null;
  return (
    <div>
      <TimerBar
        timer={timer}
        interval={interval}
        increaseStreak={increaseStreak}
        question={question}
      />
      {question.tags.map((tag) => (
        <div className={styles.tag}>{tag.name}</div>
      ))}
      <div className={styles.textContainer}>{question.text}</div>
      <div className={styles.buttonContainer}>
        <button
          className={classNames(
            styles.button,
            styles.fact,
            !isAnswering && styles.disabled,
            selected === "Fact" && styles.factSelected,
            selected === "Fact" && isCorrect && styles.correctAnswer
          )}
          disabled={!isAnswering}
          onClick={() => handleAnswer(question, "Fact")}
        >
          Fact
        </button>
        <button
          className={classNames(
            styles.button,
            styles.fiction,
            !isAnswering && styles.disabled,
            selected === "Fiction" && styles.fictionSelected,
            selected === "Fiction" && isCorrect && styles.correctAnswer
          )}
          disabled={!isAnswering}
          onClick={() => handleAnswer(question, "Fiction")}
        >
          Fiction
        </button>
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { isAnswering } = state.streak;
  return { isAnswering };
};

export default connect(mapState)(Question);
