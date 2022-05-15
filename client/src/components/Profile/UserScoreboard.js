import React, { useEffect } from "react";

import { connect } from "react-redux";
import { getAllStreaksForUser } from "../../redux/reducers/profile";

const UserScoreboard = ({ auth, profile, profileId, getScores, scores }) => {
  // TODO: make this compatible with profile ids as well, since this will not work on the public profile page
  useEffect(() => {
    if (!scores.allTime && auth.id) {
      getScores(auth.id);
    }
  }, [auth.id]); // eslint-disable-line react-hooks/exhaustive-deps

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
        {auth.id === profileId ? "My" : `${profile.username}'s`} Longest Streaks
      </h2>
      <div className="small-scoreboard">
        <div className="userScore">
          Weekly
          <span className="s reg-score">{scores?.week}</span>
        </div>
        <div className="userScore">
          Monthly
          <span className="s reg-score">{scores?.month}</span>
        </div>
        <div className="userScore">
          All Time
          <span className="s reg-score">{scores?.allTime}</span>
        </div>
      </div>
    </div>
  );

  return <div>{content}</div>;
};

const mapState = (state) => {
  const { auth } = state.auth;
  const profile = state.profile;
  const isLoggedIn = !!auth.id;
  return {
    auth,
    isLoggedIn,
    profile: profile.profile,
    scores: profile.scores,
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
