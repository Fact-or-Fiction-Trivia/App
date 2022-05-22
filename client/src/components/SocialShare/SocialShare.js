import React from "react";
import { connect } from "react-redux";
import { Link, Facebook, Instagram, Twitter } from "@material-ui/icons";
import styles from "./SocialShare.module.scss";

const SocialShare = ({ highestStreak }) => {
  console.log(process.env.REACT_APP_PRODUCTION_BASE_URL);
  const handleFbShare = () => {
    window.FB.ui({
      method: "share",
      href: "https://factorfictiontrivia.com",
      quote: `Think you know more about POLITICS than me? PROVE IT by beating my high score of ${highestStreak} on FactOrFictionTrivia.com!`,
    });
  };
  return (
    <div className={styles.container}>
      <Facebook onClick={() => handleFbShare()} />
      <Instagram />
      <Twitter />
      <Link />
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
