import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import { PLAY_GAME } from "../../constants/routes";
import owl from "../../images/large_icon.png";
import styles from "./GameHome.module.scss";
import { resetQuiz } from "../../redux/reducers/streak";

const GameHome = ({ maxStreak, reset }) => {
  const history = useHistory();

  const listener = () => {
    setTimeout(() => {
      history.push(PLAY_GAME);
    }, [500]);
  };

  useEffect(() => {
    const element = document.getElementsByClassName(styles.countdown__text)[0];
    element.addEventListener("animationend", listener, false);
    reset();
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <Paper className={styles.container}>
      <h1>Ready to beat your high streak of {maxStreak || 0}?</h1>
      <div className={styles.animationContainer}>
        <img className={styles.owl} alt="Fact or Fiction Owl" src={owl} />
        <div className={styles.countdown}>
          <div className={styles.countdown__text}>Play</div>
          <div className={styles.countdown__inner}>
            <svg className={styles.countdown__numbers} viewBox="0 0 100 100">
              <defs>
                <path
                  className={styles.countdown__num_path_1}
                  d="M40,28 55,22 55,78"
                />
                <path
                  className={styles.countdown__num_join_1_2}
                  d="M55,78 55,83 a17,17 0 1,0 34,0 a20,10 0 0,0 -20,-10"
                />
                <path
                  className={styles.countdown__num_path_2}
                  d="M69,73 l-35,0 l30,-30 a16,16 0 0,0 -22.6,-22.6 l-7,7"
                />
                <path
                  className={styles.countdown__num_join_2_3}
                  d="M28,69 Q25,44 34.4,27.4"
                />
                <path
                  className={styles.countdown__num_path_3}
                  d="M30,20 60,20 40,50 a18,15 0 1,1 -12,19"
                />
              </defs>
              <path
                className={styles.countdown__numbers_path}
                d="M-10,20 60,20 40,50 a18,15 0 1,1 -12,19
               Q25,44 34.4,27.4
               l7,-7 a16,16 0 0,1 22.6,22.6 l-30,30 l35,0 L69,73
               a20,10 0 0,1 20,10 a17,17 0 0,1 -34,0 L55,83
               l0,-61 L40,28"
              />
            </svg>
          </div>
        </div>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const { maxStreak } = state.streak;
  return {
    maxStreak,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reset() {
      dispatch(resetQuiz());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);
