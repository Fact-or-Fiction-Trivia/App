import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./EndOfStreak.module.scss";

const EndOfStreak = ({ auth, longestStreak, resetQuiz, streakTotal }) => {
  console.log(auth, "the user");

  useEffect(() => {
    // something
  }, [streakTotal]);

  return (
    <div className={styles.container}>
      <p>Final Streak</p>
      <h1 className={styles.streak}>{streakTotal}</h1>

      {longestStreak > 0 && <div>Your record: {longestStreak}</div>}
      {auth.loggedIn ? (
        <div>
          <Button variant="primary" onClick={resetQuiz}>
            Play Again
          </Button>
          <Link to="/leaderboard">
            <Button variant="white">View Leaderboard</Button>
          </Link>
        </div>
      ) : (
        <div>
          <div>sign in to save your streak</div>
          <span>-- OR --</span>
          <Button variant="primary" onClick={resetQuiz}>
            Skip and play again
          </Button>
        </div>
      )}
    </div>
  );
};

const mapState = (state) => {
  const { auth } = state;
  return {
    auth,
  };
};

export default connect(mapState)(EndOfStreak);
