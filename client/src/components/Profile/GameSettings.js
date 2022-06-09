import React, { useEffect, useState } from "react";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import Toast from "../Toast/Toast";
import { me, updateUserInfo } from "../../redux/reducers/auth";
import {
  getMailchimpStatus,
  subscribeToEmails,
  updateMailchimpStatus,
} from "../../redux/reducers/profile";

const GameSettings = ({
  auth,
  getEmailSubscriptionStatus,
  mailchimpStatus,
  updateEmailSubscriptionStatus,
  updateInfo,
}) => {
  const [saved, setSaved] = useState(false);
  const [invisibleScore, setInvisibleScore] = useState(
    auth.invisibleScore || false
  );

  const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  let flashInterval;

  useEffect(() => {
    return clearInterval(flashInterval);
  });

  useEffect(() => {
    if (auth.mailchimpId) {
      getEmailSubscriptionStatus(auth.mailchimpId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const subscribedStatuses = ["subscribed", "transactional"];

  useEffect(() => {
    setSubscriptionStatus(subscribedStatuses.includes(mailchimpStatus?.status));
  }, [mailchimpStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    updateInfo({ invisibleScore });
    if (
      // if you're not subscribed and you've toggled your switch to true
      !subscribedStatuses.includes(mailchimpStatus?.status) &&
      subscriptionStatus
    ) {
      updateEmailSubscriptionStatus(
        auth.mailchimpId,
        subscriptionStatus ? "subscribed" : "unsubscribed"
      );
    }
    setSaved(true);
    flashInterval = setInterval(() => {
      setSaved(false);
    }, 10000);
  };

  return (
    <div style={{ marginBottom: "10vh" }}>
      <h1 id="settings-heading">Game Settings</h1>

      <div className="settings-content">
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
        <h3 className="settings-subheading">Notifications</h3>

        <FormGroup row className="notification-settings">
          <FormControlLabel
            control={
              <Switch
                checked={subscriptionStatus}
                color="primary"
                name="invisibleScore"
                onChange={() => setSubscriptionStatus(!subscriptionStatus)}
              />
            }
            label="Receive email updates from Fact or Fiction"
          />
        </FormGroup>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: "3vh" }}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
        <Toast
          duration={10000}
          text="Your preferences have been updated successfully!"
          onClose={() => setSaved(false)}
          open={saved}
        />
      </div>
    </div>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  const { mailchimpStatus } = state.profile;
  return {
    auth,
    mailchimpStatus,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getEmailSubscriptionStatus(mailchimpId) {
      // Subscriber's current status. Possible values: "subscribed", "unsubscribed", "cleaned", "pending", "transactional", or "archived".
      dispatch(getMailchimpStatus(mailchimpId));
    },
    async updateEmailSubscriptionStatus(mailchimpId, update) {
      if (mailchimpId) {
        dispatch(updateMailchimpStatus({ mailchimpId, update }));
      } else {
        await dispatch(subscribeToEmails());
      }

      dispatch(me());
    },
    updateInfo(update) {
      dispatch(updateUserInfo(update));
    },
  };
};

export default connect(mapState, mapDispatch)(GameSettings);
