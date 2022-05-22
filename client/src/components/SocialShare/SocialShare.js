import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { Link, Facebook, Instagram, Twitter } from "@material-ui/icons";
import styles from "./SocialShare.module.scss";

const SocialShare = ({ color, highestStreak }) => {
  console.log(process.env.REACT_APP_PRODUCTION_BASE_URL);
  const shareText = `Think you know more about POLITICS than me? PROVE IT by beating my high score of ${highestStreak} on FactOrFictionTrivia.com!`;
  const handleFbShare = () => {
    window.FB.ui({
      method: "share",
      href: "https://factorfictiontrivia.com",
      quote: shareText,
    });
  };
  return (
    <div className={classNames(styles.container, styles[color])}>
      <Facebook onClick={() => handleFbShare()} />
      {/* <Instagram /> */}
      <a
        href={`https://twitter.com/intent/tweet?text=Think%20you%20know%20more%20about%20POLITICS%20than%20me?%20PROVE%20IT%20by%20beating%20my%20high%20score%20of%20${highestStreak}%20on%20FactOrFictionTrivia.com!`}
      >
        <Twitter />
      </a>

      <Link
        onClick={() => {
          navigator.clipboard.writeText("https://factorfictiontrivia.com");
        }}
      />
    </div>
  );
};

const mapState = (state) => {
  const profile = state.profile;
  return {
    highestStreak: profile.scores.allTime,
  };
};

export default connect(mapState)(SocialShare);
