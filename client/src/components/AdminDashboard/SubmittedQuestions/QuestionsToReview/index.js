import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { REVIEW } from "../../../../constants/routes";

import "../../dashboard.css";
import { getPendingQuestionCount } from "../../../../redux/reducers/admin";

// number of questions in the db with status pending

const QuestionsToReview = ({ onLoad, reviewCount }) => {
  useEffect(() => {
    onLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link to={REVIEW} style={{ textDecoration: "none" }}>
      <div className="reviewWidget">
        <div className="counterDisplay">{reviewCount}</div>
        <h1>Questions to be reviewed</h1>
      </div>
    </Link>
  );
};

const mapState = (state) => {
  const { pendingQuestionCount } = state.admin;
  return {
    reviewCount: pendingQuestionCount,
  };
};

const mapDispatch = (dispatch) => ({
  onLoad() {
    dispatch(getPendingQuestionCount());
  },
});

export default connect(mapState, mapDispatch)(QuestionsToReview);
