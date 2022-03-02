import React, { useState } from "react";
import { connect } from "react-redux";
import { authenticateWithStreak } from "../../../redux/reducers/auth";

// UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "../Auth.css";
import { setMaxScore } from "../../../redux/reducers/streak";

const SignInFormWithStreak = ({
  authenticateUser,
  buttonCopy = "Sign In",
  setLongestStreak,
  streak,
}) => {
  const [error] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const isInvalid = formData.password === "" || formData.email === "";
  // Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    authenticateUser({ formData, setLongestStreak, streak });
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

const mapDispatch = (dispatch) => {
  return {
    authenticateUser({ formData, setLongestStreak, streak }) {
      dispatch(authenticateWithStreak({ formData, setLongestStreak, streak }));
    },
    setLongestStreak(score) {
      dispatch(setMaxScore(score));
    },
  };
};

export default connect(null, mapDispatch)(SignInFormWithStreak);
