import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { me } from "../redux/reducers/auth";

import "./App.scss";

import Sponsor from "./StaticPages/sponsor";
import Navigation from "./Navigation/Navigation";
import LandingPage from "./StaticPages/Landing";
import ProfilePage from "./Profile/Profile";
import Footer from "./Footer";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import Leaderboard from "./Leaderboard/Leaderboard";
import About from "./StaticPages/About";
import QuestionSubmitForm from "./QuestionSubmit/QuestionSubmitForm";
import ReviewQuestions from "./AdminDashboard/SubmittedQuestions/ReviewQuestions";
import ReviewContestedQuestions from "./AdminDashboard/ReviewContestedQuestions";
import PublicProfile from "./Profile/PublicProfile";
import PrivacyPolicy from "./StaticPages/PrivacyPolicy";
import AddToHomescreen from "./StaticPages/AddToHomescreen";
import NoMatch from "./StaticPages/NoMatch";
import PlayQuiz from "./QuizEngine/PlayQuiz";
import ContestAQuestion from "./QuizEngine/ContestAQuestion";

import * as routes from "../constants/routes";
import { setMaxScore } from "../redux/reducers/streak";
import GameHome from "./QuizEngine/GameHome";
import SignInFormWithStreak from "./Auth/SignIn/SignInFormWithStreak";
import SignUpFormWithStreak from "./Auth/SignUp/SignUpFormWithStreak";
import RequestForgotPassword from "./Auth/ForgotPassword/RequestForgotPassword";
import ForgotPassword from "./Auth/ForgotPassword/ForgotPassword";
import AdminQuestions from "./AdminDashboard/AdminQuestions";
import AdminQuestion from "./AdminDashboard/AdminQuestion";

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
  typography: {
    fontFamily: ["Quicksand"],
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      },
    },
  },
});

const App = ({ getMe, isLoggedIn, setLongestStreak }) => {
  const history = useHistory();
  useEffect(() => {
    if (!isLoggedIn) {
      getMe(setLongestStreak);
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Router>
      <MuiThemeProvider theme={theme}>
        <Navigation history={history} />

        <Switch>
          <Route exact path={routes.LANDING} render={() => <LandingPage />} />
          <Route
            exact
            path={routes.SIGN_UP}
            render={() => <SignUpFormWithStreak />}
          />
          <Route
            exact
            path={routes.SIGN_IN}
            render={() => <SignInFormWithStreak />}
          />
          <Route exact path={"/sponsor"} render={Sponsor} />
          <Route
            exact
            path={routes.REQUEST_FORGOT_PASSWORD}
            component={RequestForgotPassword}
          />
          <Route
            exact
            path={routes.FORGOT_PASSWORD}
            component={ForgotPassword}
          />
          <Route
            exact
            path={routes.PROFILE}
            render={(props) => <ProfilePage {...props} />}
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
            path={routes.ADMIN_DASHBOARD}
            render={(props) => <AdminDashboard {...props} />}
          />
          <Route
            exact
            path={routes.ADMIN_QUESTIONS}
            render={(props) => <AdminQuestions {...props} />}
          />
          <Route
            exact
            path={`${routes.ADMIN_QUESTIONS}/:questionId`}
            render={(props) => <AdminQuestion {...props} />}
          />
          {/* Quiz Routes */}
          <Route exact path={routes.GAME} component={GameHome} />
          <Route exact path={routes.PLAY_GAME} component={PlayQuiz} />
          <Route exact path={routes.CONTEST} component={ContestAQuestion} />
          <Route exact path={routes.LEADERBOARD} component={Leaderboard} />
          <Route exact path={routes.ABOUT} component={About} />
          <Route
            exact
            path={routes.SUBMIT_QUESTION}
            render={(props) => <QuestionSubmitForm {...props} />}
          />
          <Route exact path={routes.REVIEW} component={ReviewQuestions} />
          <Route
            exact
            path={routes.REVIEW_CONTEST}
            component={ReviewContestedQuestions}
          />
          <Route
            exact
            path={routes.USER_PROFILES}
            render={(props) => (
              <PublicProfile
                {...props}
                key={window.location.pathName} // eslint-disable-line no-undef
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
        <Footer />
      </MuiThemeProvider>
    </Router>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
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
