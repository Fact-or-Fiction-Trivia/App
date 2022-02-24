import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./PlayQuiz.module.scss";
import Question from "./Question";
import Answer from "./Answer";
import EndOfStreak from "./EndOfStreak";

import { clearAnswer } from "../../redux/reducers/question";
import {
  addToStreak,
  createStreak,
  getMaxStreakForUser,
  setIsAnswering,
  setMaxScore,
} from "../../redux/reducers/streak";

const PlayQuiz = ({
  streak,
  streakLength,
  streakEnded,
  addStreak,
  increaseStreak,
  isAnswering,
  answeredCorrectly,
  answered,
  isLoggedIn,
  maxStreak,
  questions,
  getQuestions,
  nextQuestion,
}) => {
  // Timer reference used in the Question -> TimerBar Component
  const timer = useRef(null);

  //Grab the Questions
  useEffect(() => {
    if (questions.length === 0) {
      getQuestions();
    }
  }, []);

  useEffect(() => {
    // If the previous question has been answered incorrectly
    // it should attempt to add the streak to the user
    if (answeredCorrectly === false) {
      // Only add the streak to the user if they are loggedin
      if (isLoggedIn) {
        addStreak(streak);
      }
    }
    // The streak array in redux is updated when the "increaseStreak" method is called
    // from the Question component in the "handleAnswer" method below.
  }, [streak]);

  const handleAnswer = (question, answer) => {
    // Clear the setTimeout which is set in the Question -> TimerBar component
    clearTimeout(timer.current);
    // Add a new object to the streak array on redux state
    increaseStreak({
      questionId: question.id,
      answeredCorrectly: question.answer === answer,
    });

    // Remove this question from the questions array on redux state.
    answered(question.id);

    // This action creator in the redux question slice also adds the
    // question id to localstorage so that the user will never see
    // it in play again (managed server side)

    // This works for non-logged in users and
    // additionally it is used in the case where:
    // 1. Non-logged in user answers a few questions (1st Set)
    // 2. Decides to skip and play again (not saving
    // these questions to the database)
    // 3. Answers a few more questions (2nd Set)
    // 4. Decides to signin/signup (saving the 2nd Set of questions to the db)

    // If the (now) loggedin user reloads the page, they would see the questions
    // from the 1st Set of answered questions again.
    // To handle this, we pass up the locallyAnsweredQuestionIds array
    // to the getQuestions API route and filter out the results for non-loggedin
    // users with the locallyAnsweredQuestionIds array alone and
    // additionally, filter out the results for loggedin users with the
    // locallyAnsweredQuestionIds AND userAnsweredQuestionsIds array(s)
  };

  if (questions.length === 0) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.quizContainer}>
      <Paper className={styles.questionContainer}>
        <div className={styles.statsContainer}>
          <div className={styles.streakContainer}>
            <div>{streakLength} correct in a row</div>
            <div>Longest streak: {maxStreak} </div>
          </div>
        </div>
        {streakEnded ? (
          <EndOfStreak
            addStreak={addStreak}
            longestStreak={maxStreak}
            streakTotal={streak.length}
            streak={streak}
          />
        ) : (
          <>
            {isAnswering ? (
              <Question
                question={questions[0]}
                handleAnswer={handleAnswer}
                timer={timer}
                increaseStreak={increaseStreak}
                answered={answered}
              />
            ) : (
              <Answer
                handleContinue={nextQuestion}
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
  const { streak, maxStreak, streakEnded, isAnswering, answeredCorrectly } =
    state.streak;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    streak,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
    isAnswering,
    answeredCorrectly,
    isLoggedIn,
    maxStreak,
    streakEnded,
    questions,
  };
};

const mapDispatch = (dispatch) => {
  return {
    addStreak(body) {
      dispatch(createStreak(body));
    },
    increaseStreak(data) {
      dispatch(addToStreak(data));
    },
    nextQuestion() {
      dispatch(setIsAnswering());
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
