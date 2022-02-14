import React from "react";
import { Link } from "react-router-dom";
import { Paper } from "@material-ui/core";
import Button from "../Button/Button";
import Owl from "images/large_icon.png";
import styles from "./NoQuestionsAvailable.module.scss";

const NoQuestionsAvailable = () => (
  <Paper className={styles.container}>
    <h1>Uh oh!</h1>
    <h2>You've answered all the available questions</h2>

    <img className={styles.owl} src={Owl} alt="owl" />

    <Link to="/leaderboard">
      <Button>View Leaderboard</Button>
    </Link>
  </Paper>
);

export default NoQuestionsAvailable;
