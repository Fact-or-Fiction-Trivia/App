import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import Button from "../../components/Button/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import UserScoreboard from "./UserScoreboard";

import "./profile.scss";
import { fetchProfile } from "../../redux/reducers/profile";

const PublicProfile = ({ getProfile, profile, match, signedInUserId }) => {
  const { userId } = match.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile(userId);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (profile.id) {
      setLoading(false);
    }
  }, [profile]);

  if (loading) {
    return null;
  }

  return (
    <Paper className="profile">
      <div>
        <Helmet>
          <title>{profile.username} Profile | Fact or Fiction</title>
        </Helmet>
        <div className="public-profile">
          <div className="public-profile-top">
            <h1 className="displayNameBox">{profile.username}</h1>

            {profile.id === signedInUserId ? ( // user is on their own profile
              <NavLink
                style={{ textDecoration: "none", color: "white" }}
                to="/profile"
              >
                <Button>
                  <SettingsIcon />
                  <span>Edit My Profile</span>
                </Button>
              </NavLink>
            ) : null}
          </div>

          <center>
            <div className="bioContainer">
              <p className="bio">{profile.bio}</p>
            </div>
          </center>

          <UserScoreboard profileId={userId} />
        </div>
      </div>
    </Paper>
  );
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
