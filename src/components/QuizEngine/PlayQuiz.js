import React, { useEffect, useState } from "react";
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
  resetQuiz,
} from "../../redux/reducers/streak";

const PlayQuiz = ({
  streak,
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
  getStreakHistory,
  setLongestStreak,
  nextQuestion,
}) => {
  // const [isAnswering, setIsAnswering] = useState(true);
  // const [isEndOfStreak, setIsEndOfStreak] = useState(false);
  //const [answeredCorrectly, setAnsweredCorrectly] = useState(undefined);
  // const [streak, setStreak] = useState([]);
  // const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    // if there aren't questions already, fetch them
    if (questions.length === 0) {
      getQuestions();
    }
    if (isLoggedIn) {
      getStreakHistory();
    } else {
      localStreak();
    }
  }, []);

  useEffect(() => {
    if (streakEnded) {
      if (isLoggedIn) {
        addStreak(streak);
      } else {
        //Local
      }
    }
  }, [streak]);

  // TODO: timer
  // TODO: QUESTION REFETCH
  // TODO: handle no questions remaining

  // we want to show the user's highest streak and their current streak
  // if they are logged in, pull it from the streaks table
  // if they are not logged in, use the highest streak from local storage
  const localStreak = () => {
    if (localStorage.hasOwnProperty("streaks")) {
      const streaks = JSON.parse(localStorage.getItem("streaks"));
      // get the longest streak
      let longStreak = 0;

      streaks.forEach((streak) => {
        // subtract one for the non-logged in user because we also store the questions that they answered incorrectly as part of the streak
        if (streak.length - 1 > longStreak) {
          longStreak = streak.length - 1;
        }
      });

      setLongestStreak(longStreak);
    }
  };

  const handleClick = (question, answer) => {
    // console.log(question, answer);
    increaseStreak({
      questionId: question.id,
      answeredCorrectly: question.answer === answer,
    });
    answered(question.id);
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
          <div className={styles.streakContainer}>
            <div>{streak.length} correct in a row</div>
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
              <Question question={questions[0]} handleClick={handleClick} />
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
  const {
    streak,
    maxStreak,
    streakEnded,
    isAnswering,
    answeredCorrectly,
  } = state.streak;
  const { auth } = state.auth;
  const isLoggedIn = !!auth.id;
  return {
    streak,
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
    getStreakHistory() {
      dispatch(getMaxStreakForUser());
    },
    setLongestStreak(score) {
      dispatch(setMaxScore(score));
    },
  };
};

export default connect(mapState, mapDispatch)(PlayQuiz);
