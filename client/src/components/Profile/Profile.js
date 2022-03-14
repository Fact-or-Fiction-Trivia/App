import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";

import Drawer from "./Drawer";
import StatsPage from "./StatsPage";
import NotificationSettingsPage from "./NotificationSettings/NotificationSettingsPage";
import SecuritySettings from "./SecuritySettings";
import GameSettings from "./GameSettings";
import EditProfilePage from "./EditProfile/EditProfilePage";
import "./profile.css";
import { SIGN_IN } from "../../constants/routes";

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

  toggleShowNotifications = () => {
    this.setState({
      showEditProfile: false,
      showStatsPage: false,
      showNotificationSettings: true,
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
    if (!this.props.isLoggedIn) {
      this.props.history.push(SIGN_IN);
    }
    return (
      <Paper className="profile settings-page">
        <Helmet>
          <title>Settings | politIQ trivia</title>
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
        {this.state.showStatsPage ? <StatsPage /> : null}
        {this.state.showNotificationSettings ? (
          <NotificationSettingsPage />
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
