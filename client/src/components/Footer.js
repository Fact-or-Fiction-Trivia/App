import React from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import * as routes from "../constants/routes";
import styles from "./Footer.module.scss";
import SocialShare from "./SocialShare/SocialShare";

const Footer = ({ isLoggedIn }) => (
  <>
    <div className={styles.footer}>
      {isLoggedIn ? (
        <div className={styles.description}>
          <h3>Find some news we should include?</h3>
          <p>
            Increase your score by clicking the link below to submit your own
            question. We'll review it and, if accepted, we'll add it to the
            quiz. Make sure to include a reliable source for your information!
          </p>
          <Link to={routes.SUBMIT_QUESTION}>Submit a Question Now</Link>
        </div>
      ) : (
        <div className={styles.description}>
          <h3>About Us</h3>
          <p>
            In an effort to combat polarization and improve the dialogue around
            politics, I created this site as a platform for generating a common
            consensus of current events and political realities through a
            friendly competition. I mean, everyone loves a fun and informative
            game, right?
          </p>
          <Link to={routes.ABOUT}>Read More</Link>
        </div>
      )}

      <div className={styles.links}>
        <h3>Quick Links</h3>
        {process.env.REACT_APP_PRELAUNCH === "false" && (
          <>
            <Link to={routes.GAME}>Play</Link>
            <Link to={routes.SUBMIT_QUESTION}>Submit a Question</Link>
          </>
        )}
        <Link to={`${routes.ABOUT}#FAQ`}>FAQ</Link>
        <Link to={routes.ABOUT}>About</Link>
        {process.env.REACT_APP_PRELAUNCH === "false" && !isLoggedIn && (
          <Link to={routes.SIGN_UP}>Sign Up</Link>
        )}
      </div>

      <div className={styles.sharing}>
        <h3>Share on Social Media</h3>
        <SocialShare color="white" shouldShowInstagram={false} />
      </div>
    </div>
    <div className={styles.bottomNav}>
      <Link to={routes.GAME} id="play">
        Play
      </Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/about">About</Link>
    </div>
  </>
);

const mapState = (state) => {
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;

  return {
    isLoggedIn,
  };
};

export default connect(mapState)(Footer);
