import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { REVIEW_CONTEST } from "../../constants/routes";

import "./dashboard.css";
import { getContestedQuestionCount } from "../../redux/reducers/admin";

const ContestedQuestions = ({ onLoad, contestedCount }) => {
  useEffect(() => {
    onLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link to={REVIEW_CONTEST} style={{ textDecoration: "none" }}>
      <div className="reviewWidget contestWidget">
        <div className="counterDisplay">{contestedCount}</div>
        <h1>Contested Questions</h1>
      </div>
    </Link>
  );
};

const mapState = (state) => {
  const { contestedQuestionCount } = state.admin;
  return {
    contestedCount: contestedQuestionCount,
  };
};

const mapDispatch = (dispatch) => ({
  onLoad() {
    dispatch(getContestedQuestionCount());
  },
});

export default connect(mapState, mapDispatch)(ContestedQuestions);
