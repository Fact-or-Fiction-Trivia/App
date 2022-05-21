import React, { useState } from "react";
import { connect } from "react-redux";
import { me, signupWithStreak } from "../../../redux/reducers/auth";
import { Redirect, Link } from "react-router-dom";
import classNames from "classnames";
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
import styles from "../Auth.module.scss";
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
    username: "",
    affiliation: "",
    email: "",
    password: "",
    correctPassword: "",
    emailOptIn: true,
  });

  const isValidUsername = (value) => {
    const regex = new RegExp("^[a-zA-Z0-9_]*$", "g");
    const validated = regex.test(value);
    if (!validated) {
      setError({ message: "Username must contain only numbers and letters" });
    } else {
      setError(null);
    }
    return validated;
  };

  // All fields are required
  const isInvalid =
    formData.password === "" ||
    formData.email === "" ||
    formData.username === "" ||
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
      if (name === "username") {
        isValidUsername(value);
      }
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
    <Paper className={classNames(styles.authCard, styles.signIn)}>
      <Helmet>
        <title>Sign Up | Fact or Fiction</title>
      </Helmet>
      <h1>Sign Up</h1>
      <p>
        Already have an account? <Link to={SIGN_IN}>Sign In</Link>
      </p>

      {authMessage && <div className={styles.redirectError}>{authMessage}</div>}

      <form>
        <TextField
          margin="normal"
          fullWidth
          name="username"
          value={formData.username}
          onChange={handleChange}
          type="text"
          placeholder="Username"
        />
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
          className={styles.emailOptIn}
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
      {error && <p className={styles.error}>{error.message}</p>}
      <Button
        disabled={isInvalid}
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {buttonCopy}
      </Button>
      <p className={styles.privacyOptIn}>
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
