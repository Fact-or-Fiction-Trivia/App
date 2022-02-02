import React from "react";

import Button from "@material-ui/core/Button";
import { createBrowserHistory } from "history";

const TodaysQuizButton = ({ disabled, loading }) => {
  const history = createBrowserHistory();
  return (
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
  );
};

export default TodaysQuizButton;
