import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { resetQuiz } from "../../redux/reducers/streak";
import { setPostAuthRedirect } from "../../redux/reducers/auth";
import Button from "../Button/Button";
import owl from "../../images/large_icon.png";
import InGameAds from "./InGameAds";
import styles from "./EndOfStreak.module.scss";
import { SIGN_IN, SUBMIT_QUESTION, GAME } from "../../constants/routes";
import confetti from "canvas-confetti";
import SocialShare from "../SocialShare/SocialShare";

const EndOfStreak = ({
  isLoggedIn,
  maxStreak,
  midAuthentication,
  setRedirect,
  streakLength,
  playNewGame,
}) => {
  const [serveAd, setServeAd] = useState(true);
  const history = useHistory();
  const beatPreviousScore = parseInt(streakLength) > parseInt(maxStreak);
  const returningFromAuth =
    midAuthentication && parseInt(streakLength) === parseInt(maxStreak);

  const duration = 3 * 1000;
  let animationEnd = Date.now() + duration;
  let skew = 1;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  beatPreviousScore &&
    (function frame() {
      var timeLeft = animationEnd - Date.now();
      var ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          // since particles fall down, skew start toward the top
          y: Math.random() * skew - 0.2,
        },
        colors: ["#ffc300"],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })();

  return (
    <div className={styles.container}>
      {serveAd ? (
        <InGameAds onCloseAd={() => setServeAd(false)} />
      ) : (
        <div>
          <h1 className={styles.header}>Your final streak:</h1>
          <div className={styles.streakContainer}>
            <img src={owl} alt="Fact or Fiction Owl" />
            <h2 className={styles.streak}>{streakLength}</h2>
          </div>
          {returningFromAuth || beatPreviousScore ? (
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
          <div className={styles.buttonContainer}>
            <Link to="/leaderboard">
              <Button variant="primary">Leaderboard</Button>
            </Link>
            {isLoggedIn ? (
              <Link to={SUBMIT_QUESTION}>
                <Button variant="primary">Submit a Question</Button>
              </Link>
            ) : (
              <Link to={SIGN_IN} onClick={() => setRedirect("/game/play")}>
                <Button variant="black">Save Score</Button>
              </Link>
            )}
            <Button
              className={styles.skipButton}
              variant={isLoggedIn ? "black" : "primary"}
              onClick={() => {
                playNewGame();
                history.push(GAME);
              }}
            >
              Play again
            </Button>
          </div>
          <div className={styles.socialContainer}>
            <h3 className={styles.socialMediaHeading}>Share your streak</h3>
            <SocialShare color="black" shouldShowInstagram={true} />
          </div>
        </div>
      )}
    </div>
  );
};

const mapState = (state) => {
  const { streak, maxStreak, midAuthentication } = state.streak;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    isLoggedIn,
    maxStreak,
    midAuthentication,
    streak,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
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
