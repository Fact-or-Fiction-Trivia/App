import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./PlayQuiz.module.scss";
import Question from "./Question";
import Answer from "./Answer";
import EndOfStreak from "./EndOfStreak";

import { clearAnswer } from "../../redux/reducers/question";
import { createStreak } from "../../redux/reducers/streak";

const PlayQuiz = ({ addStreak, answered, questions, getQuestions }) => {
  const [isAnswering, setIsAnswering] = useState(true);
  const [isEndOfStreak, setIsEndOfStreak] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(undefined);
  const [streak, setStreak] = useState([]);

  useEffect(() => {
    // if there aren't questions already, fetch them
    if (questions.length === 0) {
      getQuestions();
    }
  }, []);

  // TODO: timer
  // TODO: login widget at end of streak
  // TODO: QUESTION REFETCH

  // tODO: scoring
  // we want to show the user's highest streak and their current streak
  // if they are logged in, pull it from the streaks table
  // if they are not logged in, use the highest streak from local storage

  const handleClick = (question, answer) => {
    if (question.answer === answer) {
      setStreak([
        ...streak,
        { questionId: question.id, answeredCorrectly: true },
      ]);
      setIsAnswering(false);
      setAnsweredCorrectly(true);
    } else {
      addStreak([
        ...streak,
        { questionId: question.id, answeredCorrectly: false },
      ]);
      setStreak([]);
      setIsAnswering(false);
      setAnsweredCorrectly(false);
    }
  };

  const handleCorrectContinueClick = (question) => {
    // update the question stack to remove the one the user just answered
    answered(question.id);
    // reset to show the next question
    setIsAnswering(true);
    setAnsweredCorrectly(undefined);
    setIsEndOfStreak(true);
  };

  const handleIncorrectContinueClick = (question) => {
    // update the question stack to remove the one the user just answered
    answered(question.id);
    // reset quiz values and show end of streak screens
    setIsAnswering(true);
    setAnsweredCorrectly(undefined);
    setIsEndOfStreak(true);
  };

  const resetQuiz = () => {
    // if not logged in, save the streak in local storage
    // reset the quiz
    setIsEndOfStreak(false);
    setStreak([]);
  };

  if (questions.length === 0) {
    return <div>Loading ...</div>;
  }

  // we'll always be looking at questions[0] here, since we will remove the answered
  // questions from the question stack when the user completes an answer

  // if the user is answering, show them the question with the button options
  // if they have answered, show them the explanation and whether they were right or wrong

  // if they were wrong, they can hit continue from the answer screen to reach the end of streak view
  // on the end of streak view:
  //      if they are logged in: they can view their streak (compared with their other streaks) and choose to keep playing or view leaderboard
  //      if they are not logged in: they can choose to log in to save their streak, play again, or view leaderboard
  return (
    <div className={styles.quizContainer}>
      <Paper className={styles.questionContainer}>
        <div className={styles.statsContainer}>
          <div>timer - todo</div>
          <div>{streak.length} correct in a row</div>
        </div>
        {isEndOfStreak ? (
          <EndOfStreak resetQuiz={resetQuiz} streakTotal={streak.length} />
        ) : (
          <>
            {isAnswering ? (
              <Question question={questions[0]} handleClick={handleClick} />
            ) : (
              <Answer
                handleCorrectContinueClick={handleCorrectContinueClick}
                handleIncorrectContinueClick={handleIncorrectContinueClick}
                isCorrect={answeredCorrectly}
                question={questions[0]}
              />
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

const mapState = (state) => {
  const { questions } = state.question;
  return {
    questions,
  };
};

const mapDispatch = (dispatch) => {
  return {
    addStreak(body) {
      dispatch(createStreak(body));
    },
    answered(questionId) {
      dispatch(clearAnswer(questionId));
    },
    getQuestions() {
      dispatch(fetchQuestions());
    },
  };
};

export default connect(mapState, mapDispatch)(PlayQuiz);
