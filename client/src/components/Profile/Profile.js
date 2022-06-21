import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";

import Drawer from "./Drawer";
import SecuritySettings from "./SecuritySettings";
import GameSettings from "./GameSettings";
import EditProfilePage from "./EditProfile/EditProfilePage";
import "./profile.scss";
import UserScoreboard from "./UserScoreboard";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEditProfile: true,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showPasswordReset: false,
      showNotifications: false,
      showGameSettings: false,
    };
  }

  toggleEditProfile = () => {
    this.setState({
      showEditProfile: true,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showGameSettings: false,
    });
  };

  toggleShowStats = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: true,
      showNotificationSettings: false,
      showSecurity: false,
      showGameSettings: false,
    });
  };

  toggleShowSecurity = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: true,
      showGameSettings: false,
    });
  };

  toggleGameSettings = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: false,
      showSecurity: false,
      showGameSettings: true,
    });
  };

  toPublicProfile = (uid) => {
    this.props.history.push(`/profile/${uid}`);
  };

  render() {
    return (
      <Paper className="profile settings-page">
        <Helmet>
          <title>Settings | Fact or Fiction</title>
        </Helmet>
        <Drawer
          toggleEditProfile={this.toggleEditProfile}
          toggleShowStats={this.toggleShowStats}
          toggleShowNotifications={this.toggleShowNotifications}
          toggleShowSecurity={this.toggleShowSecurity}
          toggleGameSettings={this.toggleGameSettings}
        />

        {this.state.showEditProfile ? (
          <EditProfilePage toPublicProfile={this.toPublicProfile} />
        ) : null}
        {this.state.showStatsPage ? (
          <UserScoreboard profileId={this.props.auth.id} />
        ) : null}
        {this.state.showGameSettings ? <GameSettings /> : null}
        {this.state.showSecurity ? <SecuritySettings /> : null}
      </Paper>
    );
  }
}

const mapState = (state) => {
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    auth,
    isLoggedIn,
  };
};

const mapDispatch = (dispatch) => {
  return {};
};

export default connect(mapState, mapDispatch)(ProfilePage);
