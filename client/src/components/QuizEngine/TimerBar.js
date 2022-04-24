import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import styles from "./TimerBar.module.scss";

const isProduction = process.env.NODE_ENV === "production";
const timerDuration = isProduction ? 15000 : 5000;
const timerInterval = isProduction ? 150 : 50;

const TimerBar = ({ timer, interval, increaseStreak, question, selected }) => {
  const [value, setValue] = useState({ mil: Date.now(), dif: 0 });
  useEffect(() => {
    // Set the width of the div to 100% after the component has
    // had a chance to load in order to trigger the
    // transition animation properly
    setValue({ mil: Date.now(), dif: 0 });
    interval.current = setInterval(() => {
      setValue((prev) => {
        const mil = Date.now();
        const dif = (mil - prev.mil) / timerInterval;
        return { mil, dif: dif + prev.dif };
      });
    }, 10);
    // Assign the setTimeoutId to the timer reference made in
    // the PlayQuiz component
    timer.current = setTimeout(() => {
      // Treat this timeout exactly like an
      // incorrectly answered question
      setValue({ mil: Date.now(), dif: 100 });
      clearInterval(interval.current);
      increaseStreak({
        questionId: question.id,
        answeredCorrectly: false,
      });
    }, timerDuration);
    return () => {
      clearInterval(interval.current);
    };
  }, [question]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className={styles.timer}>
        <div
          className={classNames(styles.timerFill, selected && styles.paused)}
          style={{
            width: `${value.dif}%`,
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TimerBar);
