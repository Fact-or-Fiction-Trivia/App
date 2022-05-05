import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { ADMIN_DASHBOARD } from "../../constants/routes";

import "./dashboard.css";
import {
  fetchAdminContestedQuestions,
  updateContestedQuestions,
} from "../../redux/reducers/admin";

export const ReviewContestedQuestions = ({
  getContestedQuestions,
  contestedQuestions,
  updateContestedQuestion,
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedQ, setSelectedQ] = useState({});
  useEffect(() => {
    getContestedQuestions(setSelectedQ);
  }, [getContestedQuestions]);

  // let q = {};
  // if (selectedQ) {
  //   q = selectedQ;
  // }

  const rejectQ = () => {
    // set status to Denied
    // shift question off of questions to review array
    updateContestedQuestion({
      contestedQuestionId: contestedQuestions[questionIdx].id,
      status: "Denied",
      questionIdx,
    });
    const lastIdx = contestedQuestions.length - 1;
    if (lastIdx < questionIdx + 1) {
      setQuestionIdx(0);
    }
    // skipQ();
  };

  const skipQ = () => {
    const lastIdx = contestedQuestions.length - 1;
    if (lastIdx >= questionIdx + 1) {
      setQuestionIdx(questionIdx + 1);
    } else {
      setQuestionIdx(0);
    }
  };

  // will need to modify this when I add in contested question
  const acceptQ = async () => {
    // change the question status to approved
    // shift question off of questions to review array
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
  };

  const contestedQuestion = () => {
    if (contestedQuestions.length > 0) {
      return (
        <div className="questionHolder">
          <p style={{ fontWeight: "bold" }}>
            Submitted by:{" "}
            <Link
              to={`/profile/${contestedQuestions[questionIdx].userId}`}
              data-target="username"
            >
              {contestedQuestions[questionIdx].user.fullName}
            </Link>
          </p>
          <p style={{ fontWeight: "bold" }}>
            User Email:{" "}
            {contestedQuestions[questionIdx].user.email ? (
              <a
                href={`mailto:${contestedQuestions[questionIdx].user.email}`}
                style={{ fontWeight: "normal" }}
                data-target="email"
              >
                {contestedQuestions[questionIdx].user.email}
              </a>
            ) : (
              "N / A"
            )}
          </p>
          <h3 data-target="question">
            {contestedQuestions[questionIdx].question.text}
          </h3>
          <div>{contestedQuestions[questionIdx].issue}</div>
          <div>
            <p>
              Sources:{" "}
              <a
                href={contestedQuestions[questionIdx].source}
                target="_blank"
                rel="noreferrer"
              >
                {contestedQuestions[questionIdx].source}
              </a>
            </p>
          </div>
          <div className="reviewButtonHolder">
            <Button onClick={rejectQ}>
              <span style={{ color: "red", marginRight: "2vw" }}>Reject</span>
            </Button>
            <Button onClick={skipQ}>Skip</Button>
            <Button onClick={acceptQ}>
              <span style={{ color: "purple", marginLeft: "2vw" }}>Accept</span>
            </Button>
          </div>
        </div>
      );
    }
  };
  return (
    <Paper className="review">
      <MediaQuery minWidth={416}>
        <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
          <Button variant="contained" color="primary">
            Back to Dashboard
          </Button>
        </Link>
      </MediaQuery>
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
        <div>
          <h1 id="reviewHeading">User-Contested Questions</h1>
          {contestedQuestion()}
        </div>
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
  };
};

export default connect(mapState, mapDispatch)(ReviewContestedQuestions);
