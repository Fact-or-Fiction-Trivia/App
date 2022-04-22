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

import Button from "../Button/Button";
import classNames from "classnames";

import styles from "../QuestionSubmit/QuestionSubmit.module.scss";
import { Link } from "react-router-dom";
import { createAdminQuestion } from "../../redux/reducers/admin";
import { getTags } from "../../redux/reducers/tag";
const AdminCreateQuestion = ({ getTags, tags, createQuestion }) => {
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

  useEffect(() => {
    getTags();
  }, [getTags]);

  const handleChangeQuestion = ({ target: { name, value } }) => {
    setQuestionData({ ...questionData, [name]: value });
  };
  const handleSubmit = () => {
    createQuestion({
      questionData: {
        ...questionData,
        expiration: questionExpires ? questionData.expiration : null,
      },
      questionTagIds,
    });
  };

  return (
    <Paper className={classNames(styles.pageStyle, styles.submitForm)}>
      <Helmet>
        <title>Questions List</title>
      </Helmet>
      <div>
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
  const { tags } = state.tag;
  return { tags };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTags() {
      dispatch(getTags());
    },
    createQuestion(data) {
      dispatch(createAdminQuestion(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminCreateQuestion);
