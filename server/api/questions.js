/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Question, Tag, UserAnswered },
} = require("../db");

const { requireToken, requireTokenOptional } = require("./middleware");

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
            status: req.body.status,
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
            status: req.body.status,
          },
        })
      );
    }
  } catch (err) {
    console.log(err);
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
        if (!answeredQuestions.length) return null;
        const numTotal = answeredQuestions.length;
        const numTrue = answeredQuestions
          .map((q) => q.answeredCorrectly)
          .filter((correct) => correct).length;
        return Math.floor((numTrue / numTotal) * 100);
      })
    );
  } catch (err) {
    next(err);
  }
});

/**
 * POST /
 * Create a new question - both user and admin-submitted
 */
router.post("/", requireToken, async (req, res, next) => {
  try {
    const { answer, expiration, explanation, source, status, tagId, text } =
      req.body;
    const q = await Question.create({
      answer,
      expiration,
      explanation,
      source,
      status,
      text,
      author: req.user.id,
    });

    q.addTag(tagId);

    res.send({ status: 200 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
