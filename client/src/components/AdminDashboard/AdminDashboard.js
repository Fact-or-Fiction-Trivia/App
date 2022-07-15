import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect, Switch, Route } from "react-router-dom";
import MediaQuery from "react-responsive";
import Helmet from "react-helmet";

import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { LEADERBOARD, LANDING, ADMIN_DASHBOARD } from "../../constants/routes";

import AdminQuestions from "./AdminQuestions";
import AdminQuestion from "./AdminQuestion";
import Scoreboard from "../Leaderboard/Scoreboard";
import UserShow from "./UserShow/UserShow";
import PartyLeaders from "../Leaderboard/PartyLeaders";
import QuestionsToReview from "./SubmittedQuestions/QuestionsToReview";

import AdminCreateQuestion from "./AdminCreateQuestion";
import ReviewQuestions from "./SubmittedQuestions/ReviewQuestions";
import ReviewContestedQuestions from "./ReviewContestedQuestions";
import ContestedQuestions from "./ContestedQuestions";

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingQuiz: false,
      editingQuiz: false,
      showDash: false,
      showQuiz: false,
      showUsers: false,
      showLeaders: false,
      managingQuizzes: false,
      manageCashOut: true,
      dateArray: [],
      titleArray: [],
      value: 0,
      selectedQuizId: "",
      selectedQuiz: {},
      showDeleteModal: false,
      cashoutData: {},
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    if (this.props.precheck && !this.props.isAdmin) {
      return <Redirect to={LANDING} />;
    }
    const { value } = this.state;

    return (
      <div>
        <Helmet>
          <title>Admin Dashboard | Fact or Fiction</title>
        </Helmet>
        <MediaQuery minWidth={415}>
          <AppBar position="static" color="default">
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={this.handleChange}
              style={{ marginTop: "8.5vh" }}
            >
              <Tab
                label="Dashboard"
                onClick={() => this.props.history.push(ADMIN_DASHBOARD)}
              />
              <Tab
                label="Create New Question"
                onClick={() =>
                  this.props.history.push(`${ADMIN_DASHBOARD}/create-question`)
                }
              />
              <Tab
                label="Manage Questions"
                onClick={() =>
                  this.props.history.push(`${ADMIN_DASHBOARD}/manage-questions`)
                }
              />
              <Tab
                label="Manage Users"
                onClick={() =>
                  this.props.history.push(`${ADMIN_DASHBOARD}/manage-users`)
                }
              />
              <Tab
                label="Leaders"
                onClick={() =>
                  this.props.history.push(`${ADMIN_DASHBOARD}/manage-leaders`)
                }
              />
            </Tabs>
          </AppBar>
        </MediaQuery>
        <Switch>
          <Route
            exact
            path={ADMIN_DASHBOARD}
            render={(props) => (
              <div className="dashboard">
                <Paper className="dashContainer"></Paper>
                <div className="dashContainer2">
                  <Link to={LEADERBOARD} style={{ textDecoration: "none" }}>
                    <Scoreboard />
                  </Link>
                  <QuestionsToReview />
                  <ContestedQuestions />
                </div>
              </div>
            )}
          />
          <Route
            path={`${ADMIN_DASHBOARD}/create-question`}
            render={(props) => <AdminCreateQuestion {...props} />}
          />
          <Route
            exact
            path={`${ADMIN_DASHBOARD}/manage-questions`}
            render={(props) => <AdminQuestions {...props} />}
          />

          <Route
            path={`${ADMIN_DASHBOARD}/manage-questions/:questionId`}
            render={(props) => <AdminQuestion {...props} />}
          />
          <Route
            path={`${ADMIN_DASHBOARD}/review-submitted-questions`}
            render={(props) => <ReviewQuestions {...props} />}
          />
          <Route
            path={`${ADMIN_DASHBOARD}/review-contested-questions`}
            render={(props) => <ReviewContestedQuestions {...props} />}
          />

          <Route
            path={`${ADMIN_DASHBOARD}/manage-users`}
            render={(props) => <div>TODO: Manage Users</div>}
          />
          <Route
            path={`${ADMIN_DASHBOARD}/manage-leaders`}
            render={(props) => <div>TODO: Manage Leaders</div>}
          />
        </Switch>

        <div>
          <div>
            <div>
              <div>
                {this.state.showUsers ? (
                  <UserShow />
                ) : (
                  <div>{this.state.showLeaders && <PartyLeaders />}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, precheck } = state.auth;
  return {
    isAdmin: auth.role === "Admin",
    precheck,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
