import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import {
  Button,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";

import { LANDING } from "../../constants/routes";
import "./form.css";

const QuestionSubmitForm = ({ isLoggedIn }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(undefined);
  const [source, setSource] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    // todo
  };

  const reset = () => {
    setQuestion("");
    setAnswer(undefined);
    setSource("");
    setSubmitted(false);
  };

  if (!isLoggedIn) {
    alert("you have to be logged in pal");
  }

  return (
    <Paper className="pageStyle submitForm">
      <Helmet>
        <title>Submit Question | Fact or Fiction trivia</title>
      </Helmet>
      {submitted ? (
        <div className="afterSubmit">
          <h2>Thank you for your submission.</h2>
          <Button
            variant="contained"
            color="primary"
            className="submittedButtons"
            onClick={() => reset()}
          >
            Submit another question
          </Button>
          <Link to={LANDING} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              className="submittedButtons"
            >
              Done
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="formHeader">
            <h1>Submit a Question</h1>
          </div>
          <h3 style={{ marginTop: "5vh", textAlign: "center" }}>
            Did you find a piece of news that everyone should know about?
          </h3>
          <p className="instructions">
            {" "}
            Add <span style={{ fontWeight: "bold" }}>3 points</span> to your
            score by dropping it below. We’ll review it and add it to the{" "}
            <span style={{ fontWeight: "bold" }}>next</span> quiz if its
            accepted. <span style={{ fontWeight: "bold" }}>Please</span> be sure
            to verify your information with a reliable source.
          </p>
          <form>
            <TextField
              margin="normal"
              fullWidth
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              type="text"
              label="Question"
            />

            <Select
              fullWidth
              margin="normal"
              value={answer}
              label="Answer"
              labelId="submit-answer"
              onChange={(event) => setAnswer(event.target.value)}
            >
              <MenuItem default value={undefined}>
                <em>Select the correct answer</em>
              </MenuItem>
              <MenuItem value={"Fact"}>Fact</MenuItem>
              <MenuItem value={"Fiction"}>Fiction</MenuItem>
            </Select>
            <FormHelperText>Is this statement Fact or Fiction?</FormHelperText>

            <TextField
              margin="normal"
              fullWidth
              value={source}
              onChange={(event) => setSource(event.target.value)}
              type="text"
              label="Please provide a link to a source verifying that this information is correct."
            />
          </form>
          <Button
            onClick={handleSubmit}
            disabled={question === "" || answer === undefined || source === ""}
            color="primary"
            variant="contained"
            id="form-submit"
          >
            Submit
          </Button>
        </div>
      )}
    </Paper>
  );
};

const mapState = (state) => {
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;

  return {
    isLoggedIn,
  };
};
const mapDispatch = (dispatch) => {
  return {};
};
export default connect(mapState, mapDispatch)(QuestionSubmitForm);
