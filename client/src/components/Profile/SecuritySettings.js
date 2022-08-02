import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import PasswordChangeForm from "../Auth/PasswordChange";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { deleteUser } from "../../redux/reducers/auth";
import { LANDING } from "../../constants/routes";

const SecuritySettings = ({ auth, deleteUserAccount, resetUserPassword }) => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [deleteAccountInputs, setDeleteAccountInputs] = React.useState({});
  const [error, setError] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteUser = async () => {
    const password = deleteAccountInputs.password;
    const response = await deleteUserAccount(auth.id, auth.email, password);
    if (response?.error?.status === 401) {
      setError(true);
    } else {
      setError(false);
      history.push(LANDING);
    }
  };

  const handleDeleteAccountInputChange = (event) => {
    event.persist();
    setDeleteAccountInputs((deleteAccountInputs) => ({
      ...deleteAccountInputs,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <h1 id="settings-heading">Security Settings</h1>
      <div className="settings-content">
        <h3 className="settings-subheading">Reset Your Password</h3>
        <PasswordChangeForm resetUserPassword={resetUserPassword} />

        <Button onClick={handleClickOpen} id="delete-account-button">
          <span style={{ color: "red" }}>Delete Account</span>
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible. Reauthenticate to permanently delete
            your account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="password"
            type="password"
            error={error}
            onChange={handleDeleteAccountInputChange}
            fullWidth
          />
          {error && (
            <p style={{ color: "red", fontSize: "0.8rem" }}>
              The password you entered was incorrect.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Keep account for now
          </Button>
          <Button onClick={handleDeleteUser} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  const isLoggedIn = !!auth;
  return {
    auth,
    isLoggedIn,
  };
};

const mapDispatch = (dispatch) => {
  return {
    async deleteUserAccount(id, email, password) {
      const { payload } = await dispatch(deleteUser({ email, password, id }));
      return payload;
    },
  };
};

export default connect(mapState, mapDispatch)(SecuritySettings);
