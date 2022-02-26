import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PLAY_GAME } from "../../constants/routes";

const GameHome = (props) => {
  return (
    <div style={{ paddingTop: 66 }}>
      <h1>Are You ready to rumbled?</h1>
      <Link to={PLAY_GAME}>Play the Game</Link>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);
