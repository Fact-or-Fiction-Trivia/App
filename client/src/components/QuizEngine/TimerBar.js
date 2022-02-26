import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./quiz.css";

const TimerBar = ({ timer, increaseStreak, answered, question }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    // Set the width of the div to 100% after the component has
    // had a chance to load in order to trigger the
    // transition animation properly
    setTimeout(() => setValue(100), 0);

    // Assign the setTimeoutId to the timer reference made in
    // the PlayQuiz component
    timer.current = setTimeout(() => {
      // Treat this timeout exactly like an
      // incorrectly answered question
      increaseStreak({
        questionId: question.id,
        answeredCorrectly: false,
      });
      answered(question.id);
      // Timeout in a little over 5 seconds
    }, 5050);
  }, []);
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
            width: `${value}%`,
            backgroundColor: "rgb(62, 122, 235)",
            height: 10,
            borderRadius: "1rem",
            transition: "width 5s linear",
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
