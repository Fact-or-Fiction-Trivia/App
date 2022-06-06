import React from "react";
import classNames from "classnames";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Facebook, Instagram, Twitter } from "@material-ui/icons";
import styles from "./SocialShare.module.scss";

const SocialFollow = ({ color }) => {
  const analytics = getAnalytics();

  return (
    <div className={classNames(styles.container, styles[color])}>
      <a
        href="https://www.facebook.com/FOFtrivia"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          logEvent(analytics, "facebook_follow", {
            event_name: "fb_follow_button_clicked",
          })
        }
      >
        <Facebook />
      </a>
      <a
        href="https://www.instagram.com/foftrivia/?hl=en"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          logEvent(analytics, "instagram_follow", {
            event_name: "ig_follow_button_clicked",
          })
        }
      >
        <Instagram />
      </a>
      <a
        href="https://twitter.com/PolitiqT"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          logEvent(analytics, "twitter_follow", {
            event_name: "twitter_follow_button_clicked",
          })
        }
      >
        <Twitter />
      </a>
    </div>
  );
};

export default SocialFollow;
