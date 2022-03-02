import React, { Component } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { me } from "../redux/reducers/auth";
import "./App.scss";

import Sponsor from "./StaticPages/sponsor";
import Navigation from "./Navigation/Navigation";
import LandingPage from "./StaticPages/Landing";
import SignUpPage from "./Auth/SignUp/SignUpPage";
import SignInPage from "./Auth/SignIn/SignInPage";
import PasswordForgetPage from "./Auth/PasswordForget";
import HomePage from "./StaticPages/HomePage";
import ProfilePage from "./Profile/Profile";
import Footer from "./Footer";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import Leaderboard from "./Leaderboard2/Leaderboard";
import About from "./StaticPages/About";
import QuestionSubmitForm from "./QuestionSubmit/QuestionSubmitForm";
import ReviewQuestions from "./AdminDashboard/SubmittedQuestions/ReviewQuestions";
import ReviewContestedQuestions from "./AdminDashboard/ReviewContestedQuestions";
import PublicProfile from "./Profile/PublicProfile";
import PrivacyPolicy from "./StaticPages/PrivacyPolicy";
import AddToHomescreen from "./StaticPages/AddToHomescreen";
import QuizRedirect from "./QuizEngine/QuizRedirect";
import ProfileToQuizRedirect from "./QuizEngine/ProfileToQuizRedirect";
import NoMatch from "./StaticPages/NoMatch";
import PlayQuiz from "./QuizEngine/PlayQuiz";

import QuizContext from "./context/quizContext";

import * as routes from "../constants/routes";
import { setMaxScore } from "../redux/reducers/streak";
import GameHome from "./QuizEngine/GameHome";

const theme = createTheme({
  palette: {
    primary: {
      main: "#993bed",
      light: "#C790F1",
    },
    secondary: {
      main: "#000000",
    },
    default: {
      main: "#FFDF00",
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      },
    },
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      signedInUser: "",
      scoreObject: {},
      displayName: "",
      isAdmin: true,
      quizzes: {},
      scores: {},
    };
  }

  componentDidMount() {
    this.props.getMe(this.props.setLongestStreak);
  }

  // to be deprecated
  getSignedInUser = async (uid) => {
    // const userData = await db.getDisplayNames(uid);
    // userData.displayName.then((displayName) => {
    //   this.setState({
    //     signedInUser: uid,
    //     displayName,
    //   });
    // });
  };

  checkAdmin = () => {
    this.setState({
      isAdmin: true,
    });
  };

  // stores the score object for a non-signed in user
  // so that they can save their score by signing up
  storeScore = (scoreObject) => {
    this.setState({
      scoreObject,
    });
  };

  clearStateOnSignout = () => {
    this.setState({
      signedInUser: "",
      scoreObject: {},
      displayName: "",
      isAdmin: false,
    });
  };

  render() {
    if (!this.props.preCheck) return <p>Loading</p>;
    return (
      // <Router history
      //Provide quiz value to everything
      <Router>
        <MuiThemeProvider theme={theme}>
          <QuizContext.Consumer>
            {(quizContext) => (
              <Navigation
                quizContext={quizContext}
                signedInUser={this.state.signedInUser}
              />
            )}
          </QuizContext.Consumer>

          <Switch>
            <Route
              exact
              path={routes.LANDING}
              render={() =>
                this.props.isLoggedIn ? (
                  <Redirect to="/home" />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              exact
              path={routes.SIGN_UP}
              render={(props) => (
                <SignUpPage
                  {...props}
                  getSignedInUser={this.getSignedInUser}
                  scoreObject={this.state.scoreObject}
                />
              )}
            />
            <Route
              exact
              path={routes.SIGN_IN}
              render={(props) => (
                <SignInPage
                  {...props}
                  getSignedInUser={this.getSignedInUser}
                  scoreObject={this.state.scoreObject}
                  checkAdmin={this.checkAdmin}
                />
              )}
            />
            <Route exact path={"/sponsor"} render={Sponsor} />
            <Route
              exact
              path={routes.PASSWORD_FORGET}
              component={PasswordForgetPage}
            />
            <Route
              exact
              path={routes.PROFILE}
              render={(props) => (
                <ProfilePage
                  {...props}
                  signedInUser={this.state.signedInUser}
                />
              )}
            />
            <Route
              exact
              path={routes.HOME}
              render={(props) => (
                <HomePage {...props} signedInUser={this.state.signedInUser} />
              )}
            />

            {/* Admin Dashboard Routes */}
            <Route
              exact
              path={routes.CREATE_NEW_QUIZ}
              render={(props) => (
                <AdminDashboard {...props} renderPage={"Create New Quiz"} />
              )}
            />
            <Route
              exact
              path={routes.MANAGE_QUIZZES}
              render={(props) => (
                <AdminDashboard {...props} renderPage={"Manage Quizzes"} />
              )}
            />
            <Route
              exact
              path={routes.MANAGE_USERS}
              render={(props) => (
                <AdminDashboard {...props} renderPage={"Manage Users"} />
              )}
            />
            <Route
              exact
              path={routes.ADMIN_LEADERBOARD}
              render={(props) => (
                <AdminDashboard {...props} renderPage={"Leaderboard"} />
              )}
            />
            <Route
              exact
              path={routes.ADMIN_DASHBOARD}
              render={(props) => <AdminDashboard {...props} renderPage={""} />}
            />

            {/* Quiz Routes */}
            <Route exact path={routes.GAME} component={GameHome} />
            <Route exact path={routes.PLAY_GAME} component={PlayQuiz} />
            <Route exact path={routes.QUIZ_REDIRECT} component={QuizRedirect} />
            <Route
              exact
              path={routes.PROFILE_TO_QUIZ_REDIRECT}
              component={ProfileToQuizRedirect}
            />
            <Route exact path={routes.LEADERBOARD} component={Leaderboard} />
            <Route exact path={routes.ABOUT} component={About} />
            <Route
              exact
              path={routes.SUBMIT_QUESTION}
              render={(props) => (
                <QuestionSubmitForm
                  {...props}
                  signedInUser={this.state.signedInUser}
                />
              )}
            />
            <Route exact path={routes.REVIEW} component={ReviewQuestions} />
            <Route
              exact
              path={routes.CONTEST}
              component={ReviewContestedQuestions}
            />
            <Route
              exact
              path={routes.USER_PROFILES}
              render={(props) => (
                <PublicProfile
                  {...props}
                  key={window.location.pathName} // eslint-disable-line no-undef
                  signedInUser={this.state.authUser}
                  displayName={this.state.displayName}
                  isAdmin={this.state.isAdmin}
                />
              )}
            />
            <Route exact path={routes.PRIVACY} component={PrivacyPolicy} />
            <Route
              exact
              path={routes.ADD_TO_HOMESCREEN}
              component={AddToHomescreen}
            />

            <Route path="*" component={NoMatch} />
          </Switch>
          <Footer signedInUser={this.state.signedInUser} />
        </MuiThemeProvider>
      </Router>
    );
  }
}

const mapState = (state) => {
  const { auth, preCheck } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    preCheck,
    isLoggedIn,
  };
};

const mapDispatch = (dispatch) => {
  return {
    setLongestStreak(score) {
      dispatch(setMaxScore(score));
    },
    getMe(setLongestStreak) {
      dispatch(me(setLongestStreak));
    },
  };
};

export default connect(mapState, mapDispatch)(App);
