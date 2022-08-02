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
    <div className={styles.question}>
      <TimerBar
        timer={timer}
        interval={interval}
        increaseStreak={increaseStreak}
        question={question}
        selected={selected}
      />
      {/* only show the first tag if there are multiple */}
      {question.tags[0] && (
        <div className={styles.tag}>{question.tags[0]?.name}</div>
      )}
      <div className={styles.textContainer}>{question.text}</div>
      <div className={styles.buttonContainer}>
        <div
          className={classNames(
            styles.individualButtonContainer,
            selected === "Fact" && isCorrect && styles.correctAnswer
          )}
        >
          <button
            className={classNames(
              styles.button,
              styles.fact,
              !isAnswering && styles.disabled,
              selected === "Fact" && styles.factSelected,
              selected === "Fact" && isCorrect && styles.correctAnimation,
              selected === "Fact" && !isCorrect && styles.incorrectAnimation
            )}
            disabled={!isAnswering}
            onClick={() => handleAnswer(question, "Fact")}
          >
            Fact
          </button>
        </div>
        <div
          className={classNames(
            styles.individualButtonContainer,
            selected === "Fiction" && isCorrect && styles.correctAnswer
          )}
        >
          <button
            className={classNames(
              styles.button,
              styles.fiction,
              !isAnswering && styles.disabled,
              selected === "Fiction" && styles.fictionSelected,
              selected === "Fiction" && isCorrect && styles.correctAnimation,
              selected === "Fiction" && !isCorrect && styles.incorrectAnimation
            )}
            disabled={!isAnswering}
            onClick={() => handleAnswer(question, "Fiction")}
          >
            Fiction
          </button>
        </div>
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { isAnswering } = state.streak;
  return { isAnswering };
};

export default connect(mapState)(Question);
