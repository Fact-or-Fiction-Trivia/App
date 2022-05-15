import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Button from "../Button/Button";
import classNames from "classnames";
import { Paper } from "@material-ui/core";
import Republicans from "./LeaderboardGraphics/republicans.svg";
import RepublicansLead from "./LeaderboardGraphics/republicansLead.svg";
import Democrats from "./LeaderboardGraphics/democrats.svg";
import DemocratsLead from "./LeaderboardGraphics/democratsLead.svg";
import Independents from "./LeaderboardGraphics/independents.svg";
import IndependentsLead from "./LeaderboardGraphics/independentsLead.svg";
import { GAME } from "../../constants/routes";
import owl from "../../images/large_icon.png";

import { Link, useHistory } from "react-router-dom";

import Marquee from "./marquee";
import styles from "./leaderboard.module.scss";
import { getAllStreaks } from "../../redux/reducers/leaderboard";

const Leaderboard = ({
  allTime,
  auth,
  getStreaks,
  monthly,
  teamScores,
  weekly,
}) => {
  const history = useHistory();
  const [timeframe, setTimeframe] = useState("weekly");
  const [userRank, setUserRank] = useState({ rank: 0, score: 0 });
  const [teamStandings, setTeamStandings] = useState([
    ["Republicans", 0],
    ["Independents", 0],
    ["Democrats", 0],
  ]);

  useEffect(() => {
    getStreaks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (auth.id) {
      let scoreList;
      if (timeframe === "weekly") {
        scoreList = weekly;
      } else if (timeframe === "monthly") {
        scoreList = monthly;
      } else if (timeframe === "allTime") {
        scoreList = allTime;
      }

      const userHighScore = scoreList.find((score) => score.userId === auth.id);

      setUserRank({
        rank: scoreList.indexOf(userHighScore) + 1,
        score: userHighScore?.score,
      });
    }

    sortTeamStandings();
  }, [weekly, monthly, allTime, teamScores, timeframe]); // eslint-disable-line react-hooks/exhaustive-deps

  const sortTeamStandings = () => {
    if (teamScores === undefined) return;
    const timeScores = teamScores[timeframe];

    let entries = Object.entries(timeScores);
    entries.sort((a, b) => b[1] - a[1]);

    const formattedEntries = [];
    entries.forEach((entry) => {
      formattedEntries.push([formatTeamName(entry[0]), entry[1]]);
    });

    setTeamStandings(formattedEntries);
  };

  const renderLeaders = () => {
    let scoreList;
    if (timeframe === "weekly") {
      scoreList = weekly;
    } else if (timeframe === "monthly") {
      scoreList = monthly;
    } else if (timeframe === "allTime") {
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
                <div>{d.user.username}</div>
              </div>
              <div className={styles.score}>{d.score}</div>
            </div>
          </td>
        </tr>
      );
    });
  };

  const formatTeamName = (name) => {
    return `${name[0].toUpperCase() + name.slice(1)}s`;
  };

  const firstPlaceTeam = teamStandings[0][0];
  const secondPlaceTeam = teamStandings[1][0];
  const thirdPlaceTeam = teamStandings[2][0];

  const getTeamImage = (team, place) => {
    let img;
    switch (team) {
      case "Republicans":
        if (place === "1st") {
          img = (
            <img
              src={RepublicansLead}
              alt={`Republicans take ${place} and wear the crown`}
            />
          );
        } else {
          img = <img src={Republicans} alt={`Republicans take ${place}`} />;
        }
        break;
      case "Independents":
        if (place === "1st") {
          img = (
            <img
              src={IndependentsLead}
              alt={`Independents take ${place} and wear the crown`}
            />
          );
        } else {
          img = <img src={Independents} alt={`Independents take ${place}`} />;
        }
        break;
      case "Democrats":
        if (place === "1st") {
          img = (
            <img
              src={DemocratsLead}
              alt={`Democratstake ${place} and wear the crown`}
            />
          );
        } else {
          img = <img src={Democrats} alt={`Democrats take ${place}`} />;
        }
        break;
      default:
        img = null;
    }

    return img;
  };
  return (
    <div className={styles.leaderboardContainer}>
      <Link style={{ textDecoration: "none", color: "#554E3F" }} to={`/game`}>
        <Marquee />
      </Link>
      <Paper className={styles.leaderboard}>
        <div className={styles.leaderboardTabs}>
          <Button
            onClick={() => setTimeframe("weekly")}
            variant={timeframe === "weekly" ? "primary" : "link"}
          >
            Weekly
          </Button>
          <Button
            onClick={() => setTimeframe("monthly")}
            variant={timeframe === "monthly" ? "primary" : "link"}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setTimeframe("allTime")}
            variant={timeframe === "allTime" ? "primary" : "link"}
          >
            All Time
          </Button>
        </div>
        <div className={styles.teamLeaderboardContainer}>
          <h1>Team Standings</h1>
          <div className={styles.teamLeaderboard}>
            <div className={styles.podium}>
              <div>
                {getTeamImage(secondPlaceTeam, "2nd")}
                <span className={styles.whiteGlow}>2</span>
              </div>
              <div>
                {getTeamImage(firstPlaceTeam, "1st")}
                <span className={styles.whiteGlow}>1</span>
              </div>
              <div>
                {getTeamImage(thirdPlaceTeam, "3rd")}
                <span className={styles.whiteGlow}>3</span>
              </div>
            </div>
            <h2>{firstPlaceTeam} in the lead!</h2>
            <h3>Average Streak Scores:</h3>
            {teamStandings.map((party) => (
              <p key={party}>
                {party[0]}: {party[1]}
              </p>
            ))}
          </div>
        </div>
        <div className={styles.individualLeaderboardContainer}>
          <h1>Individual Standings</h1>
          {(timeframe === "monthly" && monthly.length > 0) ||
          (timeframe === "weekly" && weekly.length > 0) ||
          (timeframe === "allTime" && allTime.length > 0) ? (
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
                        <div>{auth.username}</div>
                      </div>
                      <div className={styles.score}>{userRank?.score}</div>
                    </div>
                  </td>
                </tr>
              )}
              <tbody>{renderLeaders(timeframe)}</tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <h2 className={styles.whiteGlow}>
                No scores yet for this time period!
              </h2>
              <Link to={GAME}>
                <Button variant="primary">Play now to add your score</Button>
              </Link>
            </div>
          )}
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
