import React, { useState } from "react";
import { connect } from "react-redux";
import {
  authenticate,
  authenticateWithStreak,
  signupWithStreak,
} from "../../../redux/reducers/auth";

// UI
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "../Auth.css";
import { setMaxScore } from "../../../redux/reducers/streak";

const SignUpFormWithStreak = ({
  signUpUser,
  buttonCopy = "Sign In",
  setLongestStreak,
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
  });
  const isInvalid = formData.password === "" || formData.email === "";
  // Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    signUpUser({ formData, setLongestStreak, streak });
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
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
  );
};

const mapSignup = (state) => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    signUpUser({ formData, setLongestStreak, streak }) {
      dispatch(signupWithStreak({ formData, setLongestStreak, streak }));
    },
    setLongestStreak(score) {
      dispatch(setMaxScore(score));
    },
  };
};

export default connect(null, mapDispatch)(SignUpFormWithStreak);
