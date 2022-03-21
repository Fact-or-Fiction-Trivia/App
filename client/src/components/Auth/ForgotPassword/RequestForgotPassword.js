import React, { useState } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { requestReset } from "../../../redux/reducers/auth";
import { Redirect } from "react-router-dom";

const RequestForgotPassword = ({
  requestResetPassword,
  requestedPasswordReset,
}) => {
  const [email, setEmail] = useState("");
  if (requestedPasswordReset) {
    return <Redirect to="/" />;
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
        <title>Reset Password | politIQ trivia</title>
      </Helmet>
      <h2>Forgot Your Password?</h2>
      <form>
        <TextField
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          type="text"
          placeholder="Email Address"
          style={{ width: "30vw" }}
          color="primary"
        />
        <Button onClick={() => requestResetPassword(email)}>Send</Button>
      </form>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const { requestedPasswordReset } = state.auth;
  return {
    requestedPasswordReset,
  };
};

const mapDispatch = (dispatch) => {
  return {
    requestResetPassword(email) {
      dispatch(requestReset(email));
    },
  };
};

export default connect(mapStateToProps, mapDispatch)(RequestForgotPassword);
