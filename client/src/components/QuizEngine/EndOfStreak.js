import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { resetQuiz } from "../../redux/reducers/streak";
import { setPostAuthRedirect } from "../../redux/reducers/auth";
import Button from "../Button/Button";
import owl from "../../images/large_icon.png";
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
        <div>
          <h1 className={styles.header}>Your final streak:</h1>
          <div className={styles.streakContainer}>
            <img src={owl} alt="Fact or Fiction Owl" />
            <h2 className={styles.streak}>{streakLength}</h2>
          </div>
          {maxStreak > 0 && streakLength > maxStreak ? (
            <p className={styles.streakMessage}>
              <span className={styles.green}>Congratulations</span> on your new
              high score!
            </p>
          ) : (
            <>
              {maxStreak > 0 && (
                <p className={styles.streakMessage}>
                  <span className={styles.red}>Sorry,</span> you did not beat
                  your high score of {maxStreak}.
                </p>
              )}
            </>
          )}

          {/* <h3 className={styles.socialMediaHeading}>Share on social media</h3> */}

          <div className={styles.buttonContainer}>
            <Link to="/leaderboard">
              <Button variant="primary">Leaderboard</Button>
            </Link>
            {!isLoggedIn && (
              <Link to={SIGN_IN} onClick={() => setRedirect("/game/play")}>
                <Button variant="black">Save Score</Button>
              </Link>
            )}
            <Button
              className={styles.skipButton}
              variant="primary"
              onClick={playNewGame}
            >
              Play again
            </Button>
          </div>
        </div>
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
