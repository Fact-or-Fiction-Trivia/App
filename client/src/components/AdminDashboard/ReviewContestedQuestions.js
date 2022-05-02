import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { ADMIN_DASHBOARD } from "../../constants/routes";

import "./dashboard.css";
import { fetchAdminContestedQuestions } from "../../redux/reducers/admin";

export const ReviewContestedQuestions = ({
  getContestedQuestions,
  contestedQuestions,
}) => {
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

  const contestedQuestion = () => {
    if (contestedQuestions.length > 0 && selectedQ.userId) {
      return (
        <div className="questionHolder">
          <p style={{ fontWeight: "bold" }}>
            Submitted by:{" "}
            <Link to={`/profile/${selectedQ.userId}`} data-target="username">
              {selectedQ.user.fullName}
            </Link>
          </p>
          <p style={{ fontWeight: "bold" }}>
            User Email:{" "}
            {selectedQ.user.email ? (
              <a
                href={`mailto:${selectedQ.user.email}`}
                style={{ fontWeight: "normal" }}
                data-target="email"
              >
                {selectedQ.user.email}
              </a>
            ) : (
              "N / A"
            )}
          </p>
          <h3 data-target="question">{selectedQ.question.text}</h3>
          <div>{selectedQ.issue}</div>
          <div>
            <p>
              Sources:{" "}
              <a href={selectedQ.source} target="_blank" rel="noreferrer">
                {selectedQ.source}
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
  };
};

export default connect(mapState, mapDispatch)(ReviewContestedQuestions);
