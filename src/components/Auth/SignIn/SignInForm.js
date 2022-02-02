import React, { useState } from "react";
import { connect } from "react-redux";
import { authenticate } from "../../../redux/reducers/auth";

// UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "../Auth.css";
import { setMaxScore } from "../../../redux/reducers/streak";

const SignInFormBase = ({
  authenticateUser,
  buttonCopy = "Sign In",
  setLongestStreak,
  callback,
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

    authenticateUser({ formData, setLongestStreak, callback });
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
    authenticateUser({ formData, setLongestStreak, callback }) {
      dispatch(authenticate({ formData, setLongestStreak, callback }));
    },
    setLongestStreak(score) {
      dispatch(setMaxScore(score));
    },
  };
};

export default connect(null, mapDispatch)(SignInFormBase);
