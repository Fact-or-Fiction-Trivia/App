import React, { useState } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { Link, Facebook, Instagram, Twitter } from "@material-ui/icons";
import styles from "./SocialShare.module.scss";
import InstagramShare from "./InstagramShare";

const SocialShare = ({
  color,
  highestStreak,
  shouldShowInstagram,
  streakLength,
}) => {
  const [igModalOpen, setIgModalOpen] = useState(false);
  const highScoreText = highestStreak
    ? `of ${streakLength > highestStreak ? streakLength : highestStreak}`
    : "";
  const shareText = `Think you know more about POLITICS than me? PROVE IT by beating my high score ${highScoreText} on FactOrFictionTrivia.com!`;
  const handleFbShare = () => {
    window.FB.ui({
      method: "share",
      href: "https://factorfictiontrivia.com",
      quote: shareText,
    });
  };

  return (
    <div className={classNames(styles.container, styles[color])}>
      <InstagramShare
        open={igModalOpen}
        handleClose={() => setIgModalOpen(false)}
        shareText={shareText}
      />
      <Facebook onClick={() => handleFbShare()} />
      {/* only show instagram on mobile for now, can revisit */}
      {shouldShowInstagram && window.innerWidth < 576 && (
        <Instagram
          onClick={() => {
            setIgModalOpen(true);
          }}
        />
      )}
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
  const { maxStreak, streak } = state.streak;
  return {
    highestStreak: maxStreak,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
  };
};

export default connect(mapState)(SocialShare);
