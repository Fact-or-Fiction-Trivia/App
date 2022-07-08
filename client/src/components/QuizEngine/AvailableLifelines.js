import React from "react";
import styles from "./AvailableLifelines.module.scss";
import owl from "../../images/pointing_owl.gif";
import Button from "../Button/Button";

const AvailableLifelines = ({ streak }) => (
  <div className={styles.container}>
    <h1>Preserve your streak!</h1>
    <div className={styles.streakContainer}>
      <span className={styles.streak}>{streak}</span>
      <img
        className={styles.owl}
        src={owl}
        alt={`Owl pointing to the left towards your streak of ${streak}`}
      />
    </div>
    <div className={styles.buttonContainer}>
      <Button variant="primary">Keep playing for 1 hoot point</Button>
      <Button variant="black">End my streak and play again</Button>
    </div>
  </div>
);

export default AvailableLifelines;
