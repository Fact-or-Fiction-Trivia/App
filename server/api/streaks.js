/* eslint-disable no-unused-vars */
const router = require("express").Router();
const moment = require("moment");

const {
  Op,
  models: { User, Question, Streak, UserAnswered },
} = require("../db");

const { requireToken } = require("./middleware");

/**
 * GET/:id/
 * Get the highest streak for the user
 */

router.get("/", requireToken, async (req, res, next) => {
  try {
    res.json(req.user.maxScore);
  } catch (err) {
    next(err);
  }
});

/**
 * GET/all-scores/:id/
 * Get the highest streak for the user
 */

router.get("/all-scores/:id", requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    const week = await user.getStreaks({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("week").toDate(),
        },
      },
      order: [["score", "DESC"]],
    });

    const month = await user.getStreaks({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("month").toDate(),
        },
      },
      order: [["score", "DESC"]],
    });

    res.json({
      allTime: parseInt(user.maxScore),
      month: month[0]?.score || 0,
      week: week[0]?.score || 0,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET/all-scores/
 * Get the highest 10-25 streaks all users per time period (week, month, all time)
 */

router.get("/", requireToken, async (req, res, next) => {
  try {
    // get all the user-answered for all users within the last week and return the highest 10-25 streaks
    // get all the user-answered for all users within the last month and return the highest 10-25 streaks
    // get all the user-answered for all users  and return the highest 10-25 streaks
    // average of longest streaks in time period by each person affiliated with that party
    // res.json(req.user.maxScore);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /
 * Create streak with userAnswered questions
 */
router.post("/", requireToken, async (req, res, next) => {
  try {
    const answeredQuestions = [];

    // Get all of the question this user has answered previously
    // and store them into an array of ids
    const answeredQuestionIds = await User.findByPk(req.user.id, {
      include: [{ model: Question }],
    }).then(({ questions }) => questions.map(({ id }) => id));

    // Interate over each question in this streak
    for (const question of req.body) {
      // Check if this question has already been answered before
      const hasQuestion =
        answeredQuestionIds.findIndex((it) => it === question.questionId) !==
        -1;

      // If this question has not been answered before
      // add it to the answeredQuestions array
      if (!hasQuestion) {
        answeredQuestions.push(question);
      }
    }

    /**
     * The above code is required in the following case:
     * 1. Loggedin user answered questions 1,2,3 and saves
     * the streak into the database
     * 2. Non-loggedin user (Same person) starts playing in another browser
     * with different local storage
     * 3. Non-loggedin user answers questions 1,2,3 again and
     * signs into their account
     *
     * In this case the questions 1,2,3 have already been answered
     * and will cause an error in this route.
     *
     * So we check each question against the users answered questions
     * and filter out any that have already been answered.
     *
     * TODO: Need to alert user that their streak has been decreased
     * to account for duplicate answers.
     */
    let score = answeredQuestions.length - 1;

    const streak = await Streak.create({ score, userId: req.user.id });

    for (const question of answeredQuestions) {
      await UserAnswered.create({
        ...question,
        userId: req.user.id,
        streakId: streak.id,
      });
    }

    res.json(score);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
