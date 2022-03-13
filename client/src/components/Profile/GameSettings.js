import React, { useState } from "react";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";

const GameSettings = ({ auth }) => {
  const [soundsOn, setSoundsOn] = useState(auth.soundsOn || true);
  const [saved, setSaved] = useState(false);
  const [invisibleScore, setInvisibleScore] = useState(
    auth.invisibleScore || false
  );

  // todo: fix this
  // componentWillUnmount = () => {
  //   clearInterval(this.flashInterval);
  // };

  const handleSubmit = async () => {
    // const userInfo = this.state.userInfo;
    // // when the user clicks save changes, update the userInfo object in localStorage/cache to reflect their settings
    // userInfo.soundsOn = this.state.soundsOn;
    // userInfo.invisibleScore = this.state.invisibleScore;
    // localStorage.setItem("authUser", JSON.stringify(userInfo));
    // // also make a db call to update the user object, so that next time they log in, their preferences
    // // will be loaded automatically.
    // const uid = userInfo.uid;
    // await db.soundSettings(uid, this.state.soundsOn);
    // await db.scoreVisibility(uid, this.state.invisibleScore);
    // // once the data has been saved, update the UI to let the user know that it was successful
    // this.setState({
    //   saved: true,
    // });
    // // display the message for 10 seconds and then have it disappear
    // this.flashInterval = setInterval(() => {
    //   this.setState({
    //     saved: false,
    //   });
    // }, 10000);
  };

  return (
    <div style={{ marginBottom: "10vh" }}>
      <h1 id="settings-heading">Game Settings</h1>
      <h3 className="settings-subheading">Sounds</h3>
      {auth ? (
        <FormGroup row className="notification-settings">
          <FormControlLabel
            control={
              <Switch
                checked={soundsOn}
                color={"primary"}
                onChange={() => setSoundsOn(!soundsOn)}
                name="soundsOn"
                inputProps={{ "aria-label": "Sounds On" }}
              />
            }
            label="Game sounds on"
          />
        </FormGroup>
      ) : null}

      <h3 className="settings-subheading">Score Visibility</h3>
      <FormGroup row className="notification-settings">
        <FormControlLabel
          control={
            <Switch
              checked={invisibleScore}
              color="primary"
              name="invisibleScore"
              onChange={() => setInvisibleScore(!invisibleScore)}
            />
          }
          label="Hide my scores from the monthly and weekly leaderboards"
        />
      </FormGroup>
      <Button
        color="primary"
        style={{ marginTop: "3vh" }}
        onClick={handleSubmit}
      >
        Save Changes
      </Button>
      {saved ? <p>Your preferences have been updated successfully!</p> : null}
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

export default connect(mapState, mapDispatch)(GameSettings);
