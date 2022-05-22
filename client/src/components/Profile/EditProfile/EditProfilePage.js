import React, { useEffect } from "react";
import MediaQuery from "react-responsive";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import EditProfileForm from "./EditProfileForm";
import { SIGN_IN } from "../../../constants/routes";

const EditProfilePage = ({
  auth,
  initialSignUpMessage,
  isLoggedIn,
  setFBAuth,
  toPublicProfile,
}) => {
  const history = useHistory();

  useEffect(() => {
    if (!isLoggedIn) {
      history.push(SIGN_IN);
    }
  }, [auth.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <MediaQuery minWidth={416}>
        <Link
          to={`/profile/${auth.id}`}
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            float: "right",
          }}
        >
          <Button
            color="primary"
            onClick={() => toPublicProfile(auth.id)}
            style={{ marginRight: "1vw !important" }}
          >
            View Public Profile
          </Button>
        </Link>
      </MediaQuery>

      <h1 id="settings-heading">Edit Profile</h1>

      <MediaQuery maxWidth={415}>
        <Link
          to={`/profile/${auth.id}`}
          style={{
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            className="back-button"
            onClick={() => toPublicProfile(auth.id)}
            style={{ marginRight: "1vw !important" }}
          >
            View Public Profile
          </Button>
        </Link>
      </MediaQuery>

      <div className="edit-holder">
        <EditProfileForm
          initialSignUpMessage={initialSignUpMessage}
          setFBAuth={setFBAuth}
        />
      </div>
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

export default connect(mapState)(EditProfilePage);
