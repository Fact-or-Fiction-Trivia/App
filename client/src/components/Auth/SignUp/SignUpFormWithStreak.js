import React, { useState } from "react";
import { connect } from "react-redux";
import { me, signupWithStreak } from "../../../redux/reducers/auth";
import { Redirect, Link } from "react-router-dom";
// UI
import Helmet from "react-helmet";

import {
  TextField,
  Select,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Checkbox,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "../Auth.scss";
import { setMaxScore, setMidAuth } from "../../../redux/reducers/streak";
import { LANDING, PRIVACY, SIGN_IN } from "../../../constants/routes";
import { subscribeToEmails } from "../../../redux/reducers/profile";

const SignUpFormWithStreak = ({
  authMessage,
  buttonCopy = "Sign Up",
  isLoggedIn,
  postAuthRedirect,
  signUpUserWithStreak,
  streak,
}) => {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    affiliation: "",
    email: "",
    password: "",
    correctPassword: "",
    emailOptIn: true,
  });
  // All fields are required
  const isInvalid =
    formData.password === "" ||
    formData.email === "" ||
    formData.firstName === "" ||
    formData.lastName === "" ||
    formData.affiliation === "" ||
    formData.correctPassword === "" ||
    formData.password !== formData.correctPassword;
  // Handler
  const handleSubmit = (e) => {
    if (formData.password.length < 8) {
      setError({ message: "Password should be at least 8 characters" });
      return;
    }
    e.preventDefault();

    signUpUserWithStreak({ formData, streak, setError });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "emailOptIn") {
      setFormData({
        ...formData,
        emailOptIn: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (isLoggedIn) {
    if (postAuthRedirect) {
      return <Redirect to={postAuthRedirect} />;
    } else return <Redirect to={LANDING} />;
  }
  return (
    <Paper className="authCard signIn">
      <Helmet>
        <title>Sign Up | politIQ trivia</title>
      </Helmet>
      <h1>Sign Up</h1>
      <p>
        Already have an account? <Link to={SIGN_IN}>Sign In</Link>
      </p>

      {authMessage && <div className="redirect-error">{authMessage}</div>}

      <form>
        <TextField
          margin="normal"
          fullWidth
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          type="text"
          placeholder="First Name"
        />
        <br />
        <TextField
          margin="normal"
          fullWidth
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          type="text"
          placeholder="Last Name"
        />
        <br />
        <FormControl fullWidth>
          <InputLabel id="affiliation-select-label">Affiliation</InputLabel>
          <Select
            labelId="affiliation-select-label"
            name="affiliation"
            value={formData.affiliation}
            label="Affiliation"
            onChange={handleChange}
          >
            <MenuItem value="Democrat">Democrat</MenuItem>
            <MenuItem value="Republican">Republican</MenuItem>
            <MenuItem value="Independent">Independent</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
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
        <br />
        <TextField
          margin="normal"
          fullWidth
          value={formData.correctPassword}
          onChange={handleChange}
          type="password"
          name="correctPassword"
          placeholder="Reenter Password"
        />
        <FormControlLabel
          className="emailOptIn"
          control={
            <Checkbox
              color="primary"
              checked={formData.emailOptIn}
              onChange={handleChange}
              name="emailOptIn"
            />
          }
          label="I would like to receive email updates from Fact or Fiction"
        />
      </form>
      <Button
        disabled={isInvalid}
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {buttonCopy}
      </Button>
      {error && <p>{error.message}</p>}
      <p className="privacy-opt-in">
        By registering a profile, I agree to FOF's{" "}
        <Link to={PRIVACY}>Privacy Policy and Terms of Service</Link>
      </p>
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
    async signUpUserWithStreak({ formData, streak, setError }) {
      await dispatch(
        signupWithStreak({
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
      if (formData.emailOptIn) {
        await dispatch(subscribeToEmails());
        dispatch(me());
      }
    },
  };
};

export default connect(mapState, mapDispatch)(SignUpFormWithStreak);
