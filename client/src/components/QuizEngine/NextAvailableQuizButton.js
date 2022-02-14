import React, { Component } from "react";
import { db } from "../../firebase";

import Button from "@material-ui/core/Button";
import "./quiz.css";

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
class NextAvailableQuizButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextQuizDate: "",
      disabled: false,
    };
    this.getNextQuiz = this.getNextQuiz.bind(this);
  }

  getNextQuiz = async (currentQuizDate) => {
    let nextQuizDate;
    await db
      .getNextQuizDate(currentQuizDate)
      .then((res) => {
        nextQuizDate = Object.keys(res.val())[0];
      })
      .catch((error) => console.log("errorFetchingNextQuiz: ", error));
    return nextQuizDate;
  };

  handleClick = async () => {
    //get next quiz in this month with no score
    let quizDate;
    await this.getNextQuiz(this.props.date).then((res) => {
      quizDate = res;
    });
    // redirect if all quizzes finished
    if (quizDate === "Invalid date") {
      this.props.history.push("/quiz-archive");
    }
    // redirect if new quiz available

    this.props.renderNextQuiz(quizDate);
  };

  render() {
    return (
      <>
        {this.state.disabled ? (
          <Button variant="contained" disabled={true}>
            No More Quizzes Available
          </Button>
        ) : (
          <Button
            variant="contained"
            id={this.state.disabled ? "keep-playing disabled" : "keep-playing"}
            onClick={this.handleClick}
            disabled={this.state.disabled}
          >
            {this.props.text !== undefined ? this.props.text : "Keep Playing"}
          </Button>
        )}
      </>
    );
  }
}

export default NextAvailableQuizButton;
