import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import LoadingGif from "../../6.gif";
import "../../css/customStyles.css";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";

// import {
//   FacebookShareButton,
//   LinkedinShareButton,
//   TwitterShareButton,
//   WhatsappShareButton,
//   EmailShareButton,
// } from "react-share";

// import {
//   FacebookIcon,
//   TwitterIcon,
//   WhatsappIcon,
//   LinkedinIcon,
//   EmailIcon,
// } from "react-share";

import UserScoreboard from "./UserScoreboard";
import PublicProfilePhoto from "./PublicProfilePhoto";

import "./profile.css";
import { fetchProfile } from "../../redux/reducers/profile";

const PublicProfile = (props) => {
  // const uid = window.location.href.split("profile/")[1];
  const { userId } = props.match.params;
  // const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    props.getProfile(userId);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps
  // const fetchUserInfo = async () => {
  //   // get user info
  //   db.getOneUser(uid)
  //     .then((response) => {
  //       return response.val();
  //     })
  //     .then((userData) => {
  //       setUserInfo({ ...userData, uid: uid });
  //     });
  // };
  // if (userInfo === null) {
  //   // if there isn't user info yet
  //   fetchUserInfo();
  // }

  // if (userInfo) {
  //   if (userInfo.uid !== uid) {
  //     // if user info needs to be updated to the window url
  //     fetchUserInfo();
  //   }
  // }

  let content = (
    <center style={{ marginTop: "100px" }}>
      <img src={LoadingGif} alt="loading" style={{ maxWidth: "100%" }} />
    </center>
  );

  if (!!props.profile.id) {
    content = (
      <div>
        <Helmet>
          <title>{props.profile.fullName} Profile | politIQ trivia</title>
        </Helmet>
        <div className="public-profile">
          <div className="public-profile-top">
            <h1 className="displayNameBox">{props.profile.fullName}</h1>

            {props.profile.id === props.signedInUserId ? ( // user is on their own profile
              <NavLink
                style={{ textDecoration: "none", color: "white" }}
                to="/profile"
              >
                <button className="customButton">Edit My Profile</button>
              </NavLink>
            ) : null}
          </div>

          {/* <PublicProfilePhoto uid={userInfo.uid} /> */}

          {
            <center>
              <div className="bioContainer">
                <p className="bio">{props.profile.bio}</p>
              </div>
            </center>
          }

          <UserScoreboard profileId={userId} />
          <div className="socials">
            <div className="social">
              {/* <FacebookShareButton
              url={window.location.href.toString()}
              // className="shareable"
              quote={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <FacebookIcon round={true} size={32} />
            </FacebookShareButton>
          </div>{" "}
          <div className="social">
            <LinkedinShareButton
              url={window.location.href.toString()}
              // className=""
              description={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <LinkedinIcon round={true} size={32} />
            </LinkedinShareButton>
          </div>
          <div className="social">
            <TwitterShareButton
              url={window.location.href.toString()}
              title={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <TwitterIcon round={true} size={32} />
            </TwitterShareButton>
          </div>
          <div className="social">
            <WhatsappShareButton
              url={window.location.href.toString()}
              title={
                authUser.uid === uid
                  ? `Check out my profile on politIQ! Click here to see how you rank up!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ! Click here to see how you rank up!`
              }
            >
              <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
          </div>
          <div className="social">
            <EmailShareButton
              url={window.location.href.toString()}
              subject={
                authUser.uid === uid
                  ? `Check out my proflie on politIQ!`
                  : `Check out ${userInfo.displayName}'s profile on politIQ!`
              }
              body={
                authUser.uid === uid
                  ? `Click here to see how you rank up!`
                  : `Click here to see how you rank up!`
              }
            >
              <EmailIcon round={true} size={32} />
            </EmailShareButton> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <Paper className="profile"> {content} </Paper>;
};
const mapState = (state) => {
  const { auth } = state.auth;
  const { profile } = state.profile;
  return {
    isLoggedIn: !!auth.id,
    isAdmin: auth.role === "Admin",
    signedInUserId: auth.id,
    profile,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProfile(userId) {
      dispatch(fetchProfile(userId));
    },
  };
};

export default connect(mapState, mapDispatch)(PublicProfile);
