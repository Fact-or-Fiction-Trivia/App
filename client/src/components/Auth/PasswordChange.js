import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const PasswordChangeForm = ({ resetUserPassword }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
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
        onClick={() => resetUserPassword(formData.password)}
        style={{ marginTop: "3vh" }}
      >
        Reset My Password
      </Button>

      {/* {error && <p>{error.message}</p>} */}
    </form>
  );
};

export default PasswordChangeForm;
