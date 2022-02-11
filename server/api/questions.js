/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag },
} = require("../db");

const { requireToken, requireTokenOptional } = require("./middleware");

/**
 * GET /
 * All Questions
 */
router.get("/", requireTokenOptional, async (req, res, next) => {
  try {
    if (req.user) {
      const answeredQuestionIds = await User.findByPk(req.user.id, {
        include: [{ model: Question }],
      }).then(({ questions }) => questions.map(({ id }) => id));

      res.json(
        await Question.findAll({
          include: [Tag],
          where: { id: { [Op.notIn]: answeredQuestionIds } },
        })
      );
    } else {
      res.json(await Question.findAll());
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

module.exports = router;
