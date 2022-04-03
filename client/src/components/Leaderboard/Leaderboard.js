import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Button from "../Button/Button";
import classNames from "classnames";
import { Paper } from "@material-ui/core";
import owl from "../../images/large_icon.png";

import { Link, useHistory } from "react-router-dom";

import Marquee from "./marquee";
import styles from "./leaderboard.module.scss";
import { getAllStreaks } from "../../redux/reducers/leaderboard";

const Leaderboard = ({ allTime, auth, getStreaks, monthly, weekly }) => {
  const history = useHistory();
  const [timeframe, setTimeframe] = useState("Week");
  const [userRank, setUserRank] = useState({ rank: 0, score: 0 });

  useEffect(() => {
    getStreaks();
  }, []);

  useEffect(() => {
    let scoreList;
    if (timeframe === "Week") {
      scoreList = weekly;
    } else if (timeframe === "Month") {
      scoreList = monthly;
    } else if (timeframe === "All Time") {
      scoreList = allTime;
    }

    const userHighScore = scoreList.find((score) => score.userId === auth.id);
    setUserRank({
      rank: scoreList.indexOf(userHighScore) + 1,
      score: userHighScore?.score,
    });
  }, [weekly, monthly, allTime, timeframe]);

  const renderLeaders = () => {
    let scoreList;
    if (timeframe === "Week") {
      scoreList = weekly;
    } else if (timeframe === "Month") {
      scoreList = monthly;
    } else if (timeframe === "All Time") {
      scoreList = allTime;
    }
    return scoreList.slice(0, 10).map((d, i) => {
      return (
        <tr
          key={i}
          className={classNames(
            i + 1 === userRank.rank && styles.authUserScore,
            styles.leaderboardRow
          )}
          onClick={() => history.push(`/profile/${d.id}`)}
        >
          <td className={styles.rank}>{i + 1}</td>
          <td colSpan="2">
            <div className={styles.scoreInfo}>
              <div className={styles.name}>
                <img src={owl} alt="SmartOwl" />
                <div>
                  {d.user.firstName} {d.user.lastName[0]}.
                </div>
              </div>
              <div className={styles.score}>{d.score}</div>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className={styles.leaderboardContainer}>
      <Link
        style={{ textDecoration: "none", color: "#554E3F" }}
        to={`/sponsor`}
      >
        <Marquee />
      </Link>
      <Paper className={styles.leaderboard}>
        <div className={styles.leaderboardTabs}>
          <Button
            onClick={() => setTimeframe("Week")}
            variant={timeframe === "Week" ? "primary" : "link"}
          >
            Weekly
          </Button>
          <Button
            onClick={() => setTimeframe("Month")}
            variant={timeframe === "Month" ? "primary" : "link"}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setTimeframe("All Time")}
            variant={timeframe === "All Time" ? "primary" : "link"}
          >
            All Time
          </Button>
        </div>
        <div className={styles.individualLeaderboardContainer}>
          <h1>Individual Standings</h1>
          <table className={styles.leaderTable}>
            <thead>
              <tr>
                <td>Rank</td>
                <td>Username</td>
                <td>Longest Streak</td>
              </tr>
            </thead>
            {userRank > 10 && (
              <tr
                key={auth.id}
                className={classNames(
                  styles.authUserScore,
                  styles.leaderboardRow
                )}
                onClick={() => history.push(`/profile/${auth.id}`)}
              >
                <td className={styles.rank}>{userRank?.rank}</td>
                <td colSpan="2">
                  <div className={styles.scoreInfo}>
                    <div className={styles.name}>
                      <img src={owl} alt="SmartOwl" />
                      <div>
                        {auth.firstName} {auth.lastName[0]}.
                      </div>
                    </div>
                    <div className={styles.score}>{userRank?.score}</div>
                  </div>
                </td>
              </tr>
            )}
            <tbody>{monthly && weekly && renderLeaders(timeframe)}</tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  const { allTime, monthly, teamScores, weekly } = state.leaderboard;
  return {
    allTime,
    auth,
    monthly,
    teamScores,
    weekly,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getStreaks() {
      dispatch(getAllStreaks());
    },
  };
};

export default connect(mapState, mapDispatch)(Leaderboard);
