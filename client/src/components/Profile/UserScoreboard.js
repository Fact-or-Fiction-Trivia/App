import React, { useEffect } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { getAllStreaksForUser } from "../../redux/reducers/profile";
import styles from "./UserScoreboard.module.scss";

const UserScoreboard = ({
  auth,
  profile,
  profileId,
  isPublic,
  getScores,
  hootPoints,
  scores,
}) => {
  // TODO: make this compatible with profile ids as well, since this will not work on the public profile page
  // public profile pages are turned off
  useEffect(() => {
    if (auth.id) {
      getScores(auth.id);
    }
  }, [auth.id]); // eslint-disable-line react-hooks/exhaustive-deps

  let content = (
    <div
      className={classNames(
        styles.smallScoreboardHolder,
        isPublic && styles.userScoreboardPublic
      )}
    >
      <h2>
        {auth.id === profileId ? "My" : `${profile.username}'s`} Longest Streaks
      </h2>
      <div className={styles.smallScoreboard}>
        <div className={styles.userScore}>
          Weekly
          <span className={styles.regScore}>{scores?.week}</span>
        </div>
        <div className={styles.userScore}>
          Monthly
          <span className={styles.regScore}>{scores?.month}</span>
        </div>
        <div className={styles.userScore}>
          All Time
          <span className={styles.regScore}>{scores?.allTime}</span>
        </div>
        <div className={styles.userScore}>
          HootPoints
          <span className={styles.regScore}>{hootPoints}</span>
        </div>
      </div>
    </div>
  );

  return <div>{content}</div>;
};

const mapState = (state) => {
  const { auth } = state.auth;
  const profile = state.profile;
  const isLoggedIn = !!auth.id;
  return {
    auth,
    isLoggedIn,
    profile: profile.profile,
    scores: profile.scores,
    hootPoints: auth.points,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getScores(id) {
      dispatch(getAllStreaksForUser(id));
    },
  };
};

export default connect(mapState, mapDispatch)(UserScoreboard);
