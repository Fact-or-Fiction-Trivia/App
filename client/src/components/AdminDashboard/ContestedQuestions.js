import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import classNames from "classnames";

import { REVIEW_CONTEST } from "../../constants/routes";
import styles from "./dashboard.module.scss";
import { getContestedQuestionCount } from "../../redux/reducers/admin";

const ContestedQuestions = ({ onLoad, contestedCount }) => {
  useEffect(() => {
    onLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link to={REVIEW_CONTEST} style={{ textDecoration: "none" }}>
      <div className={classNames(styles.reviewWidget, styles.contestWidget)}>
        <div className={styles.counterDisplay}>{contestedCount}</div>
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
