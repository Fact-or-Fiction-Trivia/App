import React, { useState } from "react";

import MediaQuery from "react-responsive";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { FormHelperText } from "@material-ui/core";

import ProfilePhoto from "../ProfilePhoto";
import { useHistory } from "react-router-dom";
import { updateUserInfo } from "../../../redux/reducers/auth";

const EditProfile = ({ auth, toggleEditProfile, updateInfo }) => {
  const history = useHistory;
  const [firstName, setFirstName] = useState(auth.firstName);
  const [lastName, setLastName] = useState(auth.lastName);
  const [email, setEmail] = useState(auth.email);
  const [bio, setBio] = useState(auth.bio || "");
  const [affiliation, setAffiliation] = useState(auth.affiliation);

  const handleSave = async () => {
    const update = {
      firstName,
      lastName,
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
          label="Display Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          fullWidth
        />
        <TextField
          margin="normal"
          label="Display Name"
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

      <MediaQuery maxWidth={415}>
        {/* <ProfilePhoto authUser={this.props.authUser} /> */}
      </MediaQuery>
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
