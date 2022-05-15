import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import LoadingGif from "../../6.gif";
import "../../css/customStyles.css";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";

import UserScoreboard from "./UserScoreboard";

import "./profile.scss";
import { fetchProfile } from "../../redux/reducers/profile";

const PublicProfile = (props) => {
  const { userId } = props.match.params;
  useEffect(() => {
    props.getProfile(userId);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  let content = (
    <center style={{ marginTop: "100px" }}>
      <img src={LoadingGif} alt="loading" style={{ maxWidth: "100%" }} />
    </center>
  );

  if (!!props.profile.id) {
    content = (
      <div>
        <Helmet>
          <title>{props.profile.username} Profile | Fact or Fiction</title>
        </Helmet>
        <div className="public-profile">
          <div className="public-profile-top">
            <h1 className="displayNameBox">{props.profile.username}</h1>

            {props.profile.id === props.signedInUserId ? ( // user is on their own profile
              <NavLink
                style={{ textDecoration: "none", color: "white" }}
                to="/profile"
              >
                <button className="customButton">Edit My Profile</button>
              </NavLink>
            ) : null}
          </div>

          <center>
            <div className="bioContainer">
              <p className="bio">{props.profile.bio}</p>
            </div>
          </center>

          <UserScoreboard profileId={userId} />
        </div>
      </div>
    );
  }
  return <Paper className="profile"> {content} </Paper>;
};
const mapState = (state) => {
  const { auth } = state.auth;
  const { profile } = state.profile;
  return {
    isLoggedIn: !!auth.id,
    isAdmin: auth.role === "Admin",
    signedInUserId: auth.id,
    profile,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProfile(userId) {
      dispatch(fetchProfile(userId));
    },
  };
};

export default connect(mapState, mapDispatch)(PublicProfile);
