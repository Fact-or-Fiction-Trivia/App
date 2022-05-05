import React, { useState } from "react";
import { connect } from "react-redux";
import { authenticateWithStreak } from "../../../redux/reducers/auth";
import { Redirect, Link } from "react-router-dom";
// UI
import Helmet from "react-helmet";

import { Paper } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "../Auth.scss";
import { setMaxScore, setMidAuth } from "../../../redux/reducers/streak";
import {
  LANDING,
  SIGN_UP,
  REQUEST_FORGOT_PASSWORD,
} from "../../../constants/routes";

const SignInFormWithStreak = ({
  authMessage,
  authenticateUser,
  buttonCopy = "Sign In",
  postAuthRedirect,
  streak,
  isLoggedIn,
}) => {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const isInvalid = formData.password === "" || formData.email === "";
  // Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // pass the streak object in here - if there is no streak, the api will not be hit
    authenticateUser({ formData, streak, setError });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (isLoggedIn) {
    if (postAuthRedirect) {
      return <Redirect to={postAuthRedirect} />;
    } else return <Redirect to={LANDING} />;
  }
  return (
    <Paper className="authCard signIn">
      <Helmet>
        <title>Sign In | politIQ trivia</title>
      </Helmet>
      <h1>Sign In</h1>
      <p>
        Don't have an account? <Link to={SIGN_UP}>Sign Up</Link>
      </p>

      {authMessage && <div className="redirect-error">{authMessage}</div>}
      <form>
        <TextField
          margin="normal"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="text"
          placeholder="Email Address"
        />
        <br />
        <TextField
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          type="password"
          name="password"
          placeholder="Password"
        />
        <Button
          disabled={isInvalid}
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "2vh" }}
          onClick={handleSubmit}
        >
          {buttonCopy}
        </Button>
        <span>
          <p>
            <Link to={REQUEST_FORGOT_PASSWORD}>Forgot Password?</Link>
          </p>
        </span>

        {error && <p>{error.message}</p>}
      </form>
    </Paper>
  );
};

const mapState = (state) => {
  const { streak } = state.streak;
  const { auth, authMessage, postAuthRedirect } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    authMessage,
    streak,
    isLoggedIn,
    postAuthRedirect,
  };
};

const mapDispatch = (dispatch) => {
  return {
    authenticateUser({ formData, streak, setError }) {
      dispatch(
        authenticateWithStreak({
          formData,
          streak,
          setError,
          setLongestStreak(score) {
            dispatch(setMaxScore(score));
          },
          midAuthentication() {
            dispatch(setMidAuth());
          },
        })
      );
    },
  };
};

export default connect(mapState, mapDispatch)(SignInFormWithStreak);
