// eslint-disable dot-notation

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Button from "../../../Button/Button";
import MaterialButton from "@material-ui/core/Button";

import { fetchAdminQuestionsToReview } from "../../../../redux/reducers/admin";

import { ADMIN_DASHBOARD } from "../../../../constants/routes";

import "../../dashboard.css";
import styles from "./ReviewQuestions.module.scss";

const ReviewQuestions = ({ getQuestionsToReview, questionsToReview }) => {
  const [selectedQ, setSelectedQ] = useState(0);
  // this.state = {
  //   selectedQ: {},
  //   index: 0,
  //   dateArray: [],
  //   noQuestionsRemaining: false,
  //   loaded: false,
  // };

  useEffect(() => {
    getQuestionsToReview(setSelectedQ);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const rejectQ = () => {
    // set status to Denied
    // shift question off of questions to review array
  };

  const skipQ = () => {
    // shift + push question to end of questions to Review array
  };

  // will need to modify this when I add in contested question
  const acceptQ = async () => {
    // change the question status to approved
    // shift question off of questions to review array
    // send an email to the user that their question was accepted
    // increase their points
  };

  let q = {};
  if (selectedQ) {
    q = selectedQ;
  }

  /* eslint-disable dot-notation */

  console.log(questionsToReview, selectedQ);

  const question = () => {
    if (questionsToReview.length > 0) {
      return (
        <div className={styles.containerInner}>
          <div className={styles.question}>
            <h2 data-target="question">
              <span className={styles.bold}>Question:</span> {q.text}
            </h2>
            <p>
              <span className={styles.bold}>Answer:</span> {q.answer}
            </p>
            <p>
              <span className={styles.bold}>Explanation:</span> {q.explanation}
            </p>
            <p>
              <span className={styles.bold}>Source:</span>{" "}
              <a href={q.source}>{q.source}</a>
            </p>
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.user}>
              <span className={styles.bold}>Submitted by:</span> {q.username}
            </h2>
            <p>
              <span className={styles.bold}>Email:</span>{" "}
              <a
                href={`mailto:${q.email}`}
                style={{ fontWeight: "normal" }}
                data-target="email"
              >
                {q.email}
              </a>
            </p>
            <p>
              <span className={styles.bold}>Affiliation:</span> {q.affiliation}
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <Paper className={styles.review}>
      <Link to={ADMIN_DASHBOARD} className={styles.reviewBackButton}>
        <MaterialButton variant="contained" color="primary">
          Back to Dashboard
        </MaterialButton>
      </Link>
      {questionsToReview.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1 id="noQs">No Questions To Review</h1>
          <MediaQuery maxWidth={415}>
            <Link
              to={ADMIN_DASHBOARD}
              id="reviewBackButtonMobile"
              style={{ textDecoration: "none" }}
            >
              <Button color="primary">Back to Dashboard</Button>
            </Link>
          </MediaQuery>
        </div>
      ) : (
        <>
          <h1>User-Submitted Questions</h1>
          {question()}
          <div className={styles.reviewButtonHolder}>
            <Button onClick={rejectQ} variant="red">
              <span>Reject</span>
            </Button>
            <Button onClick={skipQ} variant="black">
              Skip
            </Button>
            <Button onClick={acceptQ} variant="primary">
              <span>Accept</span>
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};

const mapState = (state) => {
  const { questionsToReview } = state.admin;
  return {
    questionsToReview,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getQuestionsToReview(cb) {
      dispatch(fetchAdminQuestionsToReview(cb));
    },
  };
};

export default connect(mapState, mapDispatch)(ReviewQuestions);
