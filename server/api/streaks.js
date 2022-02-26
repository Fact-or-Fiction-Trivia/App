/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag, Streak, UserAnswered }
} = require("../db");

const { requireToken, isAgentOfUser } = require("./middleware");

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
 * POST /
 * Create streak with userAnswered questions
 */
router.post("/", requireToken, async (req, res, next) => {
  try {
    const answeredQuestions = [];

    // Get all of the question this user has answered previously
    // and store them into an array of ids
    const answeredQuestionIds = await User.findByPk(req.user.id, {
      include: [{ model: Question }]
    }).then(({ questions }) => questions.map(({ id }) => id));

    // Interate over each question in this streak
    for (const question of req.body) {
      // Check if this question has already been answered before
      const hasQuestion =
        answeredQuestionIds.findIndex(it => it === question.questionId) !== -1;

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
        streakId: streak.id
      });
    }

    res.json(score);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
