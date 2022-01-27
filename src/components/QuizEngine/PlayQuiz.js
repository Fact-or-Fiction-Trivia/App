import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Paper } from "@material-ui/core";
import { fetchQuestions } from "../../redux/reducers/question";
import styles from "./PlayQuiz.module.scss";
import Question from "./Question";
import Answer from "./Answer";
import EndOfStreak from "./EndOfStreak";

import { clearAnswer } from "../../redux/reducers/question";
import { createStreak, getMaxStreakForUser } from "../../redux/reducers/streak";

const PlayQuiz = ({
  addStreak,
  answered,
  auth,
  maxStreak,
  questions,
  getQuestions,
  getStreakHistory,
}) => {
  const [isAnswering, setIsAnswering] = useState(true);
  const [isEndOfStreak, setIsEndOfStreak] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(undefined);
  const [streak, setStreak] = useState([]);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    // if there aren't questions already, fetch them
    if (questions.length === 0) {
      getQuestions();
    }
    if (auth.loggedIn) {
      getStreakHistory();
    }
    loadStreak(auth);
  }, []);

  useEffect(() => {
    // load the streak history when the user logs in
    getStreakHistory(auth.id);
  }, [auth.id]);

  useEffect(() => {
    // when the max streak changes, update the UI
    if (maxStreak) {
      setLongestStreak(maxStreak.score);
    }
  }, [maxStreak]);

  // TODO: timer
  // TODO: QUESTION REFETCH
  // TODO: handle no questions remaining

  // we want to show the user's highest streak and their current streak
  // if they are logged in, pull it from the streaks table
  // if they are not logged in, use the highest streak from local storage
  const loadStreak = (auth) => {
    if (auth.loggedIn) {
      if (maxStreak) {
        setLongestStreak(maxStreak.score);
      }
    } else {
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
    }
  };

  const handleClick = (question, answer) => {
    if (question.answer === answer) {
      setStreak([
        ...streak,
        { questionId: question.id, answeredCorrectly: true },
      ]);
      setIsAnswering(false);
      setAnsweredCorrectly(true);
    } else {
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
  };

  const handleIncorrectContinueClick = (question) => {
    const newStreak = [
      ...streak,
      { questionId: question.id, answeredCorrectly: false },
    ];
    if (auth.loggedIn) {
      addStreak(newStreak);
    } else {
      const pastStreaks = localStorage.hasOwnProperty("streaks")
        ? JSON.parse(localStorage.getItem("streaks"))
        : [];
      localStorage.setItem(
        "streaks",
        JSON.stringify([...pastStreaks, ...newStreak])
      );
    }
    // update the question stack to remove the one the user just answered
    answered(question.id);
    // reset quiz values and show end of streak screens
    setIsAnswering(true);
    setAnsweredCorrectly(undefined);
    setIsEndOfStreak(true);
  };

  const resetQuiz = () => {
    // if the current streak is longer than the max streak, reload the max streak
    if (streak.length > maxStreak?.score) {
      getStreakHistory(auth.id);
    }
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
          <div className={styles.streakContainer}>
            <div>{streak.length} correct in a row</div>
            <div>Longest streak: {longestStreak} </div>
          </div>
        </div>
        {isEndOfStreak ? (
          <EndOfStreak
            addStreak={addStreak}
            resetQuiz={resetQuiz}
            longestStreak={longestStreak}
            streakTotal={streak.length}
            streak={[
              ...streak,
              { questionId: questions[0].id, answeredCorrectly: false },
            ]}
          />
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
  const { auth } = state;
  const { maxStreak } = state.streak;

  return {
    auth,
    maxStreak,
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
    getStreakHistory(userId) {
      if (userId) {
        dispatch(getMaxStreakForUser(userId));
      }
    },
  };
};

export default connect(mapState, mapDispatch)(PlayQuiz);
