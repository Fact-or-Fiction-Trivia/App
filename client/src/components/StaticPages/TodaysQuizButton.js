import React from "react";

import Button from "@material-ui/core/Button";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

const TodaysQuizButton = ({ disabled, loading }) => {
  const history = createBrowserHistory();

  if (disabled || loading) {
    return (
      <Button
        color="primary"
        variant="contained"
        size="large"
        id="archive-link"
        disabled={true}
      >
        {loading ? "Loading..." : "Play Now"}
      </Button>
    );
  } else {
    return (
      <Link to="/play">
        <Button
          color="primary"
          variant="contained"
          size="large"
          id="archive-link"
          disabled={disabled || loading}
          onClick={() => !disabled && history.push("/play")}
        >
          {loading ? "Loading..." : "Play Now"}
        </Button>
      </Link>
    );
  }
};

export default TodaysQuizButton;
