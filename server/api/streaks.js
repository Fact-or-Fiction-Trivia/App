/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag, Streak, UserAnswered },
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
    const answeredQuestions = req.body;
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
