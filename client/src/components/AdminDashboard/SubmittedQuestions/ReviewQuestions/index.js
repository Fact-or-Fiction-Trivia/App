// eslint-disable dot-notation

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { fetchAdminQuestionsToReview } from "../../../../redux/reducers/admin";

import { ADMIN_DASHBOARD } from "../../../../constants/routes";

import "../../dashboard.css";

const ReviewQuestions = ({ getQuestionsToReview, questionsToReview }) => {
  const [selectedQ, setSelectedQ] = useState(null);
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

  const question = () => {
    if (questionsToReview.length > 0) {
      return (
        <div className="questionHolder">
          <p style={{ fontWeight: "bold" }}>
            Submitted by:{" "}
            <Link to={`profile/${q["fromUser"]}`} data-target="username">
              {q["displayName"] !== undefined ? q["displayName"] : "User"}
            </Link>
          </p>
          <p style={{ fontWeight: "bold" }}>
            User Email:{" "}
            {q["userEmail"] !== undefined ? (
              <a
                href={`mailto:${q["userEmail"]}`}
                style={{ fontWeight: "normal" }}
                data-target="email"
              >
                {q["userEmail"]}
              </a>
            ) : (
              "N / A"
            )}
          </p>
          <h3 data-target="question">{q["text"]}</h3>
          <div>{q["answer"]}</div>
          <div>
            <p>
              Sources: <a href={q["source"]}>{q["source"]}</a>
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
        <div>
          <h1 id="reviewHeading">User-Submitted Questions</h1>
          {question()}
        </div>
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
