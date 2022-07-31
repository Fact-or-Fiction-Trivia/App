import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import classNames from "classnames";
import confetti from "canvas-confetti";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./PlayQuiz.module.scss";
import Question from "./Question";
import NoQuestionsAvailable from "./NoQuestionsAvailable";
import Answer from "./Answer";
import EndOfStreak from "./EndOfStreak";
import store from "../../redux/store";

import { clearAnswer } from "../../redux/reducers/question";
import {
  addToStreak,
  createStreak,
  setIsAnswering,
} from "../../redux/reducers/streak";
import AvailableLifelines from "./AvailableLifelines";

const PlayQuiz = ({
  addStreak,
  answeredCorrectly,
  getQuestions,
  hasLifelineOption,
  hootPoints,
  increaseStreak,
  isAnswering,
  isLoading,
  isLoggedIn,
  midAuthentication,
  maxStreak,
  nextQuestion,
  questions,
  streak,
  streakEnded,
  streakLength,
}) => {
  // Timer reference used in the Question -> TimerBar Component
  const timer = useRef(null);
  const interval = useRef(null);
  const [selected, setSelected] = useState(null);

  const clearTimers = () => {
    clearInterval(interval.current);
    clearTimeout(timer.current);
  };
  //Grab the Questions
  useEffect(() => {
    if (questions.length === 0) {
      getQuestions();
    }
    return () => {
      const { streak, streakEnded, isAnswering } = store.getState().streak;
      const { questions } = store.getState().question;
      if (isAnswering) {
        clearTimers();
        if (questions.length) {
          if (isLoggedIn && !streakEnded) {
            addStreak([
              ...streak,
              { questionId: questions[0].id, answeredCorrectly: false },
            ]);
          }
          nextQuestion(questions[0].id);
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // If the previous question has been answered incorrectly
    // it should attempt to add the streak to the user
    if (answeredCorrectly === false && midAuthentication === false) {
      // Only add the streak to the user if they are loggedin
      if (isLoggedIn) {
        addStreak(streak);
      } else {
        // Store the highest streak for a non-logged in user in localStorage so that
        // when the user creates an account, their longest streak can be saved to the db.
        const prevStreak = localStorage.hasOwnProperty("streak")
          ? JSON.parse(localStorage.getItem("streak"))
          : [];
        if (streak.length > prevStreak.length) {
          localStorage.setItem("streak", JSON.stringify(streak));
        }
      }
    }
    // The streak array in redux is updated when the "increaseStreak" method is called
    // from the Question component in the "handleAnswer" method below.
  }, [streak]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (question, answer) => {
    // Clear the setTimeout which is set in the Question -> TimerBar component
    clearInterval(interval.current);
    clearTimeout(timer.current);
    // Add a new object to the streak array on redux state
    increaseStreak({
      questionId: question.id,
      answeredCorrectly: question.answer === answer,
    });

    setSelected(answer);

    setTimeout(() => {
      const contd = document.getElementById("continue");
      contd.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [500]);

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
  const showConfetti =
    !isAnswering &&
    answeredCorrectly &&
    maxStreak > 0 &&
    streakLength === maxStreak + 1;

  showConfetti &&
    confetti({
      angle: 90,
      particleCount: 100,
      spread: 70,
      startVelocity: 55,
      origin: { x: 0.5, y: 1 },
    });
  if (!isLoading && questions.length === 0) {
    return <NoQuestionsAvailable />;
  }

  const handleNextQuestion = (questionId) => {
    setSelected(null);
    nextQuestion(questionId, hootPoints);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.quizContainer}>
      <Paper className={styles.questionContainer}>
        <div className={styles.statsContainer}>
          {!streakEnded && (
            <div className={styles.streakContainer}>
              <span className={styles.streakLabel}>Current streak: </span>
              <span
                className={classNames(
                  styles.streakNum,
                  !isAnswering && answeredCorrectly && styles.bounce
                )}
              >
                {streakLength}
              </span>
            </div>
          )}
        </div>
        {streakEnded ? (
          <>
            {hasLifelineOption ? (
              <AvailableLifelines />
            ) : (
              <EndOfStreak
                longestStreak={maxStreak}
                streakTotal={streak.length}
                streak={streak}
              />
            )}
          </>
        ) : (
          <>
            <Question
              handleAnswer={handleAnswer}
              increaseStreak={increaseStreak}
              isCorrect={answeredCorrectly}
              question={questions[0]}
              selected={selected}
              timer={timer}
              interval={interval}
            />
            {!isAnswering && (
              <Answer
                handleContinue={handleNextQuestion}
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
  const { questions, isLoading } = state.question;
  const {
    answeredCorrectly,
    hasLifelineOption,
    isAnswering,
    maxStreak,
    midAuthentication,
    streak,
    streakEnded,
  } = state.streak;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    answeredCorrectly,
    hasLifelineOption,
    hootPoints: auth.points,
    isAnswering,
    isLoading,
    isLoggedIn,
    midAuthentication,
    maxStreak,
    questions,
    streak,
    streakEnded,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
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
    nextQuestion(questionId, hootPoints) {
      dispatch(clearAnswer(questionId));
      dispatch(setIsAnswering(hootPoints));
    },
    getQuestions() {
      dispatch(fetchQuestions());
    },
  };
};

export default connect(mapState, mapDispatch)(PlayQuiz);
