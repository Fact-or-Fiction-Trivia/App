import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./quiz.css";

export const TimerBar = ({ width, percent }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    console.log("SET");
    setTimeout(() => setValue(100), 0);
    setTimeout(() => console.log("DONE"), 5000);
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
          // className="question-timer-keyframe"
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TimerBar);
