import React, { useState } from "react";
import { connect } from "react-redux";

import { Button, Fade, Modal, TextField } from "@material-ui/core";
import { subscribeToEmails } from "../../redux/reducers/profile";
import styles from "./PrelaunchModal.module.scss";
import owl from "../../images/excited_owl.gif";

const PrelaunchModal = ({ open, onClose, subscribe }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (email === "") {
      setError(true);
    } else {
      subscribe(email);
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="prelaunch-modal-title"
    >
      <Fade in={open}>
        <div className={styles.prelaunchModal}>
          <h1 id="prelaunch-modal-title">
            Thanks for your interest in Fact or Fiction!
          </h1>
          <img
            className={styles.owl}
            src={owl}
            alt="Our owl is very excited that you're here!"
          ></img>
          <p>
            We are still in the process of updating our site, so please leave
            your email to be the first to know once we are live:
          </p>
          <TextField
            aria-labelledby="prelaunch-email"
            fullWidth
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            label="Your email here"
          />
          {error && (
            <p className={styles.error}>Please provide your email address</p>
          )}
          <div className={styles.buttonContainer}>
            <Button onClick={onClose}>Close</Button>
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Get updates
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

const mapDispatch = (dispatch) => {
  return {
    async subscribe(email) {
      await dispatch(subscribeToEmails(email));
    },
  };
};

export default connect(null, mapDispatch)(PrelaunchModal);
