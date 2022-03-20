import React from "react";
import { Button, Fade, Modal } from "@material-ui/core";
import styles from "./QuestionSubmitInstructionsModal.module.scss";

const QuestionSubmitInstructionsModal = ({ open, onClose }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="instruction-modal-title"
  >
    <Fade in={open}>
      <div className={styles.instructionModal}>
        <h2 id="instruction-modal-title">
          Example of <span className={styles.green}>accepted</span> question:
        </h2>
        <p>
          <b>Q: </b> Joe Biden is the current President.
        </p>
        <p>
          <b>A: </b> FACT
        </p>
        <p>
          <b>Explanation: </b> Biden was elected in 2020 as the 46th President.
        </p>
        <p>
          <b>Source: </b>
          <a href="http://whitehouse.gov">whitehouse.gov</a>
        </p>
        <h2 id="instruction-modal-title">
          Example of <span className={styles.red}>rejected</span> question:
        </h2>
        <p>
          <b>Q: </b> Joe Biden is a demonic alien.
        </p>
        <p>
          <b>A: </b> FACT
        </p>
        <p>
          <b>Explanation: </b> Biden is doing Satan's work and doesn't represent
          my opinions.
        </p>
        <p>
          <b>Source: </b>
          The voices in my head
        </p>
        <p>Opinions are different from facts - we only want the latter!</p>
        <Button color="primary" onClick={onClose} variant="contained">
          Close
        </Button>
      </div>
    </Fade>
  </Modal>
);

export default QuestionSubmitInstructionsModal;
