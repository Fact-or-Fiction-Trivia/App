import React, { useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./ContestAQuestion.module.scss";
import classNames from "classnames";
import { createContestedQuestion } from "../../redux/reducers/contestQuestion";

const ContestAQuestion = ({
  getQuestions,
  isLoggedIn,
  question,
  submitContest,
}) => {
  const [issue, setIssue] = useState("");
  const [source, setSource] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!question) {
      getQuestions();
    }
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    if (source !== "" && issue !== "") {
      submitContest({
        issue,
        source,
        questionId: question.id,
      });
    }
  };

  const backToQuiz = () => {
    // todo
  };

  const renderQ = () => {
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

  if (!isLoggedIn) {
    alert("you must be logged in for this");
  }

  return (
    <Paper className={styles.container}>
      {submitted ? (
        <div className={styles.postSubmit}>
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
            onClick={() => backToQuiz()}
          >
            Back to Quiz
          </Button>
        </div>
      ) : (
        <>
          <h1>Contest a Question</h1>
          <p>
            Think you found a mistake? Let us know below. You can contest each
            question once. Please provide a credible source to back up your
            explanation.
          </p>
          <div>{renderQ()}</div>

          {question ? (
            <div>
              <TextField
                id="standard-multiline-flexible"
                label="Explain the issue with this question"
                multiline
                onChange={(e) => setIssue(e.target.value)}
                margin="normal"
                name="issue"
                fullWidth
                value={issue}
              />
              <TextField
                label="Provide a credible source"
                fullWidth
                onChange={(e) => setSource(e.target.value)}
                margin="normal"
                name="source"
                value={source}
              />
              <div className={styles.buttonContainer}>
                <Button
                  color="primary"
                  variant="outline"
                  onClick={() => backToQuiz()}
                >
                  Back to Game
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={issue === "" || source === ""}
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
};

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
    submitContest(contest) {
      dispatch(createContestedQuestion(contest));
    },
  };
};

export default connect(mapState, mapDispatch)(ContestAQuestion);
