import React, { useState } from "react";
import { connect } from "react-redux";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Toast from "../../components/Toast/Toast";
import { resetLoggedInUsersPassword } from "../../redux/reducers/auth";

const PasswordChangeForm = ({ resetUserPassword }) => {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const response = await resetUserPassword(formData.password);

    if (response === 204) {
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  return (
    <form className="password-change-form">
      <TextField
        fullWidth
        value={formData.password}
        onChange={handleChange}
        type="password"
        name="password"
        placeholder="New Password"
        margin="normal"
      />
      <TextField
        fullWidth
        value={formData.confirmPassword}
        onChange={handleChange}
        type="password"
        name="confirmPassword"
        placeholder="Confirm New Password"
        margin="normal"
      />
      <Button
        color="primary"
        variant="contained"
        disabled={
          (formData.password === "" && formData.confirmPassword === "") ||
          formData.password !== formData.confirmPassword ||
          formData.password.length < 8
        }
        onClick={() => handleSubmit()}
        style={{ marginTop: "3vh" }}
      >
        Reset My Password
      </Button>

      {error && (
        <Toast
          duration={10000}
          text="Password update was not successful. Make sure your passwords match."
          open={error}
          variant="warning"
        />
      )}
      {success && (
        <Toast
          duration={10000}
          text="Password updated successfully!"
          open={success}
          variant="success"
        />
      )}
    </form>
  );
};

const mapDispatch = (dispatch) => ({
  async resetUserPassword(data) {
    const { payload } = await dispatch(resetLoggedInUsersPassword(data));
    return payload;
  },
});

export default connect(null, mapDispatch)(PasswordChangeForm);
