// TODO: REMOVE THIS and just use user scoreboard instead

import React from "react";

import UserScoreboard from "../UserScoreboard";
import { connect } from "react-redux";

const StatsPage = ({ auth }) => {
  return (
    <>
      <UserScoreboard uid={auth.id} />
    </>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  return {
    auth,
  };
};

const mapDispatch = (dispatch) => {
  return {};
};

export default connect(mapState, mapDispatch)(StatsPage);
