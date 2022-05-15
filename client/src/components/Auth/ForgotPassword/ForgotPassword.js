import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { receiveToken, resetPassword } from "../../../redux/reducers/auth";
import { Redirect } from "react-router-dom";

const ForgotPassword = ({
  recieveAccessToken,
  match,
  id,
  validToken,
  validatingToken,
  resetForgotPassword,
  resetPasswordSuccessful,
}) => {
  const { accessToken } = match.params;
  useEffect(() => {
    recieveAccessToken(accessToken);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };
  if (validatingToken) {
    return <p>Validating</p>;
  } else if (!validToken) {
    return <p>Invalid Token</p>;
  }
  if (resetPasswordSuccessful) {
    return <Redirect to={"/signin"} />;
  }
  return (
    <Paper
      style={{
        padding: "5vh",
        marginBottom: "40vh",
        marginTop: "10vh",
        width: "80vw",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}
    >
      <Helmet>
        <title>Reset Password | Fact or Fiction</title>
      </Helmet>
      <h2>Forgot Your Password?</h2>
      <form>
        <TextField
          value={formData.password}
          onChange={handleChange}
          name="password"
          type="password"
          placeholder="Password"
          style={{ width: "30vw" }}
          color="primary"
        />
        <TextField
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          style={{ width: "30vw" }}
          color="primary"
        />
        <Button
          disabled={
            !formData.password ||
            !formData.confirmPassword ||
            formData.password !== formData.confirmPassword
          }
          onClick={() =>
            resetForgotPassword({ password: formData.password, userId: id })
          }
        >
          Send
        </Button>
      </form>
    </Paper>
  );
};

const mapState = (state) => {
  const { id, validToken, validatingToken, resetPasswordSuccessful } =
    state.auth;
  return {
    id,
    validToken,
    validatingToken,
    resetPasswordSuccessful,
  };
};

const mapDispatch = (dispatch) => {
  return {
    resetForgotPassword(data) {
      dispatch(resetPassword(data));
    },
    recieveAccessToken(accessToken) {
      dispatch(receiveToken(accessToken));
    },
  };
};

export default connect(mapState, mapDispatch)(ForgotPassword);
