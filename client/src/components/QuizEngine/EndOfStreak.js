import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { resetQuiz } from "../../redux/reducers/streak";
import SignInForm from "../Auth/SignIn/SignInForm";
import SignInFormWithStreak from "../Auth/SignIn/SignInFormWithStreak";
import SignUpFormWithStreak from "../Auth/SignUp/SignUpFormWithStreak";
import Button from "../Button/Button";
import styles from "./EndOfStreak.module.scss";

const EndOfStreak = ({
  isLoggedIn,
  maxStreak,
  streak,
  streakLength,
  playNewGame,
}) => {
  const [showSignIn, setShowSignIn] = useState({ bool: false, type: "" });

  return (
    <div className={styles.container}>
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
          {showSignIn.bool ? (
            showSignIn.type === "signin" ? (
              <SignInFormWithStreak
                buttonCopy="Save My Score"
                streak={streak}
              />
            ) : (
              <SignUpFormWithStreak
                buttonCopy="Save My Score"
                streak={streak}
              />
            )
          ) : (
            <div className="d-flex flex-column">
              <Button
                variant="primary"
                onClick={() => setShowSignIn({ bool: true, type: "signin" })}
              >
                Sign in to save your streak
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowSignIn({ bool: true, type: "signup" })}
              >
                Sign up to save your streak
              </Button>
            </div>
          )}
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

export default connect(mapState, mapDispatch)(EndOfStreak);
