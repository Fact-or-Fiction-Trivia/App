import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
import classNames from "classnames";
import { LEADERBOARD, SIGN_IN, SUBMIT_QUESTION } from "../../constants/routes";
import styles from "./QuestionSubmit.module.scss";
import { submitQuestionByUser } from "../../redux/reducers/question";
import { getTags } from "../../redux/reducers/tag";
import { setAuthMessage, setPostAuthRedirect } from "../../redux/reducers/auth";

const QuestionSubmitForm = ({
  isLoggedIn,
  onLoad,
  setRedirect,
  submitQuestion,
  tags,
}) => {
  const history = useHistory();
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [source, setSource] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [tagId, setTagId] = useState("");

  useEffect(() => {
    onLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    setSubmitted(true);
    submitQuestion({
      answer,
      explanation,
      source,
      tagId,
      text,
    });
  };

  const reset = () => {
    setText("");
    setAnswer(undefined);
    setSource("");
    setSubmitted(false);
    setExplanation("");
  };

  if (!isLoggedIn) {
    setRedirect(SUBMIT_QUESTION, "You must be logged in to submit a question");
    history.push(SIGN_IN);
  }

  return (
    <Paper className={classNames(styles.pageStyle, styles.submitForm)}>
      <Helmet>
        <title>Submit Question | Fact or Fiction trivia</title>
      </Helmet>
      {submitted ? (
        <div className={styles.afterSubmit}>
          <h2>Thank you for your submission.</h2>
          <Button
            variant="contained"
            color="primary"
            className={styles.submittedButtons}
            onClick={() => reset()}
          >
            Submit another question
          </Button>
          <Link to={LEADERBOARD} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              className={styles.submittedButtons}
            >
              Done
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className={styles.formHeader}>
            <h1>Submit a Question</h1>
          </div>
          <h3>Did you find a piece of news that everyone should know about?</h3>
          <p className={styles.instructions}>
            {" "}
            Add <b>3 points</b> to your score by dropping it below. We’ll review
            it and add it to the <b>next</b> quiz if its accepted. <b>Please</b>{" "}
            be sure to verify your information with a reliable source.
          </p>
          <form>
            <TextField
              fullWidth
              label="Question"
              onChange={(event) => setText(event.target.value)}
              type="text"
              value={text}
              variant="outlined"
            />

            <Select
              fullWidth
              label="Answer"
              labelId="submit-answer"
              onChange={(event) => setAnswer(event.target.value)}
              value={answer}
              variant="outlined"
            >
              <MenuItem default value={""}>
                <em>Select the correct answer</em>
              </MenuItem>
              <MenuItem value={"Fact"}>Fact</MenuItem>
              <MenuItem value={"Fiction"}>Fiction</MenuItem>
            </Select>
            <FormHelperText>Is this statement Fact or Fiction?</FormHelperText>
            <TextField
              fullWidth
              label="Explain why this answer is correct"
              multiline
              onChange={(event) => setExplanation(event.target.value)}
              rows={4}
              type="text"
              value={explanation}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Question source"
              onChange={(event) => setSource(event.target.value)}
              type="text"
              value={source}
              variant="outlined"
            />
            <FormHelperText>
              Please provide a link to a source verifying that this information
              is correct.
            </FormHelperText>

            <Select
              fullWidth
              label="Category"
              labelId="question-category"
              onChange={(event) => setTagId(event.target.value)}
              value={tagId}
              variant="outlined"
            >
              <MenuItem default value={""}>
                <em>Category</em>
              </MenuItem>
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select a category for your question</FormHelperText>
          </form>
          <Button
            className={styles.formSubmitButton}
            onClick={handleSubmit}
            disabled={text === "" || answer === "" || source === ""}
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
  const { tags } = state.tag;

  return {
    isLoggedIn,
    tags,
  };
};
const mapDispatch = (dispatch) => {
  return {
    onLoad() {
      dispatch(getTags());
    },
    setRedirect(redirect, message) {
      dispatch(setPostAuthRedirect(redirect));
      dispatch(setAuthMessage(message));
    },
    submitQuestion(question) {
      dispatch(submitQuestionByUser(question));
    },
  };
};
export default connect(mapState, mapDispatch)(QuestionSubmitForm);
