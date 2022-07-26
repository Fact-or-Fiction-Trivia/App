import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";

import Paper from "@material-ui/core/Paper";
import MaterialButton from "@material-ui/core/Button";
import Button from "../Button/Button";
import { ADMIN_DASHBOARD } from "../../constants/routes";
import styles from "./SubmittedQuestions/ReviewQuestions/ReviewQuestions.module.scss";

import "./dashboard.css";
import {
  fetchAdminContestedQuestions,
  updateContestedQuestions,
  updateUserPoints,
} from "../../redux/reducers/admin";

export const ReviewContestedQuestions = ({
  contestedQuestions,
  getContestedQuestions,
  increaseScore,
  updateContestedQuestion,
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedQ, setSelectedQ] = useState({}); // eslint-disable-line no-unused-vars
  useEffect(() => {
    getContestedQuestions(setSelectedQ);
  }, [getContestedQuestions]);

  const rejectQ = () => {
    updateContestedQuestion({
      contestedQuestionId: contestedQuestions[questionIdx].id,
      status: "Denied",
      questionIdx,
    });
    const lastIdx = contestedQuestions.length - 1;
    if (lastIdx < questionIdx + 1) {
      setQuestionIdx(0);
    }
  };

  const skipQ = () => {
    const lastIdx = contestedQuestions.length - 1;
    if (lastIdx >= questionIdx + 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setQuestionIdx(0);
    }
  };

  const acceptQ = async (userId) => {
    // send an email to the user that their question was accepted
    // increase their points
    updateContestedQuestion({
      contestedQuestionId: contestedQuestions[questionIdx].id,
      status: "Approved",
      questionIdx,
    });
    const lastIdx = contestedQuestions.length - 1;
    if (lastIdx < questionIdx + 1) {
      setQuestionIdx(0);
    }
    increaseScore(userId);
  };

  const contestedQuestion = () => {
    if (contestedQuestions.length > 0) {
      return (
        <div className={styles.containerInner}>
          <div className={styles.question}>
            <h2 data-target="question">
              {contestedQuestions[questionIdx].question.text}
            </h2>
            <p>
              <span className={styles.bold}>Issue:</span>
              {contestedQuestions[questionIdx].issue}
            </p>
            <p>
              <span className={styles.bold}>Source:</span>{" "}
              <a
                href={contestedQuestions[questionIdx].source}
                target="_blank"
                rel="noreferrer"
              >
                {contestedQuestions[questionIdx].source}
              </a>
            </p>
          </div>
          <div className={styles.userInfo}>
            <p>
              <span className={styles.bold}>Challenged by:</span>
              {contestedQuestions[questionIdx].user.username}
            </p>
            <p>
              <span className={styles.bold}>User Email: </span>
              <a
                href={`mailto:${contestedQuestions[questionIdx].user.email}`}
                style={{ fontWeight: "normal" }}
                data-target="email"
              >
                {contestedQuestions[questionIdx].user.email}
              </a>
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
      {contestedQuestions.length === 0 ? (
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
          <h1>User-Contested Questions</h1>
          <p className={styles.counter}>
            Challenges remaining: {contestedQuestions.length}
          </p>
          {contestedQuestion()}
          <div className={styles.reviewButtonHolder}>
            <Button onClick={rejectQ} variant="red">
              <span>Reject</span>
            </Button>
            <Button onClick={skipQ} variant="black">
              Skip
            </Button>
            <Button
              onClick={() => acceptQ(contestedQuestions[questionIdx].userId)}
              variant="primary"
            >
              <span>Accept</span>
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};

const mapState = (state) => {
  const { contestedQuestions } = state.admin;
  return {
    contestedQuestions,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getContestedQuestions(cb) {
      dispatch(fetchAdminContestedQuestions(cb));
    },
    updateContestedQuestion(data) {
      dispatch(updateContestedQuestions(data));
    },
    increaseScore(userId) {
      dispatch(updateUserPoints({ userId }));
    },
  };
};

export default connect(mapState, mapDispatch)(ReviewContestedQuestions);
