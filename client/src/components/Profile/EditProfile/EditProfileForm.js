import React, { useEffect, useState } from "react";

import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { FormHelperText } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { updateUserInfo } from "../../../redux/reducers/auth";

const EditProfile = ({ auth, toggleEditProfile, updateInfo }) => {
  const history = useHistory;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [affiliation, setAffiliation] = useState("");

  useEffect(() => {
    // there's a slight delay between when this page loads and the auth object is fetched, so we need to
    // set the initial state here.
    if (auth.id) {
      setFirstName(auth.firstName);
      setLastName(auth.lastName);
      setUsername(auth.username);
      setEmail(auth.email);
      setBio(auth.bio || "");
      setAffiliation(auth.affiliation);
    }
  }, [auth]);

  const handleSave = async () => {
    const update = {
      firstName,
      lastName,
      username,
      email,
      bio,
      affiliation,
    };
    updateInfo(update);
  };

  const handleSaveAndView = async () => {
    handleSave();
    history.push(`/profile/${this.state.uid}`);
  };

  return (
    <div className="edit-profile">
      <form>
        <TextField
          margin="normal"
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          fullWidth
          label="Email Address"
        />
        <FormHelperText>Affiliation</FormHelperText>
        <Select
          native
          fullWidth
          value={affiliation}
          label="Affiliation"
          onChange={(event) => setAffiliation(event.target.value)}
          inputProps={{
            name: "affiliation",
          }}
        >
          <option value="" />
          <option value="Democrat">Democrat</option>
          <option value="Republican">Republican</option>
          <option value="Independent">Independent</option>
          <option value="none">I choose not to disclose</option>
        </Select>
        <TextField
          margin="normal"
          multiline
          fullWidth
          label="Bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </form>

      <div className="profile-button-holder">
        <Button color="primary" onClick={toggleEditProfile}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button color="primary" onClick={handleSaveAndView}>
          Save & View Public Profile
        </Button>
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  return {
    auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    updateInfo(update) {
      dispatch(updateUserInfo(update));
    },
  };
};

export default connect(mapState, mapDispatch)(EditProfile);
