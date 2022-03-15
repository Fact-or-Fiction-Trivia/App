import React from "react";

import LoadingGif from "../../6.gif";
import { connect } from "react-redux";
import { getAllStreaksForUser } from "../../redux/reducers/profile";

const UserScoreboard = ({ auth, getScores, streak }) => {
  getScores(auth.id);
  const loadingGif = (
    <center style={{ height: "150px" }}>
      <img src={LoadingGif} alt="loading" style={{ maxWidth: "100%" }} />
    </center>
  );

  // const [usersMoney, usersMoneyEarned, loadingMoneyWon] = useGetMoneyEarned(
  //   props.uid
  // ); // use a hook to get user scores and data into a data frame
  // const [contestedScore, loadingContestedScore] = useGetContestedQScore(
  //   props.uid
  // ); // use a hook to get user scores and data into a data frame
  // const [submittedScore, loadingSubmittedScore] = useGetSubmittedQScore(
  //   props.uid
  // ); // use a hook to get user scores and data into a data frame

  let content = (
    <div
      className="small-scoreboardHolder user-scoreboard-public"
      style={{
        justifyContent: "center",
        height: "auto",
        padding: "20px 20px 20px 18px",
      }}
    >
      <h2>
        {/* TODO: fix this */}
        {/* {authUser.uid === props.uid
              ? "My Scores" /// if authuser then "my" else find  user page displayname
              : "Scores"} */}
        My Longest Streaks
      </h2>
      <div className="small-scoreboard">
        <div className="userScore">
          Weekly
          <span className="s reg-score">0</span>
          {/* <span className="s reg-score">
                  {weeklyScores &&
                    weeklyScores &&
                    weeklyScores.filter((scoreObject) => {
                      return scoreObject.uid === props.uid;
                    })[0].weeklyScore}
                </span> */}
        </div>
        <div className="userScore">
          Monthly
          <span className="s reg-score">0</span>
          {/* <span className="s reg-score">
                  {monthlyScores && monthlyScores.filter(scoreObject => {
                    return (scoreObject.uid === props.uid)
                  })[0].monthlyScore}
                </span> */}
        </div>
        <div className="userScore">
          All Time
          <span className="s reg-score">{streak.maxStreak}</span>
        </div>
      </div>
    </div>
  );

  return <div>{content}</div>;
};

const mapState = (state) => {
  const { auth } = state.auth;
  const { streak } = state;
  const isLoggedIn = !!auth.id;
  return {
    auth,
    isLoggedIn,
    streak,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getScores(id) {
      dispatch(getAllStreaksForUser(id));
    },
  };
};

export default connect(mapState, mapDispatch)(UserScoreboard);
