import React from "react";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import { LANDING } from "../../constants/routes";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import styles from "./NoMatch.module.scss";
import bg from "./politiq-bg2.jpg";

const NoMatch = () => (
  <Paper className={styles.container}>
    <h2>Uh oh! The page you're looking for does not exist.</h2>

    <MediaQuery minWidth={416}>
      <Link to={LANDING}>
        <h3 className={styles.noMatchLink}>
          Click here to return to the home page
        </h3>
      </Link>
    </MediaQuery>
    <MediaQuery maxWidth={415}>
      <Link to={LANDING}>
        <Button color="primary" variant="contained">
          Return to Home Page
        </Button>
      </Link>
    </MediaQuery>
    <img src={bg} id="bg-image" alt="democrats and republicans face off" />
  </Paper>
);

export default NoMatch;
