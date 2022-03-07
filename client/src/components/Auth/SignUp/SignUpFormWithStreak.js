import React, { useState } from "react";
import { connect } from "react-redux";
import { signupWithStreak } from "../../../redux/reducers/auth";
import { Redirect, Link } from "react-router-dom";
// UI
import Helmet from "react-helmet";

import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "../Auth.css";
import { setMaxScore, setMidAuth } from "../../../redux/reducers/streak";
import { SIGN_IN_WITH_STREAK } from "../../../constants/routes";

const SignUpFormWithStreak = ({
  signUpUser,
  buttonCopy = "Sign Up",
  streak,
  isLoggedIn,
}) => {
  const [error] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    affiliation: "",
    email: "",
    password: "",
    correctPassword: "",
  });
  const isInvalid = formData.password === "" || formData.email === "";
  // Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    signUpUser({ formData, streak });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  if (isLoggedIn) {
    return <Redirect to="/game/play" />;
  } else if (!streak.length) {
    return <Redirect to="/game" />;
  }
  return (
    <Paper className="authCard signIn">
      <Helmet>
        <title>Sign Up | politIQ trivia</title>
      </Helmet>
      <h1>Sign Up</h1>
      <p>Already have an account?</p>
      <Link to={SIGN_IN_WITH_STREAK}>Sign In</Link>
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

        {error && <p>{error.message}</p>}
      </form>
    </Paper>
  );
};

const mapState = (state) => {
  const { streak } = state.streak;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    streak,
    isLoggedIn,
  };
};

const mapDispatch = (dispatch) => {
  return {
    signUpUser({ formData, streak }) {
      dispatch(
        signupWithStreak({
          formData,
          streak,
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

export default connect(mapState, mapDispatch)(SignUpFormWithStreak);
