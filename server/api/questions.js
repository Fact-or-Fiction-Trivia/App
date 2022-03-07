/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag, UserAnswered },
} = require("../db");

const { requireTokenOptional } = require("./middleware");

/**
 * GET /
 * All Questions
 */
router.put("/", requireTokenOptional, async (req, res, next) => {
  try {
    const answeredQuestionsLocally = Object.keys(req.body.answeredQuestions);

    if (req.user) {
      const answeredQuestionIds = await User.findByPk(req.user.id, {
        include: [{ model: Question }],
      }).then(({ questions }) => questions.map(({ id }) => id));

      res.json(
        await Question.findAll({
          // filter by tag if a tag is provided
          include: req.body.tag
            ? [{ model: Tag, where: { id: req.body.tag } }]
            : [Tag],
          where: {
            id: {
              [Op.notIn]: [...answeredQuestionIds, ...answeredQuestionsLocally],
            },
          },
        })
      );
    } else {
      res.json(
        await Question.findAll({
          // filter by tag if a tag is provided
          include: req.body.tag
            ? [{ model: Tag, where: { id: req.body.tag } }]
            : [Tag],
          where: {
            id: { [Op.notIn]: answeredQuestionsLocally },
          },
        })
      );
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:questionId
 * Question with question ID
 */
router.get("/:questionId", async (req, res, next) => {
  try {
    const { questionId } = req.params;
    res.json(await Question.findByPk(questionId));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:questionId
 * Question with question ID
 */
router.get("/:questionId/percentage", async (req, res, next) => {
  try {
    const { questionId } = req.params;
    res.json(
      await UserAnswered.findAll({
        where: { questionId },
      }).then((answeredQuestions) => {
        if (!answeredQuestions.length) return 0;
        const numTotal = answeredQuestions.length;
        const numTrue = answeredQuestions
          .map((q) => q.answeredCorrectly)
          .filter((correct) => correct).length;
        return (numTrue / numTotal) * 100;
      })
    );
  } catch (err) {
    next(err);
  }
});

module.exports = router;
