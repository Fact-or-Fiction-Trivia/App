import React, { useState } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Link, Facebook, Instagram, Twitter } from "@material-ui/icons";
import styles from "./SocialShare.module.scss";
import InstagramShare from "./InstagramShare";

const SocialShare = ({
  color,
  highestStreak,
  shouldShowInstagram,
  streakLength,
}) => {
  const analytics = getAnalytics();

  const [igModalOpen, setIgModalOpen] = useState(false);
  const streakToShare =
    streakLength > highestStreak ? streakLength : highestStreak;
  const highScoreText = streakToShare ? `of ${streakToShare}` : "";
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
      <Facebook
        onClick={() => {
          logEvent(analytics, "facebook_share", {
            event_name: "fb_share_button_clicked",
          });
          handleFbShare();
        }}
      />
      {/* only show instagram on mobile for now, can revisit */}
      {process.env.REACT_APP_ENABLE_IG_SHARING === "true" &&
        shouldShowInstagram &&
        window.innerWidth < 576 && (
          <Instagram
            onClick={() => {
              logEvent(analytics, "instagram_share", {
                event_name: "image_downloaded",
              });

              setIgModalOpen(true);
            }}
          />
        )}
      <a
        href={`https://twitter.com/intent/tweet?text=Think%20you%20know%20more%20about%20POLITICS%20than%20me?%20PROVE%20IT%20by%20beating%20my%20high%20score%20of%20${streakToShare}%20on%20FactOrFictionTrivia.com!`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          logEvent(analytics, "twitter_share", {
            event_name: "twitter_share_button_clicked",
          });
        }}
      >
        <Twitter />
      </a>

      <Link
        onClick={() => {
          logEvent(analytics, "link_copied", {
            event_name: "link_copied",
          });
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
