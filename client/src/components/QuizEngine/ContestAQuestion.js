import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./ContestAQuestion.module.scss";
import classNames from "classnames";

class ContestAQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contestedQuestion: "",
      issue: "",
      source: "",
      submitted: false,
    };
  }

  componentDidMount() {
    if (!this.props.question) {
      this.props.getQuestions();
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    this.setState({
      submitted: true,
    });
  };

  backToQuiz = () => {
    // todo
  };

  renderQ = () => {
    const { question } = this.props;
    return (
      <>
        <div className={styles.question}>
          <h2>
            {" "}
            <span
              className={classNames(
                styles.tag,
                question?.answer === "Fact" ? styles.factTag : styles.fictionTag
              )}
            >
              {question?.answer}
            </span>
            {question?.text}
          </h2>
        </div>
        <div className={styles.explanation}>
          <b>Explanation: </b>
          {question?.explanation}{" "}
          <a href={question?.source} target="_blank" rel="noreferrer">
            Read the full source
          </a>
        </div>
      </>
    );
  };

  back = () => {
    if (this.props.atEndOfQuiz) {
      this.props.back();
    } else {
      localStorage.removeItem("state");
      window.close();
    }
  };

  render() {
    return (
      <Paper className={styles.container}>
        {this.state.submitted ? (
          <>
            <h1>Thank you for your input!</h1>
            <p>
              The Fact or Fiction team will review your submission. If we accept
              your contest, <span style={{ fontWeight: "bold" }}>2 points</span>{" "}
              will be added to your score.{" "}
            </p>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: "3vh" }}
              onClick={this.backToQuiz}
            >
              Back to Quiz
            </Button>
          </>
        ) : (
          <>
            <h1>Contest a Question</h1>
            <p>
              Think you found a mistake? Let us know below. You can contest each
              question once. Please provide a credible source to back up your
              explanation.
            </p>
            <div>{this.renderQ()}</div>

            {this.props.question ? (
              <div>
                <TextField
                  id="standard-multiline-flexible"
                  label="Explain the issue with this question"
                  multiline
                  onChange={this.handleChange}
                  margin="normal"
                  name="issue"
                  fullWidth
                />
                <TextField
                  label="Provide a credible source"
                  fullWidth
                  onChange={this.handleChange}
                  margin="normal"
                  name="source"
                />
                <div className={styles.buttonContainer}>
                  <Button
                    color="primary"
                    variant="outline"
                    onClick={this.backToQuiz}
                  >
                    Back to Game
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.handleSubmit}
                    disabled={
                      this.state.issue === "" || this.state.source === ""
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </Paper>
    );
  }
}

const mapState = (state) => {
  const { questions } = state.question;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;

  return {
    isLoggedIn,
    question: questions[0],
  };
};

const mapDispatch = (dispatch) => {
  return {
    // TODO: remove this or only call it in app component - we don't want it to get called repeatedly
    getQuestions() {
      dispatch(fetchQuestions());
    },
  };
};

export default connect(mapState, mapDispatch)(ContestAQuestion);
