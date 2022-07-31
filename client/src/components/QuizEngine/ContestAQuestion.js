import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";

import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { fetchQuestions } from "../../redux/reducers/question";
import {
  createContestedQuestion,
  midContestedQuestion,
} from "../../redux/reducers/contestQuestion";
import { setAuthMessage, setPostAuthRedirect } from "../../redux/reducers/auth";
import { ABOUT, CONTEST, SIGN_IN } from "../../constants/routes";
import styles from "./ContestAQuestion.module.scss";
import owl from "../../images/excited_owl.gif";

const ContestAQuestion = ({
  getQuestions,
  isLoggedIn,
  question,
  setRedirect,
  submitContest,
  setMidContest,
}) => {
  const history = useHistory();
  const [issue, setIssue] = useState("");
  const [source, setSource] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!question) {
      getQuestions();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    setMidContest(true);
    history.push("/game/play");
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
    setRedirect(CONTEST, "You must be logged in to challenge questions");
    history.push(SIGN_IN);
  }

  return (
    <Paper className={styles.container}>
      {submitted ? (
        <div className={styles.postSubmit}>
          <img
            className={styles.owl}
            src={owl}
            alt="Bouncing owl thanks you for your submission!"
          />
          <h1>Thank you for your input!</h1>
          <p>The Fact or Fiction team will review your submission.</p>
          <p>
            If we accept your contest,{" "}
            <span className={styles.primary}>1 hootpoint</span> will be added to
            your account.{" "}
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
            Think the answer to a question is incorrect? Make your case for why
            by completing the form below.
          </p>
          <p className={styles.emphasis}>
            If the question is indeed correct, it will be fixed/removed, and you
            will receive additional points.
          </p>
          <p>
            Be sure to refer to the <Link to={ABOUT}>About/FAQ</Link> page for
            what constitutes a reliable source and a fact vs. an opinion.
          </p>
          {renderQ()}

          {question ? (
            <div className={styles.contestFields}>
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
              </div>
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
    setRedirect(redirect, message) {
      dispatch(setPostAuthRedirect(redirect));
      dispatch(setAuthMessage(message));
    },
    submitContest(contest) {
      dispatch(createContestedQuestion(contest));
    },
    setMidContest(bool) {
      dispatch(midContestedQuestion(bool));
    },
  };
};

export default connect(mapState, mapDispatch)(ContestAQuestion);
