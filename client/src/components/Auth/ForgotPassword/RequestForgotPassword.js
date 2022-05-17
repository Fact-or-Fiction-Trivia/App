import React, { useState } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { requestReset } from "../../../redux/reducers/auth";
import { Redirect } from "react-router-dom";
import styles from "../Auth.module.scss";

const RequestForgotPassword = ({
  requestResetPassword,
  requestedPasswordReset,
}) => {
  const [email, setEmail] = useState("");
  if (requestedPasswordReset) {
    return <Redirect to="/" />;
  }
  return (
    <div className={styles.authContainer}>
      <Paper className={styles.passwordForgetForm}>
        <Helmet>
          <title>Reset Password | Fact or Fiction</title>
        </Helmet>
        <h1>Forgot Your Password?</h1>
        <form>
          <TextField
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            type="text"
            placeholder="Email Address"
            color="primary"
          />
          <Button
            color="primary"
            variant="contained"
            onClick={() => requestResetPassword(email)}
          >
            Send
          </Button>
        </form>
      </Paper>
    </div>
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
