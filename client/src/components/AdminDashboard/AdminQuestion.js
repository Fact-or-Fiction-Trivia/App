import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import {
  Button as MaterialButton,
  FormHelperText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";

import classNames from "classnames";

import styles from "../QuestionSubmit/QuestionSubmit.module.scss";
import {
  fetchAdminQuestion,
  updateAdminQuestion,
} from "../../redux/reducers/admin";
import { getTags } from "../../redux/reducers/tag";

// TODO: don't reuse styles from question submit form, this defeats the whole purpose of modules
import dashboardStyles from "./dashboard.module.scss";

const AdminQuestion = ({
  match,
  getTags,
  tags,
  getQuestion,
  question,
  updateQuestion,
}) => {
  const [questionData, setQuestionData] = useState({
    text: "",
    answer: "",
    explanation: "",
    source: "",
    expiration: "",
    status: "Approved",
  });
  const [questionTagIds, setQuestionTagIds] = useState([]);
  const [questionExpires, setQuestionExpires] = useState(false);
  const { questionId } = match.params;

  useEffect(() => {
    getTags();
    getQuestion({
      questionId,
      cb(question) {
        mapQuestionToState(question);
      },
    });
  }, [getTags, getQuestion, questionId]);

  const handleChangeQuestion = ({ target: { name, value } }) => {
    setQuestionData({ ...questionData, [name]: value });
  };
  const handleSubmit = () => {
    updateQuestion({
      questionId,
      body: {
        questionData: {
          ...questionData,
          expiration: questionExpires ? questionData.expiration : null,
        },
        questionTagIds,
      },
      cb(question) {
        mapQuestionToState(question);
      },
    });
  };

  const mapQuestionToState = (question) => {
    setQuestionData({
      text: question.text,
      answer: question.answer,
      explanation: question.explanation,
      source: question.source,
      expiration:
        question.expiration === null ? "" : question.expiration.split("T")[0],
      status: question.status,
    });
    setQuestionTagIds(question.tags.map((tag) => tag.id));
    setQuestionExpires(question.expiresIn !== undefined);
  };

  return (
    <Paper
      className={classNames(
        styles.pageStyle,
        styles.submitForm,
        dashboardStyles.questionSubmitTO_FIX
      )}
    >
      <Helmet>
        <title>Questions List</title>
      </Helmet>
      <div>
        <div className={styles.formHeader}>
          <h1>Edit Question</h1>
        </div>
        <form>
          <TextField
            fullWidth
            label="Question"
            onChange={handleChangeQuestion}
            type="text"
            name="text"
            value={questionData.text}
            variant="outlined"
          />

          <Select
            fullWidth
            label="Answer"
            labelId="submit-answer"
            onChange={handleChangeQuestion}
            name="answer"
            value={questionData.answer}
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
            onChange={handleChangeQuestion}
            rows={4}
            type="text"
            name="explanation"
            value={questionData.explanation}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Question source"
            onChange={handleChangeQuestion}
            type="text"
            name="source"
            value={questionData.source}
            variant="outlined"
          />
          <FormHelperText>
            Please provide a link to a source verifying that this information is
            correct.
          </FormHelperText>

          <Select
            fullWidth
            label="Category"
            multiple={true}
            labelId="question-category"
            onChange={({ target: { value } }) => {
              setQuestionTagIds(value);
            }}
            value={questionTagIds}
            variant="outlined"
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select a category for your question</FormHelperText>
          <p>
            {question.hasExpired
              ? "Expired"
              : question.expiresIn === undefined
              ? "Never expires"
              : `Expires in ${question.expiresIn} days`}
          </p>
          <FormControlLabel
            control={
              <Checkbox
                checked={questionExpires}
                onChange={({ target: { checked } }) =>
                  setQuestionExpires(checked)
                }
              />
            }
            label="Expires"
          />
          {questionExpires && (
            <input
              type="date"
              name="expiration"
              value={questionData.expiration}
              onChange={handleChangeQuestion}
            />
          )}
          <Select
            fullWidth
            label="Status"
            labelId="question-status"
            onChange={handleChangeQuestion}
            name="status"
            value={questionData.status}
            variant="outlined"
          >
            <MenuItem value={"Approved"}>Approved</MenuItem>
            <MenuItem value={"Denied"}>Denied</MenuItem>
            <MenuItem value={"Pending"}>Pending</MenuItem>
            <MenuItem value={"Withdrawn"}>Withdrawn</MenuItem>
          </Select>
        </form>
        <MaterialButton
          className={styles.formSubmitButton}
          onClick={handleSubmit}
          disabled={
            questionData.text === "" ||
            questionData.answer === "" ||
            questionData.source === ""
          }
          color="primary"
          variant="contained"
          id="form-submit"
        >
          Submit
        </MaterialButton>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state) => {
  const { question } = state.admin;
  const { tags } = state.tag;
  return { question, tags };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTags() {
      dispatch(getTags());
    },
    getQuestion(data) {
      dispatch(fetchAdminQuestion(data));
    },
    updateQuestion(data) {
      dispatch(updateAdminQuestion(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestion);
