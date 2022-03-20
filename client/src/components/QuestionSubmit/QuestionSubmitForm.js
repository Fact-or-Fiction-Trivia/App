import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import {
  Button as MaterialButton,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@material-ui/core";
import Button from "../Button/Button";
import classNames from "classnames";
import {
  ABOUT,
  LEADERBOARD,
  SIGN_IN,
  SUBMIT_QUESTION,
} from "../../constants/routes";
import styles from "./QuestionSubmit.module.scss";
import { submitQuestionByUser } from "../../redux/reducers/question";
import { getTags } from "../../redux/reducers/tag";
import { setAuthMessage, setPostAuthRedirect } from "../../redux/reducers/auth";
import QuestionSubmitInstructionsModal from "./QuestionSubmitInstructionsModal";

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
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

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
      <QuestionSubmitInstructionsModal
        open={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
      />
      {submitted ? (
        <div className={styles.afterSubmit}>
          <h2>Thank you for your submission.</h2>
          <MaterialButton
            variant="contained"
            color="primary"
            className={styles.submittedButtons}
            onClick={() => reset()}
          >
            Submit another question
          </MaterialButton>
          <Link to={LEADERBOARD} style={{ textDecoration: "none" }}>
            <MaterialButton
              variant="contained"
              color="primary"
              className={styles.submittedButtons}
            >
              Done
            </MaterialButton>
          </Link>
        </div>
      ) : (
        <div>
          <div className={styles.formHeader}>
            <h1>Submit a Question</h1>

            <h3>
              Did you find a piece of news that everyone should know about?
            </h3>
            <p className={styles.instructions}>
              As long as it meets the criteria below, it will be accepted and
              you will receive additional points.
            </p>
            <p className={styles.emphasis}>Accepted questions must be:</p>
            <ol>
              <li>
                <b>related to politics</b> (we don't care about what Pete
                Davidson did yesterday...)
              </li>
              <li>
                <b>verified by a reliable source</b> (see{" "}
                <Link to={ABOUT}>About/FAQ</Link> page for what kind of sources
                are accepted)
              </li>
              <li>
                <b>as objective as possible</b> (we're trying to inform folks,
                not fuel the partisan divide)
              </li>
            </ol>
            <Button
              onClick={() => setShowInstructionsModal(true)}
              variant="link"
            >
              See an example
            </Button>
          </div>
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
          <MaterialButton
            className={styles.formSubmitButton}
            onClick={handleSubmit}
            disabled={text === "" || answer === "" || source === ""}
            color="primary"
            variant="contained"
            id="form-submit"
          >
            Submit
          </MaterialButton>
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
