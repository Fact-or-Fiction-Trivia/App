import React, { useState } from "react";

import MediaQuery from "react-responsive";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { FormHelperText } from "@material-ui/core";

import ProfilePhoto from "../ProfilePhoto";
import { useHistory } from "react-router-dom";

const EditProfile = ({ auth, toggleEditProfile }) => {
  const history = useHistory;
  const [displayName, setDisplayName] = useState(auth.fullName);
  const [email, setEmail] = useState(auth.email);
  const [bio, setBio] = useState(auth.bio);
  const [affiliation, setAffiliation] = useState(auth.affiliation);

  const handleSave = async () => {
    // const updates = {
    //   displayName: this.state.displayName,
    //   email: this.state.email,
    //   affiliation: this.state.affiliation,
    //   bio: this.state.bio,
    // };
    // const oldUserInfo = this.props.authUser;
    // const uid = oldUserInfo.uid;
    // await db.editUser(uid, updates);
    // if (this.props.email !== this.state.email) {
    //   const user = auth.currentUser;
    //   await user
    //     .updateEmail(this.state.email)
    //     .then(function () {})
    //     .catch(function (error) {
    //       console.error(error);
    //     });
    // }
    // // once the user saves their info, update the local storage object as well because that's used throughout the applicaiton
    // oldUserInfo.displayName = updates.displayName;
    // oldUserInfo.email = updates.email;
    // oldUserInfo.affiliation = updates.affiliation;
    // oldUserInfo.bio = updates.bio;
    // localStorage.setItem("authUser", JSON.stringify(oldUserInfo));
    // if (localStorage.hasOwnProperty("fbAuth")) {
    //   localStorage.removeItem("fbAuth");
    // }
  };

  const handleSaveAndView = async () => {
    // const updates = {
    //   displayName: this.state.displayName,
    //   email: this.state.email,
    //   affiliation: this.state.affiliation,
    //   bio: this.state.bio,
    // };

    // await db.editUser(this.props.uid, updates);

    // if (this.props.email !== this.state.email) {
    //   const user = auth.currentUser;
    //   await user
    //     .updateEmail(this.state.email)
    //     .then(function () {})
    //     .catch(function (error) {
    //       console.error(error);
    //     });
    // }

    history.push(`/profile/${this.state.uid}`);
  };

  return (
    <div className="edit-profile">
      <form>
        <TextField
          margin="normal"
          label="Display Name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
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
  return {};
};

export default connect(mapState, mapDispatch)(EditProfile);
