import { getAnalytics, logEvent } from "firebase/analytics";
import React from "react";
import Button from "../Button/Button";
import fight from "../StaticPages/politiq-bg2.jpg";

import styles from "./InGameAds.module.scss";

const InGameAds = ({ onCloseAd }) => {
  const analytics = getAnalytics();
  return (
    <div className={styles.adContainer}>
      <h1>Did you know?</h1>
      <h2>
        While federal issues get the most news coverage, you can make the
        biggest difference by voting in local elections.
      </h2>
      <a
        href="https://www.vote.org/"
        rel="noopener noreferrer"
        target="_blank"
        onClick={() => {
          logEvent(analytics, "vote_clicked", {
            event_name: "vote_clicked",
          });
        }}
      >
        <Button variant="primary">Find your nearest upcoming election</Button>
      </a>
      <Button variant="black" onClick={() => onCloseAd()}>
        Skip & Continue Playing
      </Button>
      <img src={fight} alt="Elephant and Donkey Fighting" />
    </div>
  );
};

export default InGameAds;
