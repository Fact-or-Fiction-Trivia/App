import React from "react";
import { connect } from "react-redux";
import "./marquee.scss";

const Marquee = ({ allTime, monthly, weekly }) => {
  const allTimeHighest = allTime[0];
  const monthHighest = monthly[0];
  const weekHighest = weekly[0];
  return (
    <div className="marquee">
      <span>
        {weekHighest ? (
          <h2 id="marquee-text">
            Highest streak this week: {weekHighest.firstName}{" "}
            {weekHighest.lastName[0]} with {weekHighest.score} correct in a row!
          </h2>
        ) : (
          <h2 id="marquee-text">
            Play now to claim the top spot on this week's leaderboard!
          </h2>
        )}
        {monthHighest ? (
          <h2 id="marquee-text2">
            Highest streak this week: {weekHighest.firstName}{" "}
            {weekHighest.lastName[0]} with {weekHighest.score} correct in a row!
          </h2>
        ) : (
          <h2 id="marquee-text2">
            Play now to claim the top spot on this month's leaderboard!
          </h2>
        )}
        {allTimeHighest ? (
          <h2 id="marquee-text3">
            All time highest streak: {allTimeHighest.user.firstName}{" "}
            {allTimeHighest.user.lastName[0]} with {allTimeHighest.score}{" "}
            correct in a row!
          </h2>
        ) : (
          <h2 id="marquee-text3">
            Play now to claim the top spot on the all time leaderboard!
          </h2>
        )}
      </span>
    </div>
  );
};

const mapState = (state) => {
  const { allTime, monthly, weekly } = state.leaderboard;
  return {
    allTime,
    monthly,
    weekly,
  };
};

export default connect(mapState)(Marquee);
