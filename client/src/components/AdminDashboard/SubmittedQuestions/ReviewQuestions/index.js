// eslint-disable dot-notation

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Button from "../../../Button/Button";
import MaterialButton from "@material-ui/core/Button";

import {
  fetchAdminQuestionsToReview,
  removeSubmittedQuestion,
  skipSubmittedQuestion,
  updateAdminQuestion,
  updateUserPoints,
} from "../../../../redux/reducers/admin";

import { ADMIN_DASHBOARD } from "../../../../constants/routes";

import "../../dashboard.css";
import styles from "./ReviewQuestions.module.scss";

const ReviewQuestions = ({
  accept,
  getQuestionsToReview,
  questionsToReview,
  reject,
  skip,
}) => {
  const [selectedQ, setSelectedQ] = useState(0);

  useEffect(() => {
    getQuestionsToReview(setSelectedQ);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (questionsToReview[0] !== selectedQ) {
      setSelectedQ(questionsToReview[0]);
    }
  }, [questionsToReview]); // eslint-disable-line react-hooks/exhaustive-deps

  let q = {};
  if (selectedQ) {
    q = selectedQ;
  }

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
          {window.innerWidth > 576 ? "Back to Dashboard" : "Back"}
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
          <p className={styles.counter}>
            Questions remaining: {questionsToReview.length}
          </p>
          {question()}
          <div className={styles.reviewButtonHolder}>
            <Button onClick={() => reject(q.id, q)} variant="red">
              Reject
            </Button>
            <Button onClick={() => skip()} variant="black">
              Skip
            </Button>
            <Button onClick={() => accept(q.id, q, q.author)} variant="primary">
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
    reject(questionId, question) {
      dispatch(
        updateAdminQuestion({
          questionId,
          body: { questionData: { ...question, status: "Denied" } },
        })
      );
      dispatch(removeSubmittedQuestion());
    },
    skip() {
      dispatch(skipSubmittedQuestion());
    },
    accept(questionId, question, userId) {
      dispatch(
        updateAdminQuestion({
          questionId,
          body: { questionData: { ...question, status: "Approved" } },
        })
      );
      dispatch(removeSubmittedQuestion());
      dispatch(updateUserPoints({ userId }));
    },
  };
};

export default connect(mapState, mapDispatch)(ReviewQuestions);
