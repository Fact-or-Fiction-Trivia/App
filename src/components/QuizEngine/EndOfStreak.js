import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { resetQuiz } from "../../redux/reducers/streak";
import SignInForm from "../Auth/SignIn/SignInForm";
import Button from "../Button/Button";
import styles from "./EndOfStreak.module.scss";

const EndOfStreak = ({
  addStreak,
  isLoggedIn,
  longestStreak,
  streak,
  streakTotal,
  playNewGame,
}) => {
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    // something
  }, [streakTotal]);

  const saveStreakOnLogin = () => addStreak(streak);

  return (
    <div className={styles.container}>
      <p>Final Streak</p>
      <h1 className={styles.streak}>{streakTotal}</h1>

      {longestStreak > 0 && <div>Your record: {longestStreak}</div>}
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
          {showSignIn ? (
            <SignInForm
              buttonCopy="Save My Score"
              callback={saveStreakOnLogin}
            />
          ) : (
            <Button variant="primary" onClick={() => setShowSignIn(true)}>
              Sign in to save your streak
            </Button>
          )}
          <div className={styles.horizontalRule}>
            <span>or</span>
          </div>
          <Button
            className={styles.skipButton}
            variant="white"
            onClick={resetQuiz}
          >
            Skip and play again
          </Button>
        </div>
      )}
    </div>
  );
};

const mapDispatch = (dispatch) => {
  return {
    playNewGame() {
      dispatch(resetQuiz());
    },
  };
};

const mapState = (state) => {
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    isLoggedIn,
  };
};

export default connect(mapState, mapDispatch)(EndOfStreak);
