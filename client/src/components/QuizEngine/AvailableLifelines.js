import React from "react";
import { connect } from "react-redux";
import { shouldEndStreak } from "../../redux/reducers/streak";
import styles from "./AvailableLifelines.module.scss";
import owl from "../../images/pointing_owl.gif";
import Button from "../Button/Button";
import { updateUserInfo } from "../../redux/reducers/auth";

const AvailableLifelines = ({
  endStreak,
  hootPoints,
  preserveStreak,
  streakLength,
}) => (
  <div className={styles.container}>
    <h1>Preserve your streak!</h1>
    <div className={styles.streakContainer}>
      <span className={styles.streak}>{streakLength}</span>
      <img
        className={styles.owl}
        src={owl}
        alt={`Owl pointing to the left towards your streak of ${streakLength}`}
      />
    </div>
    <p className={styles.hoots}>
      You have <span className={styles.hootPoints}>{hootPoints}</span> hoot
      points available
    </p>
    <div className={styles.buttonContainer}>
      <Button variant="primary" onClick={() => preserveStreak(hootPoints)}>
        Keep playing for 1 hoot point
      </Button>
      <Button variant="black" onClick={() => endStreak()}>
        End my streak and play again
      </Button>
    </div>
  </div>
);

const mapState = (state) => {
  const { auth } = state.auth;
  const { streak } = state.streak;
  return {
    hootPoints: auth.points,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
  };
};

const mapDispatch = (dispatch) => {
  return {
    preserveStreak(hootPoints) {
      // deduct one point from the user
      // user will not see this screen if they have 0 hootpoints, but adding a check here just in case
      if (hootPoints > 0) {
        dispatch(updateUserInfo({ points: hootPoints - 1 }));
      }
      dispatch(shouldEndStreak(false));
    },
    endStreak() {
      dispatch(shouldEndStreak(true));
    },
  };
};

export default connect(mapState, mapDispatch)(AvailableLifelines);
