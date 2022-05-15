import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getTodaysHighestStreak } from "../../redux/reducers/leaderboard";
import "./marquee.scss";

const Marquee = ({ getMarqueeValues, todaysHighestStreak }) => {
  useEffect(() => {
    if (!todaysHighestStreak) {
      getMarqueeValues();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="marquee">
      <span>
        {todaysHighestStreak ? (
          <h2 id="marquee-text">
            Play now to claim the top spot on the leaderboards. Today’s leader
            with the longest streak is: {todaysHighestStreak.user.username} with{" "}
            {todaysHighestStreak.score} correct in a row!
          </h2>
        ) : (
          <h2 id="marquee-text">
            Play now to claim the top spot on the leaderboard!
          </h2>
        )}
      </span>
    </div>
  );
};

const mapState = (state) => {
  const { todaysHighestStreak } = state.leaderboard;
  return {
    todaysHighestStreak,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMarqueeValues() {
      dispatch(getTodaysHighestStreak());
    },
  };
};

export default connect(mapState, mapDispatch)(Marquee);
