import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { resetQuiz } from "../../redux/reducers/streak";
import { setPostAuthRedirect } from "../../redux/reducers/auth";
import Button from "../Button/Button";
import styles from "./EndOfStreak.module.scss";
import { SIGN_IN } from "../../constants/routes";

const EndOfStreak = ({
  isLoggedIn,
  maxStreak,
  setRedirect,
  streakLength,
  playNewGame,
}) => {
  const [serveAdd, setServeAdd] = useState(true);

  return (
    <div className={styles.container}>
      {serveAdd ? (
        <div>
          <p>Add</p>
          <Button variant="primary" onClick={() => setServeAdd(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <p>Final Streak</p>
          <h1 className={styles.streak}>{streakLength}</h1>

          {maxStreak > 0 && <div>Your record: {maxStreak}</div>}
          {isLoggedIn ? (
            <div>
              <Button variant="primary" onClick={playNewGame}>
                Play Again
              </Button>
              <Link to="/leaderboard">
                <Button variant="white">View Leaderboard</Button>
              </Link>
            </div>
          ) : (
            <div className={styles.buttonContainer}>
              <Link to={SIGN_IN} onClick={() => setRedirect("/game/play")}>
                Sign In
              </Link>
              <div className={styles.horizontalRule}>
                <span>or</span>
              </div>
              <Button
                className={styles.skipButton}
                variant="white"
                onClick={playNewGame}
              >
                Skip and play again
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const mapState = (state) => {
  const { streak, maxStreak } = state.streak;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    isLoggedIn,
    streak,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
    maxStreak,
  };
};

const mapDispatch = (dispatch) => {
  return {
    playNewGame() {
      dispatch(resetQuiz());
    },
    setRedirect(redirect) {
      dispatch(setPostAuthRedirect(redirect));
    },
  };
};

export default connect(mapState, mapDispatch)(EndOfStreak);
