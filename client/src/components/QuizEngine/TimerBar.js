import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const isProduction = process.env.NODE_ENV === "production";
const timerDuration = isProduction ? 15000 : 5000;
const timerInterval = isProduction ? 150 : 50;

const TimerBar = ({ timer, interval, increaseStreak, question }) => {
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
      <div
        style={{
          width: "100%",
          backgroundColor: "rgb(233, 233, 233)",
          borderRadius: ".5rem",
        }}
      >
        <div
          style={{
            width: `${value.dif}%`,
            backgroundColor: "rgb(62, 122, 235)",
            height: 10,
            borderRadius: "1rem",
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
