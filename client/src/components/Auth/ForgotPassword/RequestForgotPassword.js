import React, { useState } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { requestReset } from "../../../redux/reducers/auth";
import styles from "../Auth.module.scss";
import Toast from "../../../components/Toast/Toast";

const RequestForgotPassword = ({
  hasError,
  isLoading,
  message,
  requestResetPassword,
}) => {
  const [email, setEmail] = useState("");
  return (
    <div className={styles.authContainer}>
      <Paper className={styles.passwordForgetForm}>
        <Helmet>
          <title>Reset Password | Fact or Fiction</title>
        </Helmet>
        <h1>Forgot Your Password?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestResetPassword(email);
          }}
        >
          <TextField
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            type="text"
            placeholder="Email Address"
            color="primary"
          />
          <Button
            color="primary"
            disabled={isLoading}
            variant="contained"
            type="submit"
          >
            Send
          </Button>

          {message && (
            <Toast
              duration={10000}
              text={message}
              open={message}
              variant={hasError ? "warning" : "success"}
            />
          )}
        </form>
      </Paper>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { hasError, isLoading, message } = state.auth;
  return {
    hasError,
    isLoading,
    message,
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
