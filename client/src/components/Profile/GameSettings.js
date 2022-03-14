import React, { useEffect, useState } from "react";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { updateUserInfo } from "../../redux/reducers/auth";

const GameSettings = ({ auth, updateInfo }) => {
  const [soundsOn, setSoundsOn] = useState(auth.soundsOn);
  const [saved, setSaved] = useState(false);
  const [invisibleScore, setInvisibleScore] = useState(
    auth.invisibleScore || false
  );
  let flashInterval;

  useEffect(() => {
    return clearInterval(flashInterval);
  });

  const handleSubmit = async () => {
    updateInfo({ soundsOn, invisibleScore });
    setSaved(true);
    flashInterval = setInterval(() => {
      setSaved(false);
    }, 10000);
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
  return {
    updateInfo(update) {
      dispatch(updateUserInfo(update));
    },
  };
};

export default connect(mapState, mapDispatch)(GameSettings);
